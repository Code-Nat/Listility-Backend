const mongoose = require("mongoose");
const validator = require ('validator');

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

const task = new mongoose.Schema({

});

const list = new mongoose.Schema({
  listTitle: {
    type: String,
    required: [true, 'Please provide title'],
    minlength: 3,
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

module.exports = {
    user: user,
    task: task,
    list: list
}