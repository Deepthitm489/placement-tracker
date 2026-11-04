const Application = require('../models/Application');
const ActivityLog = require('../models/ActivityLog');
const Notification = require('../models/Notification');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res, next) => {
  try {
    const {
      companyName,
      jobRole,
      jobDescription,
      companyWebsite,
      applicationLink,
      location,
      salary,
      dateApplied,
      status,
      interviewDate,
      interviewTime,
      interviewType,
      notes,
    } = req.body;

    if (!companyName || !jobRole) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both company name and job role.',
      });
    }

    const initialStatus = status || 'Applied';
    const appDate = dateApplied ? new Date(dateApplied) : new Date();

    const application = await Application.create({
      userId: req.user._id,
      companyName: companyName.trim(),
      jobRole: jobRole.trim(),
      jobDescription: jobDescription || '',
      companyWebsite: companyWebsite ? companyWebsite.trim() : '',
      applicationLink: applicationLink ? applicationLink.trim() : '',
      location: location ? location.trim() : 'Not specified',
      salary: salary ? salary.trim() : '',
      dateApplied: appDate,
      status: initialStatus,
      interviewDate: interviewDate ? new Date(interviewDate) : null,
      interviewTime: interviewTime ? interviewTime.trim() : '',
      interviewType: interviewType || 'Online / Video Call',
      notes: notes ? notes.trim() : '',
      activityTimeline: [
        {
          status: initialStatus,
          date: new Date(),
          note: `Application submitted for ${jobRole.trim()}`,
        },
      ],
    });

    // Log Activity
    await ActivityLog.create({
      userId: req.user._id,
      applicationId: application._id,
      action: 'created',
      companyName: application.companyName,
      details: `Created application for ${application.jobRole}`,
    });

    // Create Notification if interview scheduled
    if (application.interviewDate) {
      await Notification.create({
        userId: req.user._id,
        title: `Interview Scheduled: ${application.companyName}`,
        message: `Your interview for ${application.jobRole} is on ${new Date(application.interviewDate).toLocaleDateString()}.`,
        type: 'interview',
        link: '/interviews',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Application created successfully!',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications with search, filter, sort, and pagination
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    const { q, status, startDate, endDate, sortBy, page = 1, limit = 50 } = req.query;

    // Base query scoped strictly to the authenticated student
    const query = { userId: req.user._id };

    // Search query on companyName, jobRole, location, or notes
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { companyName: searchRegex },
        { jobRole: searchRegex },
        { location: searchRegex },
        { notes: searchRegex },
      ];
    }

    // Status filter
    if (status && status !== 'All') {
      if (status === 'Interview') {
        // Match both Technical and HR or generic Interview
        query.status = { $in: ['Technical Interview', 'HR Interview', 'Interview'] };
      } else {
        query.status = status;
      }
    }

    // Date range filter
    if (startDate || endDate) {
      query.dateApplied = {};
      if (startDate) {
        query.dateApplied.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.dateApplied.$lte = end;
      }
    }

    // Sorting
    let sortOptions = { dateApplied: -1 };
    if (sortBy === 'oldest') {
      sortOptions = { dateApplied: 1 };
    } else if (sortBy === 'newest') {
      sortOptions = { dateApplied: -1 };
    } else if (sortBy === 'company_asc') {
      sortOptions = { companyName: 1 };
    } else if (sortBy === 'company_desc') {
      sortOptions = { companyName: -1 };
    } else if (sortBy === 'interview_date') {
      sortOptions = { interviewDate: 1 };
    } else if (sortBy === 'updated') {
      sortOptions = { updatedAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: applications.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Verify ownership
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to view this application.',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Verify ownership
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to modify this application.',
      });
    }

    const {
      companyName,
      jobRole,
      jobDescription,
      companyWebsite,
      dateApplied,
      applicationLink,
      location,
      salary,
      status,
      interviewDate,
      interviewTime,
      interviewType,
      notes,
    } = req.body;

    const previousStatus = application.status;

    if (companyName !== undefined) application.companyName = companyName.trim();
    if (jobRole !== undefined) application.jobRole = jobRole.trim();
    if (jobDescription !== undefined) application.jobDescription = jobDescription;
    if (companyWebsite !== undefined) application.companyWebsite = companyWebsite ? companyWebsite.trim() : '';
    if (dateApplied !== undefined) application.dateApplied = new Date(dateApplied);
    if (applicationLink !== undefined) application.applicationLink = applicationLink ? applicationLink.trim() : '';
    if (location !== undefined) application.location = location ? location.trim() : 'Not specified';
    if (salary !== undefined) application.salary = salary ? salary.trim() : '';
    if (interviewDate !== undefined) {
      application.interviewDate = interviewDate ? new Date(interviewDate) : null;
    }
    if (interviewTime !== undefined) application.interviewTime = interviewTime ? interviewTime.trim() : '';
    if (interviewType !== undefined) application.interviewType = interviewType;
    if (notes !== undefined) application.notes = notes ? notes.trim() : '';

    // If status changed, record to timeline
    if (status !== undefined && status !== previousStatus) {
      application.status = status;
      application.activityTimeline.push({
        status,
        date: new Date(),
        note: `Status updated from ${previousStatus} to ${status}`,
      });

      // Log status change
      await ActivityLog.create({
        userId: req.user._id,
        applicationId: application._id,
        action: 'status_changed',
        companyName: application.companyName,
        details: `Moved to ${status}`,
      });

      // Trigger notification for Offer or Interview
      if (status === 'Offer') {
        await Notification.create({
          userId: req.user._id,
          title: `🎉 Offer Received: ${application.companyName}`,
          message: `Congratulations! You received an offer for ${application.jobRole}!`,
          type: 'offer',
          link: '/applications',
        });
      }
    }

    const updatedApplication = await application.save();

    res.status(200).json({
      success: true,
      message: 'Application updated successfully!',
      application: updatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Verify ownership
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to delete this application.',
      });
    }

    const companyName = application.companyName;
    await Application.deleteOne({ _id: req.params.id });

    // Log deletion
    await ActivityLog.create({
      userId: req.user._id,
      action: 'deleted',
      companyName,
      details: `Deleted application for ${companyName}`,
    });

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed sample realistic student placement applications (Demo mode)
// @route   POST /api/applications/seed-demo
// @access  Private
const seedSampleApplications = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const today = new Date();
    const addDays = (days) => {
      const d = new Date(today);
      d.setDate(d.getDate() + days);
      return d;
    };

    const sampleData = [
      {
        userId,
        companyName: 'Google',
        jobRole: 'Software Engineer - University Graduate',
        jobDescription: 'Design, develop, and test software applications in cloud and distributed systems.',
        companyWebsite: 'https://careers.google.com',
        dateApplied: addDays(-20),
        applicationLink: 'https://careers.google.com/jobs/results/12345',
        location: 'Bengaluru / Hyderabad',
        salary: '₹32 LPA',
        status: 'Technical Interview',
        interviewDate: addDays(3),
        interviewTime: '11:00 AM',
        interviewType: 'Online / Video Call',
        notes: 'Round 2 Technical Interview scheduled. Review Dynamic Programming and Graph algorithms.',
        activityTimeline: [
          { status: 'Applied', date: addDays(-20), note: 'Applied via Google Careers' },
          { status: 'Online Test', date: addDays(-12), note: 'Passed Google Online Challenge' },
          { status: 'Technical Interview', date: addDays(-2), note: 'Cleared Technical Round 1' },
        ],
      },
      {
        userId,
        companyName: 'Microsoft',
        jobRole: 'Software Development Engineer 1 (SDE-1)',
        jobDescription: 'Build next-generation features for Azure Cloud and Microsoft 365 developer ecosystem.',
        companyWebsite: 'https://careers.microsoft.com',
        dateApplied: addDays(-30),
        applicationLink: 'https://careers.microsoft.com/us/en/job/56789',
        location: 'Hyderabad, India',
        salary: '₹28 LPA',
        status: 'Offer',
        interviewDate: addDays(-5),
        interviewTime: '02:00 PM',
        interviewType: 'On-Campus',
        notes: 'Received official offer letter! Compensation package: 28 LPA CTC with stock grants. Need to accept by end of month.',
        activityTimeline: [
          { status: 'Applied', date: addDays(-30), note: 'Campus drive application submitted' },
          { status: 'Online Test', date: addDays(-22), note: '98 percentile in Codility test' },
          { status: 'Technical Interview', date: addDays(-15), note: 'Data structures & algorithms round' },
          { status: 'HR Interview', date: addDays(-8), note: 'Behavioral & leadership principles' },
          { status: 'Offer', date: addDays(-5), note: 'Letter of Intent received!' },
        ],
      },
      {
        userId,
        companyName: 'Amazon',
        jobRole: 'Graduate Software Development Engineer',
        jobDescription: 'Design resilient distributed architectures for AWS services.',
        companyWebsite: 'https://amazon.jobs',
        dateApplied: addDays(-14),
        applicationLink: 'https://amazon.jobs/en/jobs/98765',
        location: 'Bangalore, India',
        salary: '₹26 LPA',
        status: 'Online Test',
        interviewDate: addDays(5),
        interviewTime: '04:00 PM',
        interviewType: 'Online / Video Call',
        notes: 'Hackerrank assessment passed with 100%. System design and coding round invite received.',
        activityTimeline: [
          { status: 'Applied', date: addDays(-14), note: 'Applied on Amazon University Jobs' },
          { status: 'Online Test', date: addDays(-3), note: 'Part 1 & 2 OA completed' },
        ],
      },
      {
        userId,
        companyName: 'Adobe',
        jobRole: 'Associate Software Engineer',
        jobDescription: 'Innovating creative cloud web workflows and AI-assisted design tooling.',
        companyWebsite: 'https://adobe.com/careers',
        dateApplied: addDays(-10),
        applicationLink: 'https://adobe.wd5.myworkdayjobs.com',
        location: 'Noida, India',
        salary: '₹24 LPA',
        status: 'HR Interview',
        interviewDate: addDays(6),
        interviewTime: '03:30 PM',
        interviewType: 'Online / Video Call',
        notes: 'Technical rounds cleared. Final HR & Culture Fit interview scheduled.',
        activityTimeline: [
          { status: 'Applied', date: addDays(-10), note: 'Applied via campus portal' },
          { status: 'Technical Interview', date: addDays(-2), note: 'React & system architecture cleared' },
          { status: 'HR Interview', date: addDays(0), note: 'Invited for HR discussion' },
        ],
      },
      {
        userId,
        companyName: 'Goldman Sachs',
        jobRole: 'Engineering Analyst',
        jobDescription: 'Algorithmic trading systems and low-latency financial technology.',
        companyWebsite: 'https://goldmansachs.com/careers',
        dateApplied: addDays(-25),
        applicationLink: 'https://goldmansachs.com/careers',
        location: 'Bengaluru, India',
        salary: '₹25 LPA',
        status: 'On Hold',
        interviewDate: null,
        interviewTime: '',
        interviewType: 'Not specified',
        notes: 'Shortlisted after Aptitude and Math test. Hiring committee review on hold until next hiring window.',
        activityTimeline: [
          { status: 'Applied', date: addDays(-25), note: 'Applied through Engineering Campus Hiring Program' },
          { status: 'Online Test', date: addDays(-18), note: 'Aptitude & Coding test cleared' },
          { status: 'On Hold', date: addDays(-7), note: 'Recruiter stated hiring waitlist' },
        ],
      },
      {
        userId,
        companyName: 'Atlassian',
        jobRole: 'Associate Product Engineer',
        jobDescription: 'Building collaboration tooling for Jira, Confluence, and Bitbucket.',
        companyWebsite: 'https://atlassian.com/company/careers',
        dateApplied: addDays(-40),
        applicationLink: 'https://www.atlassian.com/company/careers',
        location: 'Bengaluru, Remote',
        salary: '₹22 LPA',
        status: 'Rejected',
        interviewDate: null,
        interviewTime: '',
        interviewType: 'Not specified',
        notes: 'Position closed after behavioral round. Keep in touch with the talent team.',
        activityTimeline: [
          { status: 'Applied', date: addDays(-40), note: 'Applied on company portal' },
          { status: 'Technical Interview', date: addDays(-25), note: 'Live pair programming' },
          { status: 'Rejected', date: addDays(-10), note: 'Final selection prioritized internal transfer' },
        ],
      },
      {
        userId,
        companyName: 'Swiggy',
        jobRole: 'Frontend Software Engineer',
        jobDescription: 'Building consumer and merchant web applications with React, Next.js and Tailwind.',
        companyWebsite: 'https://swiggy.com/careers',
        dateApplied: addDays(-5),
        applicationLink: 'https://careers.swiggy.com',
        location: 'Bengaluru, India',
        salary: '₹18 LPA',
        status: 'Applied',
        interviewDate: null,
        interviewTime: '',
        interviewType: 'Not specified',
        notes: 'Referred by senior college alumni. Application status under recruiter review.',
        activityTimeline: [
          { status: 'Applied', date: addDays(-5), note: 'Submitted with employee referral' },
        ],
      },
    ];

    await Application.insertMany(sampleData);

    // Create a demo notification
    await Notification.create({
      userId,
      title: 'Sample Applications Loaded',
      message: '7 realistic placement records across Applied, Tests, Technical, HR, and Offers have been added.',
      type: 'info',
      link: '/dashboard',
    });

    res.status(201).json({
      success: true,
      message: `Successfully loaded ${sampleData.length} sample applications for your account!`,
      count: sampleData.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  seedSampleApplications,
};
