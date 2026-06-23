import { verifyToken } from '../utils/generateToken.js';
import { sendError } from '../utils/apiResponse.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Access denied. No token provided.', 401);
    }

    // 2. Extract the token
    // Header looks like: "Bearer eyJhbGci..."
    const token = authHeader.split(' ')[1];

    // 3. Verify the token
    const decoded = verifyToken(token);
    // decoded = { id: '64f1a2b3', iat: ..., exp: ... }

    // 4. Check user still exists in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 'User no longer exists.', 401);
    }

    // 5. Attach user to request object
    req.user = {
      id:    user._id,
      name:  user.name,
      email: user.email,
    };

    // 6. Continue to the next middleware or controller
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid token.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Token has expired. Please login again.', 401);
    }
    return sendError(res, 'Authentication failed.', 401);
  }
};