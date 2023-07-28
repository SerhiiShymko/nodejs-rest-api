/**
 * Get logged in user data.
 */
const current = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

module.exports = current;
