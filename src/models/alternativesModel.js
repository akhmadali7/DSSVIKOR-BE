import dbPool from "../config/database.js";

const getAllAlternatives = (is_active) => {
    let SQLQuery = `SELECT * FROM alternatives`;
    if (is_active !== undefined) {
        SQLQuery += ` WHERE is_active = ?`;
    }
    return dbPool.query(SQLQuery, [is_active !== undefined ? is_active === 'true' : undefined]);
};
const createAlternative = async (body) => {
    const {alternative_name} = body;
    const SQLQuery = `INSERT INTO alternatives (alternative_name, date_created) VALUES (?, NOW());`;
    const [result] = await dbPool.query(SQLQuery, [alternative_name]);
    return result.insertId;
};
const getOneAlternative = async (id) => {
    const SQLQuery = `SELECT * FROM alternatives WHERE ID_alternative = ?`;
    try {
        const [rows] = await dbPool.execute(SQLQuery, [id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;  // Optional: You could throw or return a custom error
    }
};
const deleteOneAlternative = (id) => {
    const SQLQuery = `DELETE FROM alternatives WHERE ID_alternative = ?`;
    return dbPool.query(SQLQuery, [id]);
};
const updateOneAlternative = (body, id) => {
    const {alternative_name} = body;
    const SQLQuery = `UPDATE alternatives SET alternative_name = ?, updated_at = NOW()  WHERE ID_alternative = ?`;
    return dbPool.query(SQLQuery, [alternative_name, id]);
};
const getTotalAlternatives = async () => {
    const SQLQuery = `SELECT COUNT(*) AS count FROM alternatives WHERE is_active = 1`;
    const [rows, fields] = await dbPool.query(SQLQuery);
    return rows;
};

export {
    getAllAlternatives,
    createAlternative,
    getOneAlternative,
    deleteOneAlternative,
    updateOneAlternative,
    getTotalAlternatives,
};
