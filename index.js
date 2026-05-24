import express from 'express'; 
import 'dotenv/config';
import dbConnection from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cors from "cors";
import blogRouter from './routes/blogRoutes.js';
import adminRouter from './routes/adminRoutes.js';
  
const app = express();

dbConnection();

////// midddleware
app.use(express.json());
app.use(cors());


///// routes

app.use('/api/auth', authRoutes)
app.use('/api/blog', blogRouter)
app.use('/api/admin', adminRouter)

app.listen(process.env.PORT, ()=>console.log(`Server is running on port ${process.env.PORT}`));