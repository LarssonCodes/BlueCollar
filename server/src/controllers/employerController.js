import * as employerService from '../services/employerService.js';

export const createProfile = async (req, res) => {
  const result = await employerService.createProfile(req.user.userId, req.body);
  res.status(201).json({
    success: true,
    data: result
  });
};

export const getProfile = async (req, res) => {
  const result = await employerService.getProfile(req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const updateProfile = async (req, res) => {
  const result = await employerService.updateProfile(req.user.userId, req.body);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const getEmployerStats = async (req, res) => {
  const result = await employerService.getEmployerStats(req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const getRecentEmployerJobs = async (req, res) => {
  const result = await employerService.getRecentEmployerJobs(req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};

