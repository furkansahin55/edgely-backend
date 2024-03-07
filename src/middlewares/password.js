// Middleware function to protect routes with password from query
const passwordProtectionMiddleware = (req, res, next) => {
  // Get password from query
  const { password } = req.query;

  // Check if password is correct
  const isPasswordCorrect = password === 'edgelypass2050';
  if (!isPasswordCorrect) {
    // Password is incorrect, send 401 Unauthorized response
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  // Password is correct, proceed to the next middleware or route handler
  next();
};

module.exports = passwordProtectionMiddleware;
