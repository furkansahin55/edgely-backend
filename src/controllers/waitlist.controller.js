const catchAsync = require('../utils/catchAsync');
const { waitlistRepository } = require('../repositories');

const create = catchAsync(async (req, res) => {
  const user = await waitlistRepository.create(req.body.mail_address);
  res.status(200).send(user);
});

module.exports = {
  create,
};
