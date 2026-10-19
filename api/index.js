// Vercel serverless entry point. The rewrites in vercel.json send /projects, /blogs and /log here,
// and the Express app routes them by their original path. Database settings come from the
// project's environment variables (see backend/.example.env for the names).
module.exports = require('../backend/app');
