import prisma from './prisma.js';

/**
 * Get platform-wide metrics/counts
 */
export const getAdminStats = async () => {
  const [totalUsers, totalWorkers, totalEmployers, totalJobs, totalApplications] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'WORKER' } }),
    prisma.user.count({ where: { role: 'EMPLOYER' } }),
    prisma.job.count(),
    prisma.application.count()
  ]);

  return {
    totalUsers,
    totalWorkers,
    totalEmployers,
    totalJobs,
    totalApplications
  };
};

/**
 * Get paginated list of users
 */
export const getAllUsers = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const take = limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.user.count()
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Delete a user by ID
 */
export const deleteUserById = async (targetId, requestingUserId) => {
  if (targetId === requestingUserId) {
    const error = new Error('Cannot delete your own account');
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: targetId }
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  await prisma.user.delete({
    where: { id: targetId }
  });

  return null;
};

/**
 * Get paginated list of jobs
 */
export const getAllJobs = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const take = limit;

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        trade: true,
        type: true,
        status: true,
        city: true,
        createdAt: true,
        employer: {
          select: {
            fullName: true
          }
        }
      }
    }),
    prisma.job.count()
  ]);

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Delete a job by ID
 */
export const deleteJobById = async (jobId) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId }
  });

  if (!job) {
    const error = new Error('Job not found');
    error.status = 404;
    throw error;
  }

  await prisma.job.delete({
    where: { id: jobId }
  });

  return null;
};
