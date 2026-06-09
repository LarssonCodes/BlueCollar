import { z } from 'zod';
import * as adminService from '../services/adminService.js';

// Schema for route parameter validation
const idParamSchema = z.string().uuid('Invalid ID format (must be a valid UUID)');

/**
 * GET /api/admin/stats
 */
export const getStats = async (req, res) => {
  const stats = await adminService.getAdminStats();
  res.status(200).json({
    success: true,
    data: stats
  });
};

/**
 * GET /api/admin/users
 */
export const getUsers = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(parseInt(req.query.limit, 10) || 20, 100));

  const result = await adminService.getAllUsers({ page, limit });
  res.status(200).json({
    success: true,
    data: result
  });
};

/**
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
  const parseResult = idParamSchema.safeParse(req.params.id);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.errors[0].message
    });
  }

  const targetId = parseResult.data;
  const requestingUserId = req.user.userId;

  await adminService.deleteUserById(targetId, requestingUserId);

  res.status(200).json({
    success: true,
    data: null
  });
};

/**
 * GET /api/admin/jobs
 */
export const getJobs = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(parseInt(req.query.limit, 10) || 20, 100));

  const result = await adminService.getAllJobs({ page, limit });
  res.status(200).json({
    success: true,
    data: result
  });
};

/**
 * DELETE /api/admin/jobs/:id
 */
export const deleteJob = async (req, res) => {
  const parseResult = idParamSchema.safeParse(req.params.id);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.errors[0].message
    });
  }

  const jobId = parseResult.data;

  await adminService.deleteJobById(jobId);

  res.status(200).json({
    success: true,
    data: null
  });
};
