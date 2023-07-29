const { Types } = require('mongoose');

const Contact = require('../models/contactModel');
const { AppError } = require('../utils');

/**
 * Check if contact exists services.
 * @param {Object} filter
 * @returns {Promise<void>}
 */
exports.contactExists = async filter => {
  const contactExists = await Contact.exists(filter);

  if (contactExists) {
    throw new AppError(409, 'Contact with this email exists..');
  }
};

/**
 * Check if contact by id exists services.
 * @param {string} id
 * @returns {Promise<void>}
 */
exports.contactExistsById = async id => {
  const idIsValid = Types.ObjectId.isValid(id);

  if (!idIsValid) throw new AppError(404, 'Contact does not exist..');

  const contactExists = await Contact.exists({ _id: id });

  if (!contactExists) throw new AppError(404, 'Contact does not exist..');
};

/**
 * Create contact service.
 * @param {Object} contactData
 * @param {Object} owner - contact owner
 * @returns {Promise<Contact>}
 */
exports.addContact = (contactData, owner) => {
  const { name, email, phone } = contactData;

  // const newContact = await Contact.create(contactData);

  // newContact.password = undefined;

  return Contact.create({
    name,
    email,
    phone,
    owner,
  });
};

/**
 * Get contacts services.
 * @param {Object} options -search, pagination, sort options
 * @returns {Promise<User[]>}
 */
exports.getAllContacts = async options => {
  const findOptions = { favorite: { $regex: options.favorite } };

  const contacts = await Contact.find(findOptions);

  return contacts;
};

/**
 * Get contact by id service.
 * @param {string} id
 * @returns {Promise<Contact>}
 */
exports.getContactById = id => Contact.findById(id);

/**
 * Delete contact by id service.
 * @param {string} id
 * @returns {Promise<void>}
 */
exports.removeContact = id => Contact.findByIdAndDelete(id);

/**
 * Update contact data
 * @param {string} id
 * @param {*Object} contactData
 * @returns {Promise<Object>}
 */
exports.updateContact = async (id, contactData) => {
  const contact = await Contact.findById(id);

  Object.keys(contactData).forEach(key => {
    contact[key] = contactData[key];
  });

  return contact.save();
};

/**
 * Update contact favorite status service.
 * @param {string} id
 * @param {boolean} favorite
 * @returns {Promise<Contact>}
 */
exports.updateContactFavorite = async (id, favorite) => {
  const updateContact = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    {
      new: true,
    }
  );

  if (!updateContact) {
    throw new AppError(404).json({ message: 'Contact not found.' });
  }

  return updateContact;
};
