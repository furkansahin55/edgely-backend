const allRoles = {
  free: [],
  premium: ['trending', 'minting', 'collection', 'labels', 'alerts', 'search'],
  admin: ['trending', 'minting', 'collection', 'labels', 'alerts'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
