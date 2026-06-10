import prisma from './prisma.js';

/**
 * Create employer profile
 */
export const createProfile = async (userId, data) => {
  // Check if profile already exists
  const existingProfile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (existingProfile) {
    const error = new Error('Employer profile already exists');
    error.status = 409;
    throw error;
  }

  // Create profile
  const profile = await prisma.employerProfile.create({
    data: {
      userId,
      fullName: data.fullName,
      companyName: data.companyName,
      phone: data.phone,
      pincode: data.pincode,
      city: data.city,
      profilePicture: data.profilePicture
    }
  });

  return profile;
};

/**
 * Get employer profile by user ID
 */
export const getProfile = async (userId) => {
  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    const error = new Error('Employer profile not found');
    error.status = 404;
    throw error;
  }

  return profile;
};

/**
 * Update employer profile
 */
export const updateProfile = async (userId, data) => {
  // Check if profile exists
  const existingProfile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!existingProfile) {
    const error = new Error('Employer profile not found');
    error.status = 404;
    throw error;
  }

  // Update profile
  const profile = await prisma.employerProfile.update({
    where: { userId },
    data: {
      fullName: data.fullName,
      companyName: data.companyName,
      phone: data.phone,
      pincode: data.pincode,
      city: data.city,
      profilePicture: data.profilePicture
    }
  });

  return profile;
};

/**
 * Get employer stats
 */
export const getEmployerStats = async (userId) => {
  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    return {
      jobsPosted: 0,
      openJobs: 0,
      filledJobs: 0,
      totalApplicants: 0
    };
  }

  const jobsPosted = await prisma.job.count({
    where: { employerId: profile.id }
  });

  const openJobs = await prisma.job.count({
    where: { employerId: profile.id, status: 'OPEN' }
  });

  const filledJobs = await prisma.job.count({
    where: { employerId: profile.id, status: 'FILLED' }
  });

  const totalApplicants = await prisma.application.count({
    where: {
      job: {
        employerId: profile.id
      }
    }
  });

  return {
    jobsPosted,
    openJobs,
    filledJobs,
    totalApplicants
  };
};

/**
 * Get recent employer jobs
 */
export const getRecentEmployerJobs = async (userId) => {
  const profile = await prisma.employerProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    return [];
  }

  const jobs = await prisma.job.findMany({
    where: { employerId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      trade: true,
      type: true,
      status: true,
      city: true,
      createdAt: true
    }
  });

  return jobs;
};

