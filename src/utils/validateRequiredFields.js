
// validateRequiredFields.js
/**
 * Checks if all required fields are present in the request body.
 * @param {Array} requiredFields - List of required fields.
 * @param {Object} body - Request body.
 * @param {Object} res - Express response object.
 * @returns {boolean} - Returns true if missing fields, else false.
 */

function validateRequiredFields(requiredFields, body, res) {
    const missingFields = [];
    for (let field of requiredFields) {
        if (!body[field]) {
            missingFields.push(field);
        }
    }

    if (missingFields.length > 0) {
        return res.status(400).json({
            code: "MISSING_FIELD",
            status: "error",
            message: `Missing required fields: ${missingFields.join(', ')}`
        });
    }

    return false; // No missing fields
}

export default  validateRequiredFields;
