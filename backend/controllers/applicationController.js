const Application = require('../models/Application');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res, next) => {
  try {
    const {
      companyName,
      jobRole,
      jobDescription,
      dateApplied,
      applicationLink,
      location,
      salary,
      status,
      interviewDate,
      interviewTime,
      notes,
    } = req.body;

    if (!companyName || !jobRole) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both company name and job role.',
      });
    }

    const application = await Application.create({
      userId: req.user._id,
      companyName: companyName.trim(),
      jobRole: jobRole.trim(),
      jobDescription: jobDescription || '',
      dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
      applicationLink: applicationLink ? applicationLink.trim() : '',
      location: location ? location.trim() : 'Not specified',
      salary: salary ? salary.trim() : '',
      status: status || 'Applied',
      interviewDate: interviewDate ? new Date(interviewDate) : null,
      interviewTime: interviewTime ? interviewTime.trim() : '',
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully!',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications with search, filter, and sort
// @route   GET /api/applications
// @access  Private
const getApplications = async (req, res, next) => {
  try {
    const { q, status, startDate, endDate, sortBy } = req.query;

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
      query.status = status;
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
    let sortOptions = { dateApplied: -1 }; // default newest applied
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

    const applications = await Application.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: applications.length,
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
      dateApplied,
      applicationLink,
      location,
      salary,
      status,
      interviewDate,
      interviewTime,
      notes,
    } = req.body;

    if (companyName !== undefined) application.companyName = companyName.trim();
    if (jobRole !== undefined) application.jobRole = jobRole.trim();
    if (jobDescription !== undefined) application.jobDescription = jobDescription;
    if (dateApplied !== undefined) application.dateApplied = new Date(dateApplied);
    if (applicationLink !== undefined) application.applicationLink = applicationLink ? applicationLink.trim() : '';
    if (location !== undefined) application.location = location ? location.trim() : 'Not specified';
    if (salary !== undefined) application.salary = salary ? salary.trim() : '';
    if (status !== undefined) application.status = status;
    if (interviewDate !== undefined) {
      application.interviewDate = interviewDate ? new Date(interviewDate) : null;
    }
    if (interviewTime !== undefined) application.interviewTime = interviewTime ? interviewTime.trim() : '';
    if (notes !== undefined) application.notes = notes ? notes.trim() : '';

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

    await Application.deleteOne({ _id: req.params.id });

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
    // Only seeds for the currently logged-in user - completely isolated
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
        dateApplied: addDays(-20),
        applicationLink: 'https://careers.google.com',
        location: 'Bengaluru / Hyderabad',
        salary: '₹32 LPA',
        status: 'Interview',
        interviewDate: addDays(3),
        interviewTime: '11:00 AM',
        notes: 'Round 2 Technical Interview scheduled. Review Dynamic Programming and Graph algorithms.',
      },
      {
        userId,
        companyName: 'Microsoft',
        jobRole: 'Software Development Engineer 1 (SDE-1)',
        jobDescription: 'Build next-generation features for Azure Cloud and Microsoft 365 developer ecosystem.',
        dateApplied: addDays(-30),
        applicationLink: 'https://careers.microsoft.com',
        location: 'Hyderabad, India',
        salary: '₹28 LPA',
        status: 'Offer',
        interviewDate: addDays(-5),
        interviewTime: '02:00 PM',
        notes: 'Received official offer letter! Compensation package: 28 LPA CTC with stock grants. Need to accept by end of month.',
      },
      {
        userId,
        companyName: 'Amazon',
        jobRole: 'Graduate Software Development Engineer',
        jobDescription: 'Design resilient distributed architectures for AWS services.',
        dateApplied: addDays(-14),
        applicationLink: 'https://amazon.jobs',
        location: 'Bangalore, India',
        salary: '₹26 LPA',
        status: 'Online Test',
        interviewDate: addDays(5),
        interviewTime: '04:00 PM',
        notes: 'Hackerrank assessment passed with 100%. System design and coding round invite received.',
      },
      {
        userId,
        companyName: 'Adobe',
        jobRole: 'Associate Software Engineer',
        jobDescription: 'Innovating creative cloud web workflows and AI-assisted design tooling.',
        dateApplied: addDays(-10),
        applicationLink: 'https://adobe.wd5.myworkdayjobs.com',
        location: 'Noida, India',
        salary: '₹24 LPA',
        status: 'Interview',
        interviewDate: addDays(6),
        interviewTime: '03:30 PM',
        notes: 'Technical Round 1: React, JavaScript internals, and asynchronous programming.',
      },
      {
        userId,
        companyName: 'Atlassian',
        jobRole: 'Associate Product Engineer',
        jobDescription: 'Building collaboration tooling for Jira, Confluence, and Bitbucket.',
        dateApplied: addDays(-40),
        applicationLink: 'https://www.atlassian.com/company/careers',
        location: 'Bengaluru, Remote',
        salary: '₹22 LPA',
        status: 'Rejected',
        interviewDate: null,
        interviewTime: '',
        notes: 'Position closed after behavioral round. Keep in touch with the talent team.',
      },
      {
        userId,
        companyName: 'Swiggy',
        jobRole: 'Frontend Software Engineer',
        jobDescription: 'Building consumer and merchant web applications with React, Next.js and Tailwind.',
        dateApplied: addDays(-5),
        applicationLink: 'https://careers.swiggy.com',
        location: 'Bengaluru, India',
        salary: '₹18 LPA',
        status: 'Applied',
        interviewDate: null,
        interviewTime: '',
        notes: 'Referred by senior college alumni. Application status under recruiter review.',
      },
      {
        userId,
        companyName: 'Uber',
        jobRole: 'Software Engineer - Mobility',
        jobDescription: 'High-throughput microservices and real-time dispatch systems.',
        dateApplied: addDays(-8),
        applicationLink: 'https://www.uber.com/us/en/careers',
        location: 'Hyderabad, India',
        salary: '₹30 LPA',
        status: 'Online Test',
        interviewDate: addDays(4),
        interviewTime: '10:00 AM',
        notes: 'CodeSignal OA link active. 70 mins test on DSA and math concepts.',
      },
      {
        userId,
        companyName: 'TCS',
        jobRole: 'Digital Innovator / System Engineer',
        jobDescription: 'Enterprise cloud transformation and software engineering services.',
        dateApplied: addDays(-50),
        applicationLink: 'https://nextstep.tcs.com',
        location: 'Pune / Mumbai',
        salary: '₹7.5 LPA',
        status: 'Offer',
        interviewDate: addDays(-25),
        interviewTime: '10:00 AM',
        notes: 'TCS Digital offer secured through National Qualifier Test (NQT).',
      },
      {
        userId,
        companyName: 'Razorpay',
        jobRole: 'Full Stack Engineer Intern / FTE',
        jobDescription: 'Payments gateway integration, checkout flows, and financial ledger services.',
        dateApplied: addDays(-3),
        applicationLink: 'https://razorpay.com/jobs',
        location: 'Bengaluru, India',
        salary: '₹20 LPA',
        status: 'Applied',
        interviewDate: null,
        interviewTime: '',
        notes: 'Applied via campus portal. First round screening expected next week.',
      },
    ];

    await Application.insertMany(sampleData);

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
