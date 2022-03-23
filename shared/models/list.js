import mongoose from 'mongoose'

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
    _id:{
      type:mongoose.Types.ObjectId()
    },
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

export default new mongoose.Schema('Lists', ListSchema)