import dbPool from "../config/database.js";

const seedScoreByCriteria = (id) => {
    const SQLQuery = `INSERT INTO scores (ID_criteria, ID_alternative, score)
    SELECT ?, a.ID_alternative, 0 as score FROM alternatives a;`;
    return dbPool.query(SQLQuery, [id]);
}

const seedScoreByAlternative = (id) => {
    const SQLQuery = `INSERT INTO scores (ID_criteria, ID_alternative, score)
    SELECT c.ID_criteria, ?, 0 as score FROM criteria c;`;
    return dbPool.query(SQLQuery, [id]);
}

const getAllScores = async (user_id) => {
    try {
        const SQLQuery = `
            SELECT s.ID_score, s.ID_alternative, a.alternative_name, s.ID_criteria, s.score
            FROM scores s
            JOIN criteria c ON s.ID_criteria = c.ID_criteria
            JOIN alternatives a ON s.ID_alternative = a.ID_alternative
            WHERE c.include_in_calculation = 1 
              AND a.is_active = 1 
              AND a.user_id = ? 
              AND c.user_id = ?;
        `;

        const [rows] = await dbPool.query(SQLQuery, [user_id, user_id]);

        // If no rows are found, return null
        if (rows.length === 0) {
            return null;
        }

        return rows;  // Return the rows if they exist
    } catch (error) {
        console.error("Error querying scores: ", error);
        throw error;  // Re-throw the error after logging it
    }
}

const getScoresPerAlternative = async (user_id, ID_alternative) => {
    try {
        const SQLQuery = `
            SELECT s.ID_score, s.ID_alternative, a.alternative_name, s.ID_criteria, s.score
            FROM scores s
            JOIN criteria c ON s.ID_criteria = c.ID_criteria
            JOIN alternatives a ON s.ID_alternative = a.ID_alternative
            WHERE c.include_in_calculation = 1 
              AND a.is_active = 1 
              AND a.user_id = ? 
              AND c.user_id = ?
              AND s.ID_alternative = ?;
        `;

        const [rows] = await dbPool.query(SQLQuery, [user_id, user_id, ID_alternative]);

        // If no rows are found, return null
        if (rows.length === 0) {
            return null;
        }

        return rows;  // Return the rows if they exist
    } catch (error) {
        console.error("Error querying scores: ", error);
        throw error;  // Re-throw the error after logging it
    }
}

const getDataCriteria = async (user_id) => {
    try {
        const SQLQuery = `SELECT ID_criteria, criteria_name, trend, criteria_weight FROM criteria WHERE include_in_calculation = 1 AND user_id = ?`;
        const [rows] = await dbPool.query(SQLQuery, [user_id]);
        if (rows.length === 0) {
            return null;
        }
        return rows;
    } catch (error) {
        console.error("Error querying scores: ", error);
        throw error;
    }
}

const updateScores = async (scoresArr) => {
    try {
        // Convert the array of objects into a structure that has 'ID_score' and 'score' properties
        const scores = scoresArr.map((scoreObj) => {
            const ID_score = Object.keys(scoreObj)[0]; // Get the key (ID_score) from each object
            const score = scoreObj[ID_score]; // Get the value (score)
            return { ID_score, score }; // Return an object with ID_score and score
        });

        // Prepare the SQL query
        const SQLQuery = `UPDATE scores SET score = ? WHERE ID_score = ?`;

        // Map over each score object and execute the query
        const promises = scores.map(({ ID_score, score }) =>
            dbPool.execute(SQLQuery, [score, ID_score])
        );

        // Wait for all queries to complete
        await Promise.all(promises);

        console.log("Scores updated successfully");
    } catch (error) {
        console.error("Error updating scores: ", error);
        throw error;
    }
};



export {
    seedScoreByCriteria,
    seedScoreByAlternative,
    getAllScores,
    getDataCriteria,
    updateScores,
    getScoresPerAlternative
}