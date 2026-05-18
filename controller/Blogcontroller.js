import { uploadImg } from "../config/cloud.js";
import Blog from "../models/Posts.js";

const createblog =async (req,res)=>{
  try {
      const {title,content} = req.body
console.log('req.user--->',req.user);
console.log('req.file--->',req.file);


if(!req.file){
return res.status(400).json({messag:'image requied'})
}

const uploaData = await uploadImg(req.file)
if(!uploaData){
  return res.status(400).json({
    status:false,
    messag:"error in upload image"
  })
}
console.log('upl--->',uploaData);
console.log('url--->',uploaData.secure_url);
console.log('public_id--->',uploaData.public_id);
let data = {
 title,
 content,
 author:req.user._id,
 image:uploaData.secure_url,
 public_id:uploaData.public_id
}
 const blog = await Blog.create(data);
 res.status(201).json({
  status:true,
  messag:'blog created succesfully',
  blog:blog
 })
  } catch (error) {
     res.status(404).json({
  status:false,
  messag:error.message,

 })
  }






}

export {createblog}