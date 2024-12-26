import dbPool from "../config/database.js";

const getAllCriteria = async (user_id) => {
    const SQLQuery = `SELECT * FROM criteria WHERE user_id = ?`;
    return dbPool.query(SQLQuery, [user_id]);
    try {
        const [results] = await dbPool.query(SQLQuery, [user_id]);
        if (results.length === 0) {
            return [];
        }
        return results;
    } catch (error) {
        if (error === null) {
            console.log("No data found for the given user_id.");
        } else {
            console.error("Error executing query:", error); // Log the error for debugging
            throw new Error("Database query failed"); // Rethrow the error if it's not null
        }
    }
}
const getOneCriteria = async (id_criteria, user_id) => {
    const SQLQuery = `SELECT * FROM criteria WHERE ID_criteria = ? AND user_id = ?`;
    try {
        const [rows] = await dbPool.execute(SQLQuery, [id_criteria, user_id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;  // Optional: You could throw or return a custom error
    }
}
const getTotalCriteria = async (user_id) => {
    const SQLQuery = `SELECT 
        GROUP_CONCAT(criteria_name) AS criteria_names,
        COUNT(*) AS total_criteria,
        SUM(criteria_weight) AS total_weight
    FROM criteria
    WHERE include_in_calculation = 1 AND user_id = ?;`;

    const [rows] = await dbPool.query(SQLQuery,[user_id]);

    // If GROUP_CONCAT returns a string, we split it into an array
    if (rows && rows.length > 0) {
        const criteriaNamesArray = rows[0].criteria_names ? rows[0].criteria_names.split(',') : [];
        return {
            criteria_names: criteriaNamesArray,
            total_criteria: rows[0].total_criteria,
            total_weight: rows[0].total_weight
        };
    }

    return {
        criteria_names: [],
        total_criteria: 0,
        total_weight: 0
    };
};
const createNewCriteria = async (body, user_id) => {
    const {criteria_name, trend, criteria_weight, parameter_count, has_parameter, date_created} = body
    const SQLQuery = `INSERT INTO criteria (criteria_name, trend, criteria_weight, parameter_count, has_parameter, user_id, date_created) VALUES (?, ?, ?, ?, ?, ?, NOW());`;
    // Perform the insert and retrieve the insertId
    const [result] = await dbPool.query(SQLQuery, [criteria_name, trend, criteria_weight, parameter_count, has_parameter, user_id, date_created]);
    // Return the auto-generated ID
    return result.insertId;

}
const deleteOneCriteria = async (id, user_id) => {
    const SQLQuery = `DELETE FROM criteria WHERE ID_criteria = ? AND user_id = ?`;
    return dbPool.query(SQLQuery, [id, user_id]);
}
const updateOneCriteria = (id, body, user_id) => {
    const {criteria_name, trend, criteria_weight, parameter_count, has_parameter} = body
    const SQLQuery =
        `UPDATE criteria SET criteria_name = ?,
        trend = ?,
        criteria_weight = ?,
        parameter_count = ?,
        has_parameter = ?,
        updated_at = NOW()  WHERE ID_criteria = ? AND user_id = ?`;
    return dbPool.query(SQLQuery, [ criteria_name, trend, criteria_weight, parameter_count, has_parameter, id, user_id])

};


export {
    getAllCriteria,
    getTotalCriteria,
    getOneCriteria,
    createNewCriteria,
    deleteOneCriteria,
    updateOneCriteria
}
