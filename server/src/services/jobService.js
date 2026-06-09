import prisma from './prisma.js';

/**
 * Create a new job
 */
export const createJob = async (userId, data) => {
  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    const error = new Error('Employer profile not found. Please complete your profile first.');
    error.status = 400;
    throw error;
  }

  const job = await prisma.job.create({
    data: {
      employerId: profile.id,
      title: data.title,
      description: data.description,
      trade: data.trade,
      type: data.type,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      payAmount: data.payAmount,
      payType: data.payType,
      startDate: data.startDate,
      endDate: data.endDate
    }
  });

  return job;
};

/**
 * Get all jobs posted by the employer
 */
export const getEmployerJobs = async (userId) => {
  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    const error = new Error('Employer profile not found. Please complete your profile first.');
    error.status = 400;
    throw error;
  }

  const jobs = await prisma.job.findMany({
    where: { employerId: profile.id },
    orderBy: { createdAt: 'desc' }
  });

  return jobs;
};

/**
 * Get a single job by ID
 */
export const getJobById = async (id) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      employer: {
        select: {
          fullName: true,
          city: true,
          pincode: true
        }
      }
    }
  });

  if (!job) {
    const error = new Error('Job not found');
    error.status = 404;
    throw error;
  }

  return job;
};

/**
 * Update a job by ID
 */
export const updateJob = async (id, userId, data) => {
  const job = await prisma.job.findUnique({
    where: { id }
  });

  if (!job) {
    const error = new Error('Job not found');
    error.status = 404;
    throw error;
  }

  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile || job.employerId !== profile.id) {
    const error = new Error('You do not own this job');
    error.status = 403;
    throw error;
  }

  const updatedJob = await prisma.job.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      trade: data.trade,
      type: data.type,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      payAmount: data.payAmount,
      payType: data.payType,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status
    }
  });

  return updatedJob;
};

/**
 * Delete a job by ID
 */
export const deleteJob = async (id, userId) => {
  const job = await prisma.job.findUnique({
    where: { id }
  });

  if (!job) {
    const error = new Error('Job not found');
    error.status = 404;
    throw error;
  }

  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile || job.employerId !== profile.id) {
    const error = new Error('You do not own this job');
    error.status = 403;
    throw error;
  }

  await prisma.job.delete({
    where: { id }
  });

  return null;
};

/**
 * Search and list all open jobs with pagination and optional filters
 */
export const getJobs = async ({ trade, pincode, type, page = 1, limit = 10 }) => {
  const where = { status: 'OPEN' };

  // Validate and apply trade filter
  if (trade && ['ELECTRICIAN', 'PLUMBER', 'DRIVER', 'WELDER', 'MECHANIC', 'CONSTRUCTION', 'OTHER'].includes(trade.toUpperCase())) {
    where.trade = trade.toUpperCase();
  }

  // Validate and apply type filter
  if (type && ['GIG', 'CONTRACT'].includes(type.toUpperCase())) {
    where.type = type.toUpperCase();
  }

  // Apply pincode filter
  if (pincode && pincode.trim().length > 0) {
    where.pincode = pincode.trim();
  }

  const skip = (page - 1) * limit;

  // Run query in parallel
  const [total, items] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        employer: {
          select: {
            fullName: true,
            city: true,
            pincode: true
          }
        }
      }
    })
  ]);

  return {
    items,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Mark a job as filled (employer only)
 */
export const fillJob = async (jobId, userId) => {
  // 1. Get job
  const job = await prisma.job.findUnique({
    where: { id: jobId }
  });

  if (!job) {
    const error = new Error('Job not found');
    error.status = 404;
    throw error;
  }

  // 2. Get employer profile
  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile || job.employerId !== profile.id) {
    const error = new Error('You do not own this job');
    error.status = 403;
    throw error;
  }

  // 3. Verify status isn't already filled/closed
  if (job.status !== 'OPEN') {
    const error = new Error('This job is already filled or closed');
    error.status = 400;
    throw error;
  }

  // 4. Verify there is at least one shortlisted candidate
  const shortlistedCount = await prisma.application.count({
    where: {
      jobId,
      status: 'SHORTLISTED'
    }
  });

  if (shortlistedCount === 0) {
    const error = new Error('Must shortlist at least one worker before marking the job as filled');
    error.status = 400;
    throw error;
  }

  // 5. Update status
  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: { status: 'FILLED' }
  });

  return updatedJob;
};
