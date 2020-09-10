const {
  registerSchema,
  loginSchema,
} = require("../models/validations/user_validation");

function createValidationRules(schema) {
  const defaultOpts = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };

  //your browser --> makes a request to a web server -->
  // on the server :

  return function (req, res, next) {
    const { value, error } = schema.validate(req.body, defaultOpts);
    console.log(value);
    if (error) {
      return next(
        `Error happened: ${error.details.map((a) => a.message).join(",")}`
      );
    }
    req.body = value;
    next();
  };
}

function userIsLoggedIn(req, res, next) {
  if (!req.user) {
    res.redirect("/");
  } else {
    next();
  }
}
//

function normaliseUsername(req, res, next) {
  const { usernameOrPhone } = req.body;
  const isNumeric = (value) => /^[0-9]*$/.test(value);

  if (isNumeric(usernameOrPhone)) {
    req.body.phone = usernameOrPhone;
  } else {
    req.body.username = usernameOrPhone;
  }
  //discard the unused property
  delete req.body.usernameOrPhone;
  return next();
}

module.exports = {
  normaliseUsername,
  userIsLoggedIn,
  validateRegister: createValidationRules(registerSchema),
  validateLogin: createValidationRules(loginSchema),
};
