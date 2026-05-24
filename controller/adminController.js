import Blog from "../models/Posts.js";


export const getAdminBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};