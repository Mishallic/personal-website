const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV || 'development';
const backendDir = path.join(__dirname, '..');

// Most specific file first. dotenv never overrides a variable that is already set, so real
// environment variables (for example those set on the hosting platform) win over
// .env.<NODE_ENV>, which wins over .env.
for (const file of [`.env.${NODE_ENV}`, '.env']) {
    const fullPath = path.join(backendDir, file);
    if (fs.existsSync(fullPath)) dotenv.config({path: fullPath});
}

const optional = (name, fallback = '') => {
    const value = process.env[name];
    return value === undefined || value === '' ? fallback : value;
};

const positiveInt = (name, fallback) => {
    const raw = optional(name);
    if (raw === '') return fallback;
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0)
        throw new Error(`Environment variable ${name} must be a positive integer, got "${raw}"`);
    return value;
};

const REQUIRED = ['DB_HOST', 'DB_USER', 'DB_DATABASE'];

const config = {
    env: NODE_ENV,
    isProduction: NODE_ENV === 'production',
    port: positiveInt('APP_PORT', 8000),
    db: {
        host: optional('DB_HOST'),
        port: positiveInt('DB_PORT', 3306),
        user: optional('DB_USER'),
        password: optional('DB_PASSWORD'),
        database: optional('DB_DATABASE'),
        connectionLimit: positiveInt('DB_POOL_SIZE', 10),
    },
    // Upper bound for ?n= on the list endpoints.
    maxRecords: positiveInt('MAX_RECORDS', 100),
    logFormat: NODE_ENV === 'production' ? 'combined' : 'dev',

    /** Throws a descriptive error when the database configuration is incomplete. */
    assertComplete() {
        const missing = REQUIRED.filter(name => optional(name) === '');
        if (missing.length)
            throw new Error(
                `Missing required environment variables: ${missing.join(', ')}. ` +
                `Set them on the host, or copy backend/.example.env to backend/.env (or .env.${NODE_ENV}).`
            );
    },
};

module.exports = config;
