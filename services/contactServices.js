const { Types } = require('mongoose');

const Contact = require('../models/contactModel');
const { AppError } = require('../utils');
const userRolesEnum = require('../constans/userRolesEnum');
const User = require('../models/userModel');

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
 * @param {Object} user -owner
 * @returns {Promise<Object>}
 */
exports.getAllContacts = async (options, user) => {
  // Search by name or by email
  const findOptions = options.search
    ? {
        $or: [
          { name: { $regex: options.search, $options: 'i' } },
          { email: { $regex: options.search, $options: 'i' } },
        ],
      }
    : {};

  // Check if 'favorite' filter is provided
  if (options.favorite === 'true') {
    findOptions.favorite = true;
  }

  if (options.search && user.subscription === userRolesEnum.STARTER) {
    findOptions.$or.forEach(searchOption => {
      searchOption.owner = user;
    });
  }

  if (!options.search && user.subscription === userRolesEnum.STARTER) {
    findOptions.owner = user;
  }

  // INIT DATABASE QUERY =========================
  const contactsQuery = Contact.find(findOptions);

  // SORTINFG FEATURE=============================
  // orger = 'ASC' || 'DESC'
  contactsQuery.sort(
    `${options.order === 'DESC' ? '-' : ''}${options.sort || 'name'}`
  );

  // PAGINATION FEATURE===========================
  // limit 10 of 100 - limit of docs
  // skip 10 - count of skip docs

  const paginationPage = options.page ? +options.page : 1;
  const paginationLimit = options.limit ? +options.limit : 5;
  const skip = (paginationPage - 1) * paginationLimit;

  contactsQuery.skip(skip).limit(paginationLimit);

  const contacts = await contactsQuery;
  const total = await Contact.count(contactsQuery);

  return { contacts, total };
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

/**
 *
 * @param {String} id
 * @param {String} subscription
 * @returns
 */
exports.updateSubscription = async (id, subscription) => {
  const allowSubscriptions = ['starter', 'pro', 'business'];

  if (!allowSubscriptions.includes(subscription)) {
    throw new AppError(403).json({ message: 'Invalid subscription value' });
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError(404).json({ message: 'User not found' });
  }

  user.subscription = subscription;

  await user.save();

  return user;
};
