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

const getAllScores = async () => {
    const SQLQuery = `SELECT s.ID_score, s.ID_alternative,  a.alternative_name, s.ID_criteria, s.score FROM scores s
    JOIN criteria c ON s.ID_criteria = c.ID_criteria
    JOIN alternatives a ON s.ID_alternative = a.ID_alternative
    WHERE c.include_in_calculation = 1 AND a.is_active = 1;
        `;
    return dbPool.query(SQLQuery);
}

const getDataCriteria = async () => {
    const SQLQuery = `SELECT ID_criteria, criteria_name, trend, criteria_weight FROM criteria WHERE include_in_calculation = 1`;
    return dbPool.query(SQLQuery);
}

export {
    seedScoreByCriteria,
    seedScoreByAlternative,
    getAllScores,
    getDataCriteria
}