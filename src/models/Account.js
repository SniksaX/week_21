import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false }
});

export const Account = mongoose.model("Account", accountSchema);