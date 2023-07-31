const { catchAsync } = require('../../utils');
const contactService = require('../../services/contactServices');
/**
 * Find all contact controller
 */
const getAllContacts = catchAsync(async (req, res) => {
  const { contacts, total } = await contactService.getAllContacts(
    req.query,
    req.user
  );

  res.status(200).json({
    msg: 'Success',
    contacts,
    total,
    owner: req.user,
  });
});

module.exports = getAllContacts;
