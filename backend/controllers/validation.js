// Parse a ?n= value into a bounded positive integer; null when it is not a usable number.
function parseLimit(raw, max) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) return null;
    return Math.min(value, max);
}

const isFilledString = (value) => typeof value === 'string' && value.trim() !== '';

module.exports = {parseLimit, isFilledString};
