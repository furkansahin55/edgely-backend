const allRoles = {
  free: [],
  premium: ['trending', 'minting', 'collection'],
  admin: ['trending', 'minting', 'collection'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
