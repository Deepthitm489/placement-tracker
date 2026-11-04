// Middleware to sanitize request bodies, queries, and params against NoSQL injection
// Recursively strips object keys that begin with '$' or contain '.'

const cleanData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(cleanData);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // Block keys starting with $ or containing . (common MongoDB query operators)
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleaned[key] = cleanData(value);
  }
  return cleaned;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) req.body = cleanData(req.body);
  if (req.query) req.query = cleanData(req.query);
  if (req.params) req.params = cleanData(req.params);
  next();
};

module.exports = { sanitizeInput, cleanData };
