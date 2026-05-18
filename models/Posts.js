import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const blogSchema = mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  image:{
    type:String
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  public_id:{
    type:String
  }
 

 
 

}, {
  timestamp: true
}); 








const Blog = mongoose.model('blog', blogSchema);
export default Blog;