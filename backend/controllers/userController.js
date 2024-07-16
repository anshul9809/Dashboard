const cloudinary = require("cloudinary").v2;
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const path = require("path");
const {generateToken} = require("../utils/jwtToken");
const {sendMail} = require("../utils/sendMail");
const crypto = require("crypto");

const registerUser = expressAsyncHandler(async (req,res)=>{
    if(!req.files || Object.keys(req.files).length === 0){
        throw new Error("Avatar Required");
    }
    const {avatar} = req.files;
    console.log("avatar is ", avatar)
    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {folder:"AVATARS",        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("cloudinary error: ", cloudinaryResponse.error || "Unknown error in cloudinary");
        throw new Error("Error while uploading avatar");
    }
    
    const {
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        twitterURL,
        linkedInURL,
        facebookURL,
        resume
    } = req.body;
    const user = await User.create({
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        twitterURL,
        linkedInURL,
        facebookURL,
        resume,
        avatar: {
            public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
            url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
        },
    });
    generateToken(user, "Registered!", 201, res);
});

const login = expressAsyncHandler(async (req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        throw new Error("Please fill all the required fields");
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        throw new Error("Invalid Credentials");
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new Error("Invalid Credentials");
    }
    generateToken(user, "Logged In!", 200, res);
});

const logout = expressAsyncHandler(async (req,res)=>{
    res
    .status(200)
    .cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    .json({
        success: true,
        message: "Logged Out!",
    });
});

const getProfile = expressAsyncHandler(async (req,res)=>{
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success:true,
        user
    })
})

const updateProfile = expressAsyncHandler(async (req,res)=>{
    const newUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        githubURL: req.body.githubURL,
        instagramURL: req.body.instagramURL,
        portfolioURL: req.body.portfolioURL,
        facebookURL: req.body.facebookURL,
        twitterURL: req.body.twitterURL,
        linkedInURL: req.body.linkedInURL,
        resume:req.body.resume
    }
    if(req.files && req.files.avatar){
        const avatar = req.files.avatar;
        const user = await User.findById(req.user._id);
        const profileImageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(profileImageId);
        const cloudinaryResponse = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {folder:"AVATARS",}
        );
        if(!cloudinaryResponse || cloudinaryResponse.error){
            console.error("cloudinary error: ", cloudinaryResponse.error || "Unknown error in cloudinary");
            throw new Error("Error while uploading avatar");
        }
        newUserData.avatar = {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        };
    }
    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Profile Updated!",
        user,
    });
});

const updatePassword = expressAsyncHandler(async (req,res)=>{
    const {currentPassword, newPassword, confirmPassword} = req.body;
    if(!currentPassword || !newPassword || !confirmPassword){
        throw new Error("Please fill all the required fields");
    }
    const user = await User.findById(req.user._id).select("+password");
    const isPasswordMatched = await user.comparePassword(currentPassword);
    if(!isPasswordMatched){
        throw new Error("Incorrect Password");
    }
    if(newPassword !== confirmPassword){
        throw new Error("New password and confirm password doesn't match");
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
        success:true,
        message:"Password Updated",
        user
    });
});

const getPortfolioUser = expressAsyncHandler(async (req,res)=>{
    const id = process.env.MONGO_DB_ID;
    const user = await User.findById(id);
    res.status(200).json({status:true,
        user
    })
});

const forgotPassword = expressAsyncHandler(async (req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        throw new Error("User not found");
    }
    const resetToken = user.getPasswordResetToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordURL = `${process.env.DASHBOARD_URL}/forgot-password/reset/${resetToken}`;
    const message = `Your Reset Password Token is:- \n\n ${resetPasswordURL}  \n\n If You've not requested this email then, please ignore it.`;

    try{
        await sendMail({
            email: user.email,
            subject: "Forgot Passsword Recovery",
            message: message,
        });
        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email} successfully`
        });
    }catch(err){
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save();
        throw new Error("Error while sending email");
    }
});

const resetPassword = expressAsyncHandler(async (req,res)=>{
    //resetting the password using the forgot password link sent to email
    const { token } = req.params;
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if(!user){
        throw new Error("User not found");
    }
    if(req.body.password !== req.body.confirmPassword){
        throw new Error("Password and confirm password doeesn't match");
    }
    user.password = await req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    generateToken(user, "Reset Password Successfully!", 200, res);

});

module.exports = {
    registerUser,
    login,
    logout,
    getProfile,
    updateProfile,
    updatePassword,
    getPortfolioUser,
    forgotPassword,
    resetPassword
};