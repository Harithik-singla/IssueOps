import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

// ── Register ───────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check all fields are provided
    if (!name || !email || !password) {
      return sendError(res, 'Name, email and password are required', 400);
    }

    // 2. Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendError(res, 'An account with this email already exists', 400);
    }

    // 3. Create the user (password gets hashed by pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Send response
    return sendSuccess(
      res,
      {
        token,
        user: {
          id:       user._id,
          name:     user.name,
          email:    user.email,
          initials: user.initials,
          avatar:   user.avatar,
        },
      },
      'Account created successfully',
      201
    );
  } catch (error) {
    // Handle duplicate email error from MongoDB
    if (error.code === 11000) {
      return sendError(res, 'An account with this email already exists', 400);
    }
    console.error('Register error:', error);
    return sendError(res, 'Registration failed. Please try again.', 500);
  }
};



// ── Login ──────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check fields provided
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    // 2. Find user by email — explicitly include password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // 3. Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // 4. Generate token
    const token = generateToken(user._id);

    // 5. Send response
    return sendSuccess(
      res,
      {
        token,
        user: {
          id:       user._id,
          name:     user.name,
          email:    user.email,
          initials: user.initials,
          avatar:   user.avatar,
        },
      },
      'Login successful'
    );
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 'Login failed. Please try again.', 500);
  }
};

// ── Get current user ───────────────────────────────────
export const getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    return sendSuccess(res, {
      user: {
        id:       user._id,
        name:     user.name,
        email:    user.email,
        initials: user.initials,
        avatar:   user.avatar,
        createdAt:user.createdAt,
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return sendError(res, 'Failed to fetch user', 500);
  }
};

// ── Logout ─────────────────────────────────────────────
export const logout = async (req, res) => {
  // JWT is stateless — logout is handled on the frontend
  // by deleting the token from localStorage.
  // This endpoint exists so the frontend has something to call.
  return sendSuccess(res, {}, 'Logged out successfully');
};