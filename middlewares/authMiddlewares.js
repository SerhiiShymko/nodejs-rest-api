const { catchAsync, usersValidators, AppError } = require("../utils");
const userService = require("../services/userServices");

exports.checkRegisterUserData = catchAsync(async (req, res, next) => {
  const { error, value } = usersValidators.registerUserDataValidator(req.body);

  if (error) {
    console.log(error);

    throw new AppError(400, "Invalid user data..");
  }

  await userService.contactExists({ email: value.email });

  req.body = value;

  next();
});
