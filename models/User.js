import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userScema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'block'],
    default: "active"
  }

}, {
  timestamp: true
}); 

userScema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  // next();
});

userScema.methods.comparePswd = function(userPswd){
return bcrypt.compare(userPswd, this.password);
}




const User = mongoose.model('user', userScema);
export default User;