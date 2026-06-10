import prisma from './prisma.js';

/**
 * Create worker profile
 */
export const createProfile = async (userId, data) => {
  // Check if profile already exists
  const existingProfile = await prisma.workerProfile.findUnique({
    where: { userId }
  });

  if (existingProfile) {
    const error = new Error('Worker profile already exists');
    error.status = 409;
    throw error;
  }

  // Create profile
  const profile = await prisma.workerProfile.create({
    data: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      trade: data.trade,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      experience: data.experience,
      bio: data.bio,
      skills: data.skills,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      profilePicture: data.profilePicture
    }
  });

  return profile;
};

/**
 * Get worker profile by user ID
 */
export const getProfile = async (userId) => {
  const profile = await prisma.workerProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    const error = new Error('Worker profile not found');
    error.status = 404;
    throw error;
  }

  return profile;
};

/**
 * Update worker profile
 */
export const updateProfile = async (userId, data) => {
  // Check if profile exists
  const existingProfile = await prisma.workerProfile.findUnique({
    where: { userId }
  });

  if (!existingProfile) {
    const error = new Error('Worker profile not found');
    error.status = 404;
    throw error;
  }

  // Update profile
  const profile = await prisma.workerProfile.update({
    where: { userId },
    data: {
      fullName: data.fullName,
      phone: data.phone,
      trade: data.trade,
      pincode: data.pincode,
      city: data.city,
      state: data.state,
      experience: data.experience,
      bio: data.bio,
      skills: data.skills,
      isAvailable: data.isAvailable,
      profilePicture: data.profilePicture
    }
  });

  return profile;
};

/**
 * Get worker stats
 */
export const getWorkerStats = async (userId) => {
  const profile = await prisma.workerProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    const activeJobs = await prisma.job.count({
      where: { status: 'OPEN' }
    });
    return {
      applicationsSent: 0,
      shortlisted: 0,
      rejected: 0,
      activeJobs
    };
  }

  const [applicationsSent, shortlisted, rejected, activeJobs] = await Promise.all([
    prisma.application.count({
      where: { workerId: profile.id }
    }),
    prisma.application.count({
      where: { workerId: profile.id, status: 'SHORTLISTED' }
    }),
    prisma.application.count({
      where: { workerId: profile.id, status: 'REJECTED' }
    }),
    prisma.job.count({
      where: { status: 'OPEN' }
    })
  ]);

  return {
    applicationsSent,
    shortlisted,
    rejected,
    activeJobs
  };
};

/**
 * Get 5 most recent worker applications
 */
export const getRecentWorkerApplications = async (userId) => {
  const profile = await prisma.workerProfile.findUnique({
    where: { userId }
  });

  if (!profile) {
    return [];
  }

  const applications = await prisma.application.findMany({
    where: { workerId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      status: true,
      createdAt: true,
      job: {
        select: {
          id: true,
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
