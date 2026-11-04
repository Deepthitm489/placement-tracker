const test = require('node:test');
const assert = require('node:assert');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_for_placement_tracker_2026';

const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { errorHandler } = require('../middleware/errorMiddleware');

// Helper to create mock response object
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

test('6. Registration Controller Validation: Rejects missing required fields with 400', async () => {
  const req = {
    body: {
      name: 'Jane Doe',
      // email missing
      password: 'password123',
      college: 'MIT',
      branch: 'CSE',
      graduationYear: 2026,
    },
  };
  const res = createMockRes();
  const next = (err) => { throw err; };

  await registerUser(req, res, next);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.message.includes('required fields'));
});

test('7. Registration Controller Validation: Rejects password shorter than 6 characters', async () => {
  const req = {
    body: {
      name: 'Jane Doe',
      email: 'jane@mit.edu',
      password: '123',
      college: 'MIT',
      branch: 'CSE',
      graduationYear: 2026,
    },
  };
  const res = createMockRes();
  const next = (err) => { throw err; };

  await registerUser(req, res, next);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.message.includes('at least 6 characters'));
});

test('8. Registration Controller Validation: Rejects password mismatch', async () => {
  const req = {
    body: {
      name: 'Jane Doe',
      email: 'jane@mit.edu',
      password: 'password123',
      confirmPassword: 'differentPassword456',
      college: 'MIT',
      branch: 'CSE',
      graduationYear: 2026,
    },
  };
  const res = createMockRes();
  const next = (err) => { throw err; };

  await registerUser(req, res, next);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.data.success, false);
  assert.strictEqual(res.data.message, 'Passwords do not match.');
});

test('9. Login Controller Validation: Rejects missing email or password with 400', async () => {
  const req = {
    body: {
      email: 'jane@mit.edu',
      // password missing
    },
  };
  const res = createMockRes();
  const next = (err) => { throw err; };

  await loginUser(req, res, next);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.message.includes('both email and password'));
});

test('10. Auth Middleware Protection: Rejects request with no token with 401', async () => {
  const req = {
    headers: {},
  };
  const res = createMockRes();
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  await protect(req, res, next);

  assert.strictEqual(nextCalled, false);
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.message.includes('no authentication token'));
});

test('11. Global Error Handler: Formats Mongoose duplicate key error (code 11000)', () => {
  const err = new Error('Duplicate key');
  err.code = 11000;
  err.keyValue = { email: 'duplicate@student.edu' };

  const req = {};
  const res = createMockRes();
  const next = () => {};

  errorHandler(err, req, res, next);

  assert.strictEqual(res.statusCode, 400);
  assert.strictEqual(res.data.success, false);
  assert.ok(res.data.message.includes('already exists'));
});
