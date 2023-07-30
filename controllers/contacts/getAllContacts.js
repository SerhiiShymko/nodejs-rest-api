const { catchAsync } = require('../../utils');
const contactService = require('../../services/contactServices');
/**
 * Find all contact controller
 */
const getAllContacts = catchAsync(async (req, res) => {
  const contacts = await contactService.getAllContacts(req.query, req.user);

  res.status(200).json({
    msg: 'Success',
    contacts,
  });
});

module.exports = getAllContacts;
