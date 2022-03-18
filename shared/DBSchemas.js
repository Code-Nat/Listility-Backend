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

});

module.exports = {
    user: user,
    task: task,
    list: list
}