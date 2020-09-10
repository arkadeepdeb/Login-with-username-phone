const joiPhoneValidation = require("joi-phone-number");
const joi = require("joi");

//combining the two packages together

const userValidation = joi.extend(joiPhoneValidation);

const registerSchema = userValidation.object().keys({
  username: userValidation
    .string()
    .min(4)
    .max(100)
    .lowercase()
    .trim()
    .required(),

  phone: userValidation
    .string()
    .phoneNumber({
      defaultCountry: "IN",
      format: "national",
      strict: true,
    })

    .required(),

  password: userValidation
    .string()
    .min(4)
    .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
    .message(
      "Please ensure your password contains:  One uppercase letter, one lowercase letter and at least one digit"
    )
    .required(),
});

const loginSchema = userValidation.object().keys({
  username: userValidation.string().min(4).max(100).lowercase().trim(),

  phone: userValidation.string().phoneNumber({
    defaultCountry: "IN",
    format: "national",
    strict: true,
  }),
  password: userValidation
    .string()
    .min(4)
    .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
    .message("Incorrect Credentials!")
    .required(),
});

module.exports = { registerSchema, loginSchema };
