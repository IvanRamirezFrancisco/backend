// backend/models/Policies.js
const mongoose = require("mongoose");

const PoliciesSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

module.exports = mongoose.model("Policies", PoliciesSchema);