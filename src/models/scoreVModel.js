import dbPool from "../config/database.js";

const getAllScoreV = async () => {
    const SQLQuery = `SELECT value_1, value_2, value_3 FROM score_v`
    try {
        const [rows] = await dbPool.query(SQLQuery);
        return rows;  // Return the rows directly, which is an array of results
    } catch (err) {
        console.error('Error fetching score values:', err);
        throw new Error('Database query failed');
    }
}

const updateScoreV = (body) => {
    const {value_1, value_2, value_3} = body;
    const SQLQuery = `UPDATE score_v SET value_1 = ?, value_2 = ?, value_3 = ? `;
    return dbPool.query(SQLQuery, [value_1, value_2, value_3]);
};

export  {
    getAllScoreV,
    updateScoreV
}