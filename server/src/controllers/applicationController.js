import * as applicationService from '../services/applicationService.js';

export const applyToJob = async (req, res) => {
  const result = await applicationService.applyToJob(req.user.userId, req.params.id, req.body);
  res.status(201).json({
    success: true,
    data: result
  });
};

export const getWorkerApplications = async (req, res) => {
  const result = await applicationService.getWorkerApplications(req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const getJobApplications = async (req, res) => {
  const result = await applicationService.getJobApplications(req.params.id, req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const shortlistApplication = async (req, res) => {
  const result = await applicationService.shortlistApplication(req.params.id, req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};

export const rejectApplication = async (req, res) => {
  const result = await applicationService.rejectApplication(req.params.id, req.user.userId);
  res.status(200).json({
    success: true,
    data: result
  });
};
