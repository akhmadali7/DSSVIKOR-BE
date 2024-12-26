import dbPool from "../config/database.js";

const getAllScoreV = async (user_id) => {
    const SQLQuery = `SELECT value_1, value_2, value_3 FROM score_v WHERE user_id = ?`
    try {
        const [rows] = await dbPool.query(SQLQuery, [user_id]);
        if (rows.length === 0) {
            return null;
        }
        return rows;
    } catch (err) {
        console.error('Error fetching score values:', err);
        throw new Error('Database query failed');
    }
}

const updateScoreV = (body, user_id) => {
    const {value_1, value_2, value_3} = body;
    const SQLQuery = `UPDATE score_v SET value_1 = ?, value_2 = ?, value_3 = ? WHERE user_id = ?`;
    return dbPool.query(SQLQuery, [value_1, value_2, value_3, user_id]);
};

const createNewScoreV = async (user_id, value_1, value_2, value_3) => {
    const SQLQuery = `INSERT INTO score_v (user_id, value_1, value_2, value_3) VALUES (?,?,?,?);`
    return dbPool.query(SQLQuery, [user_id, value_1, value_2, value_3]);
}

export  {
    getAllScoreV,
    updateScoreV,
    createNewScoreV,
}