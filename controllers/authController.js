import User, { validatePassword } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { generateRandomTokenHex } from "../utils/token.js";

export const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
}

export const register = async (req, res) => {
    const {fullname, email, password} = req.body;
    try {
        if(!validatePassword(password)) {
            return res.status(400).json({message: "Password must be atleast  8 char, include uppercase, lowercase, number, and special character."});
        }

        const userExists =  await User.findOne({email});
        if(userExists) return res.status(400).json({message: "User Already Exists"});

        const user = await User.create({fullname, email, password, isVerified: false});

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenHash = crypto
          .createHash("sha256")
          .update(verificationToken)
          .digest("hex");

        user.verificationToken = verificationTokenHash;
        user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs
        await user.save({ validateBeforeSave: false });

         user.verificationToken = verificationTokenHash;
          user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs
          await user.save({ validateBeforeSave: false });

          const verifyUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email/${verificationToken}`;

          const subject = "Verify your HealthSnap account";
          const html = `
            <p>Hello ${user.fullname},</p>
            <p>Welcome to <b>HealthSnap</b>! Please verify your email by clicking below:</p>
            <a href="${verifyUrl}" target="_blank" style="color: blue;">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
          `;

          await sendEmail({
            to: user.email,
            subject,
            html,
          }); 

        res.status(201).json({
        message:
          "Registration successful! Please check your email (inbox or spams) to verify your account.",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      });

    } catch (err) {
         console.error("Register error:", err);
         return res.status(500).json({message: err.message});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if (!user.isVerified) {
        return res.status(403).json({ message: "Please verify your email before logging in." });
        }
        if(user && await user.matchPassword(password)) {
            res.json({
                _id:user.id,
                fullname:user.fullname,
                email:user.email,
                token:generateToken(user.id),
            });
        } else {
            res.status(401).json({message:"Invalid email or password"});
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

export const forgotPassword = async (req, res) => {
  console.log("📩 Forgot password route hit");
  let user;

  try {
    const { email } = req.body;
    user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    console.log("Generated Reset Token (raw):", resetToken);
    console.log("Hashed Token (saved to DB):", hashedToken);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("Reset URL:", resetUrl);

    const subject = "Password Reset Request - HealthSnap";
    const html = `
      <p>Hello ${user.username || ""},</p>
      <p>We received a request to reset your password. Click below to reset it:</p>
      <a href="${resetUrl}" target="_blank" style="color:#1a73e8;">Reset Password</a>
      <p>This link is valid for 15 minutes.</p>
      <p>If you didn’t request this, please ignore this email.</p>
      <br/>
      <p>— The HealthSnap Team</p>
    `;

    await sendEmail({ to: email, subject, html });
    res.json({ message: "Password reset email sent successfully" });

  } catch (err) {
    console.error("❌ Forgot password error:", err);
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }
    res.status(500).json({ message: "Error sending password reset email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log("🔹 Raw token from URL:", token);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("🔹 Hashed token (for DB lookup):", hashedToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    console.log("🔹 Found user:", user ? user.email : "❌ None");

    if (!user)
      return res.status(400).json({ message: "Invalid or expired password reset token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log("✅ Password reset successfully for:", user.email);
    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    res.status(500).json({ message: "Password reset failed" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired verification token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({ message: "✅ Email verified successfully! You can now log in." });
  } catch (err) {
    console.error("❌ Email verification error:", err);
    res.status(500).json({ message: "Email verification failed" });
  }
};
