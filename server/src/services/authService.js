import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from './prisma.js';

/**
 * Helper to generate JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Register a new user
 */
export const register = async ({ email, password, role }) => {
  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    const error = new Error('Email is already registered');
    error.status = 409;
    throw error;
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create the user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      role
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  // 4. Generate token
  const token = generateToken(user.id, user.role);

  return { token, user: { ...user, hasProfile: false } };
};

/**
 * Login user
 */
export const login = async ({ email, password }) => {
  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { workerProfile: true, employerProfile: true }
  });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  // 2. Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  // 3. Generate token
  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      hasProfile: !!(user.workerProfile || user.employerProfile)
    }
  };
};

/**
 * Get current authenticated user details
 */
export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workerProfile: true, employerProfile: true }
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    hasProfile: !!(user.workerProfile || user.employerProfile)
  };
};

/**
 * Update user's password
 */
export const updatePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error('Incorrect current password');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  return { message: 'Password updated successfully' };
};

/**
 * Authenticate with Google access token (sign up/sign in)
 */
export const googleAuth = async ({ accessToken, role }) => {
  // 1. Verify access token and get user info from Google
  let googleUser;
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = new Error('Invalid Google access token');
      error.status = 401;
      throw error;
    }

    googleUser = await response.json();
  } catch (err) {
    const error = new Error(err.message || 'Google authentication failed');
    error.status = err.status || 401;
    throw error;
  }

  const { email } = googleUser;

  if (!email) {
    const error = new Error('Google account does not provide an email address');
    error.status = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase();

  // 2. Look up user by email
  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { workerProfile: true, employerProfile: true }
  });

  if (!user) {
    // Generate a random secure password for the new OAuth user
    const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    // Create new user (Google signup defaults to WORKER; role can be changed on onboarding screen)
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        role: role || 'WORKER',
      },
      include: { workerProfile: true, employerProfile: true }
    });
  }

  // 4. Generate app JWT token
  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      hasProfile: !!(user.workerProfile || user.employerProfile)
    },
  };
};

/**
 * Update user role (only allowed before setting up profile)
 */
export const updateRole = async ({ userId, role }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { workerProfile: true, employerProfile: true }
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  if (user.workerProfile || user.employerProfile) {
    const error = new Error('Cannot change role after profile has been set up');
    error.status = 400;
    throw error;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  return {
    ...updatedUser,
    hasProfile: false
  };
};

