import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema(
  {
    noteTitle: {
      type: String,
      default: '',
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Lists', ListSchema)