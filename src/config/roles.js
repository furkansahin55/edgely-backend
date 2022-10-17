const allRoles = {
  free: [],
  premium: ['trending', 'minting', 'collection', 'labels'],
  admin: ['trending', 'minting', 'collection', 'labels'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
