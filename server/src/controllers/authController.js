import * as authService from '../services/authService.js';

export const register = async (req, res) => {
  const { email, password, role } = req.body;
  const result = await authService.register({ email, password, role });
  res.status(201).json({
    success: true,
    data: result
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.status(200).json({
    success: true,
    data: result
  });
};

export const me = async (req, res) => {
  const result = await authService.getMe(req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.updatePassword({
    userId: req.user.userId,
    currentPassword,
    newPassword
  });
  res.status(200).json({
    success: true,
    data: result
  });
};

export const googleAuth = async (req, res) => {
  const { accessToken, role } = req.body;
  const result = await authService.googleAuth({ accessToken, role });
  res.status(200).json({
    success: true,
    data: result
  });
};

export const updateRole = async (req, res) => {
  const { role } = req.body;
  const result = await authService.updateRole({ userId: req.user.userId, role });
  res.status(200).json({
    success: true,
    data: result
  });
};


