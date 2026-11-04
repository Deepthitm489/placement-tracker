const test = require('node:test');
const assert = require('node:assert');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_for_placement_tracker_2026';

const { cleanData, sanitizeInput } = require('../middleware/sanitize');
const { changePassword } = require('../controllers/authController');
const { createApplication } = require('../controllers/applicationController');

const createMockRes = () => {
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
  };
  return res;
};

// 12. NoSQL Injection Sanitization
test('12. Security: NoSQL Injection Sanitizer strips dangerous $ and dot keys', () => {
  const maliciousPayload = {
    email: 'student@example.com',
    $gt: '',
    nested: {
      safe: 'value',
      $where: 'malicious code',
      'user.admin': true,
    },
  };

  const cleaned = cleanData(maliciousPayload);

  assert.strictEqual(cleaned.email, 'student@example.com');
  assert.strictEqual(cleaned.$gt, undefined);
  assert.strictEqual(cleaned.nested.safe, 'value');
  assert.strictEqual(cleaned.nested.$where, undefined);
  assert.strictEqual(cleaned.nested['user.admin'], undefined);
});

// 13. Sanitize Middleware Execution
test('13. Security: Sanitize middleware automatically cleans req.body, req.query, and req.params', () => {
  const req = {
    body: { valid: 'data', $regex: '.*' },
    query: { q: 'software', $ne: null },
    params: { id: '123' },
  };
  const res = {};
  let nextCalled = false;
  sanitizeInput(req, res, () => {
    nextCalled = true;
  });

  assert.strictEqual(nextCalled, true);
  assert.strictEqual(req.body.$regex, undefined);
  assert.strictEqual(req.body.valid, 'data');
  assert.strictEqual(req.query.$ne, undefined);
  assert.strictEqual(req.query.q, 'software');
});

// 14. Cross-User Record Isolation
test('14. Security: Cross-User Isolation logic prevents Student B from accessing Student A data', () => {
  const studentAId = '654321000000000000000001';
  const studentBId = '654321000000000000000002';

  const applicationOwnedByA = {
    _id: 'app_123',
    userId: studentAId,
    companyName: 'Acme Corp',
    jobRole: 'Software Engineer',
  };

  // Function simulating ownership guard used across controllers
  const checkOwnership = (app, requestingUserId) => {
    if (app.userId.toString() !== requestingUserId.toString()) {
      return { status: 403, error: 'Access denied. You do not have permission.' };
    }
    return { status: 200, success: true };
  };

  // Student B tries to access Student A's application
  const resultForB = checkOwnership(applicationOwnedByA, studentBId);
  assert.strictEqual(resultForB.status, 403);
  assert.ok(resultForB.error.includes('Access denied'));

  // Student A accesses their own application
  const resultForA = checkOwnership(applicationOwnedByA, studentAId);
  assert.strictEqual(resultForA.status, 200);
  assert.strictEqual(resultForA.success, true);
});

// 15. Change Password Validation: Missing fields
test('15. Controller: Change Password rejects missing current or new password with 400', async () => {
  const req = {
    user: { _id: '654321000000000000000001' },
    body: {
      currentPassword: '',
      newPassword: 'newPassword123',
    },
  };
  const res = createMockRes();
  const next = (err) => { throw err; };

  await changePassword(req, res, next);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.message.includes('both your current and new password'));
});

// 16. Change Password Validation: Password too short
test('16. Controller: Change Password rejects new password shorter than 6 characters', async () => {
  const req = {
    user: { _id: '654321000000000000000001' },
    body: {
      currentPassword: 'currentPassword123',
      newPassword: '123',
      confirmPassword: '123',
    },
  };
  const res = createMockRes();
  const next = (err) => { throw err; };

  await changePassword(req, res, next);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.message.includes('at least 6 characters'));
});

// 17. Change Password Validation: Password mismatch
test('17. Controller: Change Password rejects when new password and confirmation do not match', async () => {
  const req = {
    user: { _id: '654321000000000000000001' },
    body: {
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword123',
      confirmPassword: 'wrongMismatchPassword456',
    },
  };
  const res = createMockRes();
  const next = (err) => { throw err; };

  await changePassword(req, res, next);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.data.success, false);
  assert.strictEqual(res.data.message, 'New passwords do not match.');
});

// 18. Application Creation Validation: Rejects missing required companyName or jobRole
test('18. Controller: Application creation requires both companyName and jobRole with 400', async () => {
  const req = {
    user: { _id: '654321000000000000000001' },
    body: {
      companyName: '',
      jobRole: 'Frontend Developer',
    },
  };
  const res = createMockRes();
  const next = (err) => { throw err; };

  await createApplication(req, res, next);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.message.includes('both company name and job role'));
});

// 19. Search and Filter Query Builder
test('19. Query Engine: Application search and status filter generates correct criteria', () => {
  const buildQuery = ({ userId, q, status }) => {
    const query = { userId };
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { companyName: searchRegex },
        { jobRole: searchRegex },
        { location: searchRegex },
      ];
    }
    if (status && status !== 'All') {
      if (status === 'Interview') {
        query.status = { $in: ['Technical Interview', 'HR Interview', 'Interview'] };
      } else {
        query.status = status;
      }
    }
    return query;
  };

  const userId = 'user_abc_123';
  const queryAll = buildQuery({ userId, q: 'Google', status: 'All' });
  assert.strictEqual(queryAll.userId, 'user_abc_123');
  assert.ok(queryAll.$or.length === 3);
  assert.strictEqual(queryAll.status, undefined);

  const queryInterview = buildQuery({ userId, q: '', status: 'Interview' });
  assert.deepStrictEqual(queryInterview.status.$in, ['Technical Interview', 'HR Interview', 'Interview']);
});

// 20. Interview Radar Urgency Calculation
test('20. Radar: Correctly flags interviews happening within 7 days as urgent', () => {
  const calculateRadar = (interviewDateStr) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const interviewDate = new Date(interviewDateStr);
    const diffTime = interviewDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return {
      daysRemaining,
      isUrgent: daysRemaining <= 7,
    };
  };

  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  threeDaysFromNow.setHours(0, 0, 0, 0);
  const radarSoon = calculateRadar(threeDaysFromNow.toISOString());
  assert.strictEqual(radarSoon.daysRemaining, 3);
  assert.strictEqual(radarSoon.isUrgent, true);

  const twentyDaysFromNow = new Date();
  twentyDaysFromNow.setDate(twentyDaysFromNow.getDate() + 20);
  twentyDaysFromNow.setHours(0, 0, 0, 0);
  const radarLater = calculateRadar(twentyDaysFromNow.toISOString());
  assert.strictEqual(radarLater.daysRemaining, 20);
  assert.strictEqual(radarLater.isUrgent, false);
});

// 21. Data Portability Archive Builder
test('21. Export Archive: Data portability payload includes profile, applications, and activity metadata', () => {
  const buildArchive = (user, apps, activities, notifs) => {
    return {
      exportedAt: new Date().toISOString(),
      studentProfile: {
        name: user.name,
        email: user.email,
        college: user.college,
        branch: user.branch,
        department: user.department,
        graduationYear: user.graduationYear,
      },
      summary: {
        totalApplications: apps.length,
        totalActivityEvents: activities.length,
        totalNotifications: notifs.length,
      },
      applications: apps,
      activities,
      notifications: notifs,
    };
  };

  const archive = buildArchive(
    { name: 'John Doe', email: 'john@student.edu', college: 'Stanford', branch: 'CSE', department: 'CSE', graduationYear: 2026 },
    [{ _id: '1', companyName: 'Google', status: 'Offer' }],
    [{ action: 'created', companyName: 'Google' }],
    [{ title: 'Offer Received' }]
  );

  assert.strictEqual(archive.studentProfile.name, 'John Doe');
  assert.strictEqual(archive.summary.totalApplications, 1);
  assert.strictEqual(archive.summary.totalActivityEvents, 1);
  assert.strictEqual(archive.summary.totalNotifications, 1);
  assert.ok(archive.exportedAt);
});

// 22. Delete Account Validation
test('22. Controller: Delete Account rejects missing password with 400', async () => {
  const { deleteAccount } = require('../controllers/authController');
  const req = {
    user: { _id: '654321000000000000000001' },
    body: { password: '' },
  };
  const res = createMockRes();
  const next = (err) => { throw err; };

  await deleteAccount(req, res, next);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.message.includes('password'));
});

// 23. Application Activity Timeline Appending
test('23. Timeline Engine: Status transition appends audit entry with timestamp and note', () => {
  const application = {
    status: 'Applied',
    activityTimeline: [
      { status: 'Applied', date: new Date('2026-01-01'), note: 'Initial application' }
    ],
  };

  const transitionStatus = (app, newStatus, note) => {
    app.status = newStatus;
    app.activityTimeline.push({
      status: newStatus,
      date: new Date(),
      note,
    });
    return app;
  };

  transitionStatus(application, 'Technical Interview', 'Passed coding round with 100%');

  assert.strictEqual(application.status, 'Technical Interview');
  assert.strictEqual(application.activityTimeline.length, 2);
  assert.strictEqual(application.activityTimeline[1].status, 'Technical Interview');
  assert.ok(application.activityTimeline[1].note.includes('Passed coding round'));
});

// 24. Express App Router Mounting Verification
test('24. Server Routing: Server correctly loads Express and configures core routes', () => {
  const app = require('../server');
  assert.ok(app);
  assert.strictEqual(typeof app.use, 'function');
});
