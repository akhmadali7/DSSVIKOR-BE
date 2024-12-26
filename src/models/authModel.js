import dbPool from "../config/database.js";

const login = async (email) => {
    try {
        const SQLQuery = "SELECT email, password_hash, uuid, user_id, role, status FROM users WHERE email = ?";
        const [results] = await dbPool.execute(SQLQuery, [email]); // Use execute

        if (results.length > 0) {
            return results[0]; // Return the first result row.
        } else {
            return null; // Or throw an error (more robust)
        }
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw error for handling in the caller
    }
};

const register = async (newUserData) => {
    const {uuid, first_name, last_name, email, password_hash, status, role} = newUserData;

    const SQLQuery = `
        INSERT INTO users (uuid, first_name, last_name, email, password_hash, status, created_at, role)
        VALUES (?, ?, ?, ?, ?, ?, NOW(),  ?);
    `;
    // Execute the query and get the result
    const [result] = await dbPool.execute(SQLQuery, [uuid, first_name, last_name, email, password_hash, status, role]);

    // Get the generated user_id (assuming it is the auto-increment primary key)
    const newUserID = result.insertId;

    // Return the new user_id
    return newUserID;
};


const checkExistingEmail = async (email) => {
    const SQLQuery = `SELECT 1 FROM users WHERE email = ? LIMIT 1`;
    try {
        const [rows] = await dbPool.execute(SQLQuery, [email]);
        return rows.length > 0 ? "email already registered" : null;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;  // Optional: You could throw or return a custom error
    }
}

const logLogin = (email) => {
    const SQLQuery = `UPDATE users SET last_login_at = NOW() WHERE email = ?;`;
    return dbPool.query(SQLQuery, [email]);
};

const getProfileData = async (uuid) => {
    const SQLQuery =
        `SELECT 
        uuid,
        first_name, 
        last_name,
        email,
        phone_number,
        status,
        role,
        created_at,
        updated_at,
        last_login_at,
        profile_picture
        FROM users WHERE uuid = ?;`;
    return dbPool.execute(SQLQuery, [uuid]);
}

const saveRefreshToken = async (user_id, token, expires_at) => {
    const SQLQuery = `
        INSERT INTO refresh_tokens (user_id, token, created_at, expires_at, is_revoked) 
        VALUES (?, ?, NOW(), ?, 1)
        ON DUPLICATE KEY UPDATE 
            token = VALUES(token), 
            expires_at = VALUES(expires_at), 
            created_at = NOW(),
            is_revoked = 0;
    `;
    // Passing values for user_id, token, expires_at, and updating fields for token replacement
    return dbPool.query(SQLQuery, [user_id, token, expires_at]);
};

const logOut = (user_id) => {
    const SQLQuery = `UPDATE refresh_tokens SET is_revoked = 1 WHERE user_id = ?;`;
    return dbPool.query(SQLQuery, [user_id]);
}

export {
    login,
    register,
    checkExistingEmail,
    logLogin,
    getProfileData,
    saveRefreshToken,
    logOut
}