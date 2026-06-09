import * as workerService from '../services/workerService.js';

export const createProfile = async (req, res) => {
  const result = await workerService.createProfile(req.user.userId, req.body);
  res.status(201).json({
    success: true,
    data: result
  });
};

export const getProfile = async (req, res) => {
  const result = await workerService.getProfile(req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const updateProfile = async (req, res) => {
  const result = await workerService.updateProfile(req.user.userId, req.body);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const getWorkerStats = async (req, res) => {
  const result = await workerService.getWorkerStats(req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const getRecentWorkerApplications = async (req, res) => {
  const result = await workerService.getRecentWorkerApplications(req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};
