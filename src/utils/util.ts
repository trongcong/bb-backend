import { User } from '@packages/users/users.interface';

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const getUserReturn = (user: User) => ({
  _id: user._id,
  address: user.address,
  avatar: user.avatar,
  created_at: user.created_at,
  email: user.email,
  is_verified: user.is_verified,
  last_pass_change_at: user.last_pass_change_at,
  name: user.name,
  notification: user.notification,
  phone_number: user.phone_number,
  roles: user.roles,
  updated_at: user.updated_at,
  website: user.website,
});
