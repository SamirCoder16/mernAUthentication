import userModel from "../models/usermodel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/nodemailer.js'
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTamplate.js";

//  register API for create user . 
export const register = async (req, res) =>{
    //   get the user data from request body
    const { name, email, password } = req.body;

    //   check the all schema are fullfield or not
    if(!name || !email || !password){
        return res.status(400).json({ success: false , msg : 'Please enter all fields' });
    }

    try {
        //  check the user is already exist 
        const exitingUser = await userModel.findOne({ email });
        if(exitingUser){
            //  then return the message 
            return res.json({ success: false, message: 'User already exists with this email '})
        }
        //  In this Salt Round  the number is between 5 to 15 . and encrypt the user password 
        const hashedPassword = await bcrypt.hash(password, 10);

        //  save the user data to the database with hashed password
        const user = new userModel({
            name,
            email,
            password: hashedPassword
        })

        await user.save();

        //  Generate the jsonwebtoken and expire within 7 Days .
        const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

         //  Send the token as a cookies with apply this all methods .
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV ===  'production',
            sameSite: process.env.NODE_ENV ===  'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiry time for this cookies 
        });
        //  structure of the sending emails .
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Website',
            text: `Welcom to our Website. Your Account has been created with email id: ${email}`
            
        }
        //  Sending Email for complete registration .
        await transporter.sendMail(mailOption)

        return res.status(200).json({ success: true, message: 'registration successful' })

    } catch (error) {
        res.status(404).json({ success: false, msg : error.message });
        console.log(error)
    }
}

  //   Login API for user Login 
export const login = async (req, res) => {
     //   get the user data from request body
    const { email, password } = req.body;
  //   check the all schema are fullfield or not 
    if(!email || !password){
        return res.status(400).json({ success: false, msg : 'Please enter all fields' });
    }
 
    try {
        //  check the email which user is provided 
        const user = await userModel.findOne({ email }); 
        if(!user){
            return res.json({ success: false, message: 'Invalid credentials' })
        }
        //  check the password is correct or not which user is provided
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({ success: false, message: 'Invalid credentials' })
        }
         //  Generate the jsonwebtoken and expire within 7 Days .
         const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

         //  Send the token as a cookies with apply this all methods .
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV ===  'production',
            sameSite: process.env.NODE_ENV ===  'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days expiry time for this cookies 
        })

       return res.status(200).json({ success: true, message: 'Login successful' })

    } catch (error) {
        res.status(404).json({ success: false, msg : error.message });
    }

}

//   Logg Out API for user Login Out 
export const logout = async (req,res) => {
    try {
        //  remove token from the cookie 
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV ===  'production',
            sameSite: process.env.NODE_ENV ===  'production' ? 'none' : 'strict',
        });
        //  Logged out message 
        return res.status(200).json({ success: true, message: 'Logged out' });

    } catch (error) {
        res.status(404).json({ success: false, msg : error.message });
    }
}

//  Verify the user Account for send OTP to the user's Email 
export const sendVerifyOtp = async (req,res) => {
    try {
        //  this userId getting from the body .
        const { userId } = req.body;
        //  Find the user using findById Methods .
        const user = await userModel.findById(userId);
        //  if user is not exist then return the message .
        if(user.isAccountVerified){
            return res.status(404).json({ success: false, message: 'Account alreeady verified' });
        }
        //  Generate a random number for OTP.
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        //  Store the otp in dataBase
        user.verifyOtp = otp;
        // expire time for the otp 
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        //  save the user
        await user.save();
        //  sending email for verify OTP
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify Your Account',
            // text: `Your OTP is: ${otp} . Verify your account using this OTP`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        //  Sending Email for complete verification .
        await transporter.sendMail(mailOption)

        return res.status(200).json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        res.status(404).json({ success: false, msg : error.message });  
    }
}

//  Verify the user Account for verify OTP from the user's Email
export const verifyEmail = async (req,res) => {
    const { userId, otp } = req.body;
    //   check the opt and id is given or not
    if(!userId || !otp){
        return res.status(400).json({ success: false, msg : 'Missing details' });
    }
    try {
        //  Find the user using findById Methods .
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        //  check the otp is valid or not and expired or not  .  if not then return the message .  else update the user's data  .  and return the message .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
        if(user.verifyOtp!== otp || user.verifyOtp === ''){
            return res.status(404).json({ success: false, message: 'Invalid OTP' });
        }
        //  check the otp expired or not .  if expired then return the message .  else update the user's data  .  and return the message .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .  .
        if(Date.now() > user.verifyOtpExpireAt){
            return res.status(404).json({ success: false, message: 'OTP expired' });
        }
        //  Update the user's data
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        // Save the updated user data to database
        await user.save();

        // Return success response after email verification
        return res.status(200).json({ success: true, message: 'Email verified successfully' });

    } catch (error) {
        // Handle errors and return error response
        res.status(404).json({ success: false, msg : error.message });
    }
}

// Middleware to check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
       // Return success response if user is authenticated
       return res.status(200).json({ success: true, message: 'user is authenticated' });
    } catch (error) {
        // Handle authentication check errors
        res.status(404).json({ success: false, msg : error.message });
    }
}

// Controller to send password reset OTP
export const sendReseteOtp = async (req , res) => {
    // Extract email from request body
    const { email } = req.body;
    // Validate email presence
    if(!email){
        return res.status(400).json({ success: false, msg : 'Missing details' });
    }
   try {
     // Find user by email
     const user = await userModel.findOne({ email })
     // Check if user exists
     if(!user){
        return res.status(404).json({ success: false, message: 'User not found' });
     }
      // Generate 6-digit OTP
      const otp = String(Math.floor(100000 + Math.random() * 900000))
      // Store OTP in user document
      user.resetOtp = otp;
      // Set OTP expiration time (15 minutes)
      user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
   
      // Save user with OTP data
      await user.save();

      // Configure email options for OTP
      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: 'Password Reset OTP',
        // text: `Your OTP for resetting your password is: ${otp} . Use this OTP to proceed with resetting your password`,
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    }

    // Send OTP email
    await transporter.sendMail(mailOption)

    // Return success response
    return res.status(200).json({ success: true, message: 'OTP sent sent to your email' });
   
   } catch (error) {
    // Handle errors in OTP sending process
    res.status(404).json({ success: false, msg : error.message });
   }
}

// Controller to reset password using OTP
export const resetPassword = async (req,res) => {
    // Extract required fields from request body
    const { email, otp, newPassword } = req.body;
    // Validate required fields
    if(!email || !otp || !newPassword){
        return res.status(400).json({ success: false, msg : 'Missing details' });
    }
    try {
        // Find user by email
        const user = await userModel.findOne({ email })
        // Verify user exists
        if(!user){
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Validate OTP
        if(user.resetOtp !== otp || user.resetOtp == ''){
            return res.status(404).json({ success: false, message: 'Invalid OTP' });
        }
        // Check if OTP is expired
        if(Date.now() > user.resetOtpExpireAt){
            return res.status(404).json({ success: false, message: 'OTP expired' });
        }
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update user password and clear OTP fields
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        // Save updated user data
        await user.save();
        // Return success response
        return res.status(200).json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        // Handle password reset errors
        res.status(404).json({ success: false, msg : error.message });
    }
}