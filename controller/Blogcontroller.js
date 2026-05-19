import { deleteImg, uploadImg } from "../config/cloud.js";
import Blog from "../models/Posts.js";

const createblog =async (req,res)=>{
  try {
      const {title,content} = req.body
 
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



 const updateBlog = async (req, res) => {
  try {
    const { id } = req.params; 
    const { title, content } = req.body;

    let blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found!" });
    }

    let updatedData = { title, content };

    // 2. check image 
    if (req.file) {
      // A. remove old image
      if (blog.public_id) {
        await deleteImg(blog.public_id); 
      }

      // B. upload new img
      const newUploadData = await uploadImg(req.file);
      if (!newUploadData) {
        return res.status(400).json({ success: false, message: "Error in uploading new image" });
      }

      // C. add new image link in dara
      updatedData.image = newUploadData.secure_url;
      updatedData.public_id = newUploadData.public_id;
    }

    // 3. update data in db
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({
      success: true,
      message: "Blog updated successfully ✅",
      blog: updatedBlog
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getMyBlogs = async (req, res) => {
  try {
    const userId = req.user._id; 
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      message: "User blogs fetched successfully ✅",
      blogs: blogs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user blogs",
      error: error.message
    });
  }
};


export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Database mein blog ko dhundna aur author ki details (jaise name, email) sath nikalna
        const blog = await Blog.findById(id).populate("author", "name email");

        // 2. Agar blog nahi milta
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog nahi mila!"
            });
        }

        // 3. Agar mil jaye to success response bhejna
        return res.status(200).json({
            success: true,
            blog
        });

    } catch (error) {
        console.error("Error in getBlogById:", error);
        
        // Agar ID ka format galat ho (CastError)
        if (error.kind === "ObjectId") {
            return res.status(400).json({
                success: false,
                message: "Invalid Blog ID format"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server mein koi masla hua hai"
        });
    }
};

export { createblog, updateBlog, getMyBlogs };