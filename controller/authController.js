import User from '../models/User.js';
import _sendEmail from '../utils/Email.js';
import { signInToken } from '../utils/token.js';
import jwt from 'jsonwebtoken';


export const signUp = async (req, res) => {
  console.log(">>>>> ", req.body);

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json(
        { success: false, message: "Missing required fields" }
      )
    }


    /////// check user
    const isExist = await User.findOne({ email });

    if (isExist) {
      res.status(200).json({
        success: false,
        message: 'Email already Registered!'
      })
    }

    /////// create user

    const user = await User.create(req.body);
    const token = signInToken(user);

    let userWithoutPswd = user.toObject();
    delete userWithoutPswd.password;

    res.status(201).json({
      message: 'User creates successfully',
      success: true,
      token,
      user: userWithoutPswd
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Signup failed'
    })
  }
}

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePswd(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials"
      })
    }

    let userWithoutPswd = user.toObject();
    delete userWithoutPswd.password;

    const token = signInToken(user);

    res.status(201).json({
      message: 'SignIn successfully!',
      success: true,
      token,
      user: userWithoutPswd
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'SignIn failed'
    })
  }
}

export const forgotPswd = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    })
  }



/////// reset pswd token
const resetToken = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:'1d'});
const redirectLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`



try {

await _sendEmail({
  to: user.email,
  subject:'Reset Password',
  html: `
  
    <div style="width: 90%; margin: 0 auto;">
    <h1>Reset Password</h1>
    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt, dolore mollitia quia delectus saepe id.</p>
    <p>Click here to reset password : <a style="color: green; text-decoration: none;" href="${redirectLink}">Reset</a></p>
  </div>
  
  `
});


res.status(200).json({
  success:true,
  message:'Password reset Email sent successfully'
})

  
} catch (error) {
  res.status(500).json({
    success:false,
    message:'Email send failed'
  })
}


}

export const resetPswd = async(req,res)=>{
const {password,token} = req.body;
try {
  
const decoded=jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id);

 if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    })
  }

  user.password = password;
  user.save();

  res.status(200).json({
    success:true,
    message:"Password reset successfully"
  })

} catch (error) {
   res.status(500).json({
    success:false,
    message:'Password rest failed',
    error:error.message
  })
}
}



//////// profile

export const profile = (req, res) => {
  res.status(200).json({ success: true, user: req.user })
}
