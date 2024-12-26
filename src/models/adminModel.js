import dbPool from "../config/database.js";

const getAllUser = async () => {
    const SQLQuery = `
        SELECT 
    u.uuid,
    u.first_name, 
    u.last_name,
    u.email,
    u.phone_number,
    u.profile_picture,
    u.status,
    u.created_at,
    u.updated_at,
    u.last_login_at,
    u.role,
    COUNT(DISTINCT a.ID_alternative) AS total_alternatives,  -- Counting distinct active alternatives
    COUNT(DISTINCT c.ID_criteria) AS total_criteria           -- Counting distinct criteria that are included in calculation
FROM users u
LEFT JOIN alternatives a ON u.user_id = a.user_id AND a.is_active = 1  -- Only active alternatives
LEFT JOIN criteria c ON u.user_id = c.user_id AND c.include_in_calculation = 1  -- Only criteria included in calculation
GROUP BY u.user_id;
 ;
    `;

    try {
        const [rows] = await dbPool.execute(SQLQuery);

        // If no user is found, return null
        if (rows.length === 0) {
            return null;
        }

        // If user is found, return the first row (since UUID should be unique)
        return rows;
    } catch (err) {
        console.error("Error executing query:", err);
        throw new Error("Error fetching user information");
    }
};

const getUserByUUID = async (uuid) => {
    const SQLQuery = `
        SELECT 
            uuid,
            first_name, 
            last_name,
            email,
            phone_number,
            profile_picture,
            status,
            created_at,
            updated_at,
            last_login_at,
            role
        FROM users WHERE uuid = ?;
    `;

    try {
        const [rows] = await dbPool.execute(SQLQuery, [uuid]);

        // If no user is found, return null
        if (rows.length === 0) {
            return null;
        }

        // If user is found, return the first row (since UUID should be unique)
        return rows[0];
    } catch (err) {
        console.error("Error executing query:", err);
        throw new Error("Error fetching user information");
    }
};


const deleteUserByUUID = (uuid)=> {
    const SQLQuery = `DELETE FROM users WHERE uuid = ?;`;
    return dbPool.execute(SQLQuery, [uuid]);
}

const changeStatus = (uuid, status)=> {
    console.log('Executing SQL to change status for UUID:', uuid, 'to status:', status);
    const SQLQuery = `UPDATE users SET status = ? WHERE uuid = ?;`;
    return dbPool.execute(SQLQuery, [status, uuid]);
}

export {
    getAllUser,
    getUserByUUID,
    deleteUserByUUID,
    changeStatus
}