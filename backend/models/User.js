const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
    fullName: {
      type: String,
      required: [true, "Name Required!"],
    },
    email: {
      type: String,
      required: [true, "Email Required!"],
    },
    phone: {
      type: String,
      required: [true, "Phone Required!"],
    },
    aboutMe: {
      type: String,
      required: [true, "About Me Section Is Required!"],
    },
    password: {
      type: String,
      required: [true, "Password Required!"],
      minLength: [8, "Password Must Contain At Least 8 Characters!"],
      select: false
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    resume: {
      tyep:String
    },
    portfolioURL: {
      type: String,
      required: [true, "Portfolio URL Required!"],
    },
    githubURL: {
      type: String,
    },
    instagramURL: {
      type: String,
    },
    twitterURL: {
      type: String,
    },
    linkedInURL: {
      type: String,
    },
    facebookURL: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},{
  timestamps:true
});

UserSchema.pre("save", async function(next){
    const user = this;
    // Only hash the password if it's modified
    if (!user.isModified('password')){
        return next();
    }
    try {
        // Generating a salt
        const salt = await bcrypt.genSalt(10);

        // Hashing the password with the generated salt
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Overriding the plaintext password with the hashed one
        user.password = hashedPassword;

        next();
    }catch (error) {
        return next(error);
    }
});

UserSchema.methods.comparePassword = async function (enteredPassword){
    if (!this.password) {
        throw new Error("Please enter password");
    }
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES,
    });
};

UserSchema.methods.getPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;

}


module.exports = mongoose.model("User", UserSchema);

