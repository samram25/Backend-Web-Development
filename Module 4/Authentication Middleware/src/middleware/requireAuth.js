
const jwt = require('jsonwebtoken');

module.exports = function requireAuth(req, res, next) {
  // 1. Read the Authorization header
  const authHeader = req.headers.authorization ?? '';

  // 2. Extract the Bearer token
  const match = /^Bearer ([^\s]+)$/i.exec(authHeader);
  const token = match ? match[1] : null;

  // 3. Return 401 if the token is missing
  if (!token) {
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required',
      },
    });
  }

  // 4. Verify the token
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    // 5. Attach the verified user and continue
    req.user = payload;
    return next();
  } catch (_error) {
    // Return the same generic 401 for every verification error
    return res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required',
      },
    });
  }
};
