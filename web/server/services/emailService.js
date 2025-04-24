const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

//create the transporter
export const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (email, resetUrl, userData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Password Reset" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Your Password Reset Link (Valid for 10 minutes)",
      text: `
      Hello ${userData.name},
      
      You requested to reset your password. Please use the following link to set a new password:
      
      ${resetURL}
      
      If you didn't request this, please ignore this email and your password will remain unchanged.
      
      The password reset link will expire in 10 minutes.
      
      Regards,
      Your App Team
            `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("Error in sending reset password mail: ",error);
    return res.status(500).json({message:error.message});
  }
};


