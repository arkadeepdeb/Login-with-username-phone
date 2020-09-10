var mongoose = require("mongoose");
var bcryptjs = require("bcryptjs");
var passportLocalMongoose = require("passport-local-mongoose");

// have a look at custom validations/ constraints that mongoose supports
var userSchema = new mongoose.Schema(
  {
    phone: String,
    username: {
      type: String,
      minlength: 4,
    },

    password: {
      type: String,
      minlength: 4,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hash(this.password, salt);

    this.password = hash;
    next();
  } catch (error) {
    next(` Oooh snap ! hash failed - ${error}`);
  }
});

userSchema.methods.comparePassword = async function (maybePassword) {
  try {
    return await bcryptjs.compare(maybePassword, this.password);
  } catch (error) {
    console.log(`error has happened: ${error}`);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
