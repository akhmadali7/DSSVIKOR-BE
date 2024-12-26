import dbPool from "../config/database.js";

const getAllAlternatives = async (user_id, is_active) => {
    let SQLQuery = `SELECT * FROM alternatives WHERE user_id = ?`;
    if (is_active !== undefined) {
        SQLQuery += ` AND is_active = ?`;
    }
    try {
        // Execute the query and get the rows (results) using mysql2
        const [results] = await dbPool.query(SQLQuery, [user_id, is_active !== undefined ? is_active === 'true' : undefined]);

        // If results are empty, throw null
        if (results.length === 0) {
            return []; // This will indicate that no data was found
        }

        return results; // Return the rows (results)
    } catch (error) {
        if (error === null) {
            console.log("No data found for the given user_id.");
        } else {
            console.error("Error executing query:", error); // Log the error for debugging
            throw new Error("Database query failed"); // Rethrow the error if it's not null
        }
    }
};

const createAlternative = async (body, user_id) => {
    const {alternative_name} = body;
    const SQLQuery = `INSERT INTO alternatives (alternative_name, date_created, user_id) VALUES (?, NOW(), ?);`;
    const [result] = await dbPool.query(SQLQuery, [alternative_name, user_id]);
    return result.insertId;
};
const getOneAlternative = async (id_alternative, user_id) => {
    const SQLQuery = `SELECT * FROM alternatives WHERE ID_alternative = ? AND user_id = ?`;
    try {
        const [rows] = await dbPool.execute(SQLQuery, [id_alternative, user_id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;  // Optional: You could throw or return a custom error
    }
};
const deleteOneAlternative = (id_alternative, user_id) => {
    const SQLQuery = `DELETE FROM alternatives WHERE ID_alternative = ? AND user_id = ?`;
    return dbPool.query(SQLQuery, [id_alternative, user_id]);
};
const updateOneAlternative = (body, id_alternative, user_id) => {
    const {alternative_name} = body;
    const SQLQuery = `UPDATE alternatives SET alternative_name = ?, updated_at = NOW()  WHERE ID_alternative = ? AND user_id=?`;
    return dbPool.query(SQLQuery, [alternative_name, id_alternative, user_id]);
};
const getTotalAlternatives = async (user_id) => {
    const SQLQuery = `SELECT COUNT(*) AS count FROM alternatives WHERE is_active = 1 AND user_id = ?`;
    const [rows] = await dbPool.query(SQLQuery, [user_id]);
    return rows[0].count;
};

export {
    getAllAlternatives,
    createAlternative,
    getOneAlternative,
    deleteOneAlternative,
    updateOneAlternative,
    getTotalAlternatives,
};
