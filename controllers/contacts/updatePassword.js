const updatePassword = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

module.exports = updatePassword;
