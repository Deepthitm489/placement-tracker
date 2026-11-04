const test = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import utilities and models
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const Application = require('../models/Application');

process.env.JWT_SECRET = 'test_secret_for_placement_tracker_2026';

test('1. Security: Password Hashing and Verification', async () => {
  const plainPassword = 'StudentSecurePassword123!';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  assert.notStrictEqual(hashedPassword, plainPassword);
  assert.ok(hashedPassword.startsWith('$2'));

  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  assert.strictEqual(isMatch, true);

  const isWrongMatch = await bcrypt.compare('WrongPassword456', hashedPassword);
  assert.strictEqual(isWrongMatch, false);
});

test('2. Authentication: JWT Token Generation and Verification', () => {
  const fakeUserId = '654321098765432109876543';
  const token = generateToken(fakeUserId);

  assert.ok(token);
  assert.strictEqual(typeof token, 'string');

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  assert.strictEqual(decoded.id, fakeUserId);
  assert.ok(decoded.exp > decoded.iat);
});

test('3. Application Model: Supported Status Validations', () => {
  const validStatuses = ['Applied', 'Online Test', 'Interview', 'Offer', 'Rejected'];

  validStatuses.forEach((status) => {
    const app = new Application({
      userId: '654321098765432109876543',
      companyName: 'Google',
      jobRole: 'Software Engineer',
      status,
    });

    const error = app.validateSync();
    assert.strictEqual(error, undefined, `Status "${status}" should be valid`);
  });

  // Test invalid status
  const invalidApp = new Application({
    userId: '654321098765432109876543',
    companyName: 'Google',
    jobRole: 'Software Engineer',
    status: 'PendingReview', // invalid status
  });

  const validationError = invalidApp.validateSync();
  assert.ok(validationError);
  assert.ok(validationError.errors.status);
});

test('4. Dashboard Analytics Logic: Metric Aggregation and Rates', () => {
  const mockApplications = [
    { status: 'Applied', dateApplied: new Date() },
    { status: 'Online Test', dateApplied: new Date() },
    { status: 'Interview', dateApplied: new Date() },
    { status: 'Offer', dateApplied: new Date() },
    { status: 'Offer', dateApplied: new Date() },
    { status: 'Rejected', dateApplied: new Date() },
  ];

  const totalApplications = mockApplications.length;
  const statusCounts = {
    Applied: 0,
    'Online Test': 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };

  mockApplications.forEach((app) => {
    if (statusCounts[app.status] !== undefined) {
      statusCounts[app.status] += 1;
    }
  });

  assert.strictEqual(totalApplications, 6);
  assert.strictEqual(statusCounts.Offer, 2);
  assert.strictEqual(statusCounts.Interview, 1);
  assert.strictEqual(statusCounts['Online Test'], 1);
  assert.strictEqual(statusCounts.Applied, 1);
  assert.strictEqual(statusCounts.Rejected, 1);

  // Conversion rates
  const offerRate = Number(((statusCounts.Offer / totalApplications) * 100).toFixed(1));
  const interviewRate = Number((((statusCounts.Interview + statusCounts.Offer) / totalApplications) * 100).toFixed(1));

  assert.strictEqual(offerRate, 33.3);
  assert.strictEqual(interviewRate, 50.0);
});

test('5. Interview Radar: 7-Day Countdown and Past Interview Filtering', () => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const addDays = (d, days) => {
    const res = new Date(d);
    res.setDate(res.getDate() + days);
    return res;
  };

  const interviews = [
    {
      companyName: 'Google',
      interviewDate: addDays(startOfToday, 3), // in 3 days -> urgent
      status: 'Interview',
    },
    {
      companyName: 'Microsoft',
      interviewDate: addDays(startOfToday, 14), // in 14 days -> not urgent
      status: 'Interview',
    },
    {
      companyName: 'Past Corp',
      interviewDate: addDays(startOfToday, -5), // past -> should be filtered
      status: 'Interview',
    },
  ];

  // Filter out past
  const upcoming = interviews.filter((i) => new Date(i.interviewDate) >= startOfToday);
  assert.strictEqual(upcoming.length, 2);

  const formatted = upcoming.map((app) => {
    const diffTime = new Date(app.interviewDate).getTime() - startOfToday.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    return {
      companyName: app.companyName,
      daysRemaining,
      isUrgent: daysRemaining <= 7,
    };
  });

  assert.strictEqual(formatted[0].companyName, 'Google');
  assert.strictEqual(formatted[0].daysRemaining, 3);
  assert.strictEqual(formatted[0].isUrgent, true);

  assert.strictEqual(formatted[1].companyName, 'Microsoft');
  assert.strictEqual(formatted[1].daysRemaining, 14);
  assert.strictEqual(formatted[1].isUrgent, false);
});
