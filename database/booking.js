const mongoose = require("mongoose");
const bookingschema = new mongoose.Schema(
  {
    cid: {
      type: String,
      required: true,
    },
    cname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dsid: {
      type: String,
      required: true,
    },
    lid: {
      type: String,
      required: true,
    },
    bid: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("booking", bookingschema);
