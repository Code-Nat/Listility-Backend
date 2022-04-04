const mongoose = require("mongoose");
const validator = require ('validator');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');

const user = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 20,
      default: 'lastName',
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 6,
      select: false,
    },
    provider: {
      type: String,
      trim: true,
      maxlength: 20,
      default: '',
    },
    providerID: {
        type: String
    },
    key: {
        type: Array,
        maxLength: 46,
        default: []
    }
});

user.pre('save', async function () {
  // console.log(this.modifiedPaths())
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

user.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate email error'));
  } else {
    next(error);
  }
});

user.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME
  });
};

user.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
}

const list = new mongoose.Schema({
  listTitle: {
    type: String,
    required: [true, 'Please provide title'],
    minlength: 1,
    maxlength: 20,
    trim: true
  },
  dateCreated: {
    type: Date,
    default: new Date()
  },
  owningUser: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users'
  },
  taskList: [{
    id:String,
    taskTitle: String,
    isChecked: Boolean
  }],
  shares: [{
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  }]
});

list.methods.addTask = function (task) {
  this.taskList.push(task);
  return this;
}

list.methods.removeTask = function (taskID) {
  let index = this.taskList.findIndex((item => item._id == taskID));

  if (~index)
  {
    this.taskList.splice (index, 1);
    return this;
  }
  throw Error("Task ID was not found");
  //return undefined;
}

list.methods.updateTask = function (updatedTask)
{
  let index = this.taskList.findIndex((item => item._id == updatedTask.id));

  if (~index)
  {
    if (!updatedTask.taskTitle)
      updatedTask.taskTitle = this.taskList[index].taskTitle;
    if (!updatedTask.isChecked)
      updatedTask.isChecked = this.taskList[index].isChecked;
    updatedTask._id = this.taskList[index]._id;
    this.taskList[index] = updatedTask;
    return this;
  }
  throw Error("TaskId was not found");
}

module.exports = {
    user: user,
    list: list
}