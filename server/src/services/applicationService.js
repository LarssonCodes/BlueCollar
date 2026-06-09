import prisma from './prisma.js';

/**
 * Worker applies to an open job
 */
export const applyToJob = async (userId, jobId, data) => {
  // 1. Find the worker's profile
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId }
  });

  if (!workerProfile) {
    const error = new Error('Please create a worker profile first');
    error.status = 400;
    throw error;
  }

  // 2. Find the job
  const job = await prisma.job.findUnique({
    where: { id: jobId }
  });

  if (!job) {
    const error = new Error('Job not found');
    error.status = 404;
    throw error;
  }

  // 3. Check if job status is OPEN
  if (job.status !== 'OPEN') {
    const error = new Error('This job is no longer accepting applications');
    error.status = 400;
    throw error;
  }

  // 4. Check if already applied (@@unique([jobId, workerId]))
  const existingApplication = await prisma.application.findUnique({
    where: {
      jobId_workerId: {
        jobId,
        workerId: workerProfile.id
      }
    }
  });

  if (existingApplication) {
    const error = new Error('You have already applied for this job');
    error.status = 409;
    throw error;
  }

  // 5. Create application
  const application = await prisma.application.create({
    data: {
      jobId,
      workerId: workerProfile.id,
      coverNote: data.coverNote || null
    }
  });

  return application;
};

/**
 * Get all applications submitted by the worker
 */
export const getWorkerApplications = async (userId) => {
  // 1. Find the worker's profile
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId }
  });

  if (!workerProfile) {
    return [];
  }

  // 2. Fetch applications with job details
  const applications = await prisma.application.findMany({
    where: { workerId: workerProfile.id },
    orderBy: { createdAt: 'desc' },
    include: {
      job: {
        select: {
          title: true,
          trade: true,
          city: true,
          employer: {
            select: {
              fullName: true
            }
          }
        }
      }
    }
  });

  return applications;
};

/**
 * Get all applications for a job (employer only)
 */
export const getJobApplications = async (jobId, userId) => {
  // 1. Get employer profile
  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    const error = new Error('Employer profile not found');
    error.status = 403;
    throw error;
  }

  // 2. Find job
  const job = await prisma.job.findUnique({
    where: { id: jobId }
  });

  if (!job) {
    const error = new Error('Job not found');
    error.status = 404;
    throw error;
  }

  // 3. Verify ownership
  if (job.employerId !== profile.id) {
    const error = new Error('You do not own this job');
    error.status = 403;
    throw error;
  }

  // 4. Query applications (excluding phone)
  const applications = await prisma.application.findMany({
    where: { jobId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      coverNote: true,
      createdAt: true,
      worker: {
        select: {
          id: true,
          fullName: true,
          trade: true,
          experience: true,
          city: true,
          pincode: true
        }
      }
    }
  });

  return applications;
};

/**
 * Shortlist an application (reveals contact details)
 */
export const shortlistApplication = async (applicationId, userId) => {
  // 1. Get application and associated job
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: true
    }
  });

  if (!application) {
    const error = new Error('Application not found');
    error.status = 404;
    throw error;
  }

  // 2. Get employer profile
  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile || application.job.employerId !== profile.id) {
    const error = new Error('You do not own this job');
    error.status = 403;
    throw error;
  }

  // 3. Update status to SHORTLISTED
  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: { status: 'SHORTLISTED' },
    select: {
      id: true,
      status: true,
      coverNote: true,
      createdAt: true,
      worker: {
        select: {
          id: true,
          fullName: true,
          trade: true,
          experience: true,
          city: true,
          pincode: true,
          phone: true // contact reveal!
        }
      }
    }
  });

  return updatedApplication;
};

/**
 * Reject an application
 */
export const rejectApplication = async (applicationId, userId) => {
  // 1. Get application and associated job
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: true
    }
  });

  if (!application) {
    const error = new Error('Application not found');
    error.status = 404;
    throw error;
  }

  // 2. Get employer profile
  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile || application.job.employerId !== profile.id) {
    const error = new Error('You do not own this job');
    error.status = 403;
    throw error;
  }

  // 3. Update status to REJECTED
  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: { status: 'REJECTED' },
    select: {
      id: true,
      status: true,
      coverNote: true,
      createdAt: true,
      worker: {
        select: {
          id: true,
          fullName: true,
          trade: true,
          experience: true,
          city: true,
          pincode: true
          // phone is NOT included
        }
      }
    }
  });

  return updatedApplication;
};
