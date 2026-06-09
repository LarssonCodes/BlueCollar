import * as jobService from '../services/jobService.js';

export const createJob = async (req, res) => {
  const result = await jobService.createJob(req.user.userId, req.body);
  res.status(201).json({
    success: true,
    data: result
  });
};

export const getEmployerJobs = async (req, res) => {
  const result = await jobService.getEmployerJobs(req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const getJobById = async (req, res) => {
  const result = await jobService.getJobById(req.params.id);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const updateJob = async (req, res) => {
  const result = await jobService.updateJob(req.params.id, req.user.userId, req.body);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const deleteJob = async (req, res) => {
  await jobService.deleteJob(req.params.id, req.user.userId);
  res.status(200).json({
    success: true,
    data: null
  });
};

export const getJobs = async (req, res) => {
  const { trade, pincode, type } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

  const result = await jobService.getJobs({ trade, pincode, type, page, limit });
  res.status(200).json({
    success: true,
    data: result
  });
};

export const fillJob = async (req, res) => {
  const result = await jobService.fillJob(req.params.id, req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};
