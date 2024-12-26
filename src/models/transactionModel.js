import dbPool from "../config/database.js";

const start = async () => {
    const SQLQuery = 'START TRANSACTION';
    try {
        await dbPool.query(SQLQuery);
    } catch (error) {
        console.error("Error starting transaction: ", error);
        throw error; // Rethrow or handle accordingly
    }
}

const commit = async () => {
    const SQLQuery = 'COMMIT';
    try {
        await dbPool.query(SQLQuery);
    } catch (error) {
        console.error("Error committing transaction: ", error);
        throw error; // Rethrow or handle accordingly
    }
}

const rollback = async () => {
    const SQLQuery = 'ROLLBACK';
    try {
        await dbPool.query(SQLQuery);
    } catch (error) {
        console.error("Error rolling back transaction: ", error);
        throw error; // Rethrow or handle accordingly
    }
}

export {
    start,
    commit,
    rollback
};