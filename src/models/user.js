const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 3,
    maxLength: 10,
  },
  email: {
    type: String,
    require: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new error("Envalid email id");
      }
    }
  },
  phone: {
    type: Number,
    required: true,
    minLength: 10
  },
  message: {
    type: String,
  },
  date:{
    type:Date,
    default:Date.now()
  }
});

//create collection
const UserData = mongoose.model("Userdata", userSchema);

//exports collection
module.exports = UserData;
