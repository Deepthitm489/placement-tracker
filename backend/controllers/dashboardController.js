const Application = require('../models/Application');

// @desc    Get dashboard metrics & aggregated stats for the logged-in student
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all applications for this student
    const applications = await Application.find({ userId });

    const totalApplications = applications.length;

    // Counts by status
    const statusCounts = {
      Applied: 0,
      'Online Test': 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    applications.forEach((app) => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status] += 1;
      }
    });

    // Placement Success Rates
    const offerRate = totalApplications > 0
      ? Number(((statusCounts.Offer / totalApplications) * 100).toFixed(1))
      : 0;

    const interviewRate = totalApplications > 0
      ? Number((((statusCounts.Interview + statusCounts.Offer) / totalApplications) * 100).toFixed(1))
      : 0;

    const activeApplications =
      statusCounts.Applied + statusCounts['Online Test'] + statusCounts.Interview;

    // Data formatted for Recharts Pie Chart
    const statusDistribution = [
      { name: 'Applied', value: statusCounts.Applied, color: '#3B82F6' },
      { name: 'Online Test', value: statusCounts['Online Test'], color: '#F59E0B' },
      { name: 'Interview', value: statusCounts.Interview, color: '#8B5CF6' },
      { name: 'Offer', value: statusCounts.Offer, color: '#10B981' },
      { name: 'Rejected', value: statusCounts.Rejected, color: '#EF4444' },
    ];

    // Data formatted for Recharts Monthly Applications Bar Chart
    // Aggregate by month for the last 6 months
    const monthlyMap = {};
    const monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months keys
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthsName[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyMap[key] = { month: key, applications: 0, offers: 0 };
    }

    // Populate counts
    applications.forEach((app) => {
      const appDate = new Date(app.dateApplied || app.createdAt);
      const key = `${monthsName[appDate.getMonth()]} ${appDate.getFullYear().toString().slice(-2)}`;
      if (monthlyMap[key]) {
        monthlyMap[key].applications += 1;
        if (app.status === 'Offer') {
          monthlyMap[key].offers += 1;
        }
      }
    });

    const monthlyApplications = Object.values(monthlyMap);

    res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        applied: statusCounts.Applied,
        onlineTests: statusCounts['Online Test'],
        interviews: statusCounts.Interview,
        offers: statusCounts.Offer,
        rejected: statusCounts.Rejected,
        activeApplications,
        offerRate,
        interviewRate,
      },
      statusDistribution,
      monthlyApplications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get 5 most recent applications for logged-in student
// @route   GET /api/dashboard/recent
// @access  Private
const getRecentApplications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const recent = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      applications: recent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming interviews (not past, sorted nearest first)
// @route   GET /api/dashboard/interviews
// @access  Private
const getUpcomingInterviews = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Fetch applications where interviewDate is defined, >= startOfToday, and not rejected
    const upcoming = await Application.find({
      userId,
      interviewDate: { $gte: startOfToday },
      status: { $ne: 'Rejected' },
    }).sort({ interviewDate: 1 });

    const formattedInterviews = upcoming.map((app) => {
      const interviewDateObj = new Date(app.interviewDate);
      const diffTime = interviewDateObj.getTime() - startOfToday.getTime();
      const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

      return {
        _id: app._id,
        companyName: app.companyName,
        jobRole: app.jobRole,
        interviewDate: app.interviewDate,
        interviewTime: app.interviewTime || 'TBD',
        location: app.location,
        applicationLink: app.applicationLink,
        status: app.status,
        notes: app.notes,
        daysRemaining,
        isUrgent: daysRemaining <= 7, // Flag for next 7 days alert
      };
    });

    res.status(200).json({
      success: true,
      count: formattedInterviews.length,
      urgentCount: formattedInterviews.filter((i) => i.isUrgent).length,
      interviews: formattedInterviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getRecentApplications,
  getUpcomingInterviews,
};
