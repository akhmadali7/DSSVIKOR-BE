import * as model from '../models/scoreModel.js';
import validateRequiredFields from "../utils/validateRequiredFields.js";
import {getScoresPerAlternative} from "../models/scoreModel.js";

//controller
const getAllScores = async (req, res) => {
    const {userData} = req;
    const {user_id} = userData;
    const dataCriteria = await model.getDataCriteria(user_id);
    const dataScore = await model.getAllScores(user_id);

    if (!dataScore || !dataCriteria) return res.status(200).json({
        code: "DATA_EMPTY",
        message: "Data scores in database is empty",
    });

    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get all scores",
            result: {
                criteria: dataCriteria,
                score: dataScore
            }
        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}

const updateScores = async (req, res) => {
    const ID_alternative = req.params.ID_alternative;
    const { userData } = req;
    const { user_id } = userData;
    let body = req.body;
    const scoreData = await model.getScoresPerAlternative(user_id, ID_alternative);
    if (!scoreData) {
        return res.status(200).json({
            code: "DATA_NOT_FOUND",
            message: "Data scores in the database are empty. Please verify whether the selected alternative exists.",
        });
    }

    const requiredFields = scoreData.map(score => score.ID_score.toString());
    if (validateRequiredFields(requiredFields, body, res)) {
        return;
    }
    console.log('Initial body:', body);

    // If body is an object, convert it into the desired format
    if (typeof body === 'object' && !Array.isArray(body)) {
        // Convert the object to an array of objects with numeric keys and values
        body = Object.entries(body).map(([key, value]) => ({
            [parseInt(key)]: parseInt(value)
        }));
        console.log('Converted body:', body);
    }


    // Validate that the body contains objects with numeric scores
    for (const score of body) {
        const value = Object.values(score)[0]; // Directly extract the value

        if (typeof value !== 'number' || isNaN(value)) {
            return res.status(400).json({
                code: 'INVALID_INPUT',
                message: `Invalid score value for ID_score ${Object.keys(score)[0]}. Score must be a valid number.`,
            });
        }
    }

    // Ensure body is an array
    if (!Array.isArray(body)) {
        return res.status(400).json({
            code: 'INVALID_INPUT',
            message: 'Expected body to be an array or an object.'
        });
    }

    try {
        // Example of handling your update logic
        const updateScore = await model.updateScores(body); // Uncomment this line when ready to update

        res.status(200).json({
            code: "DATA_UPDATED",
            message: "Successfully updated scores",
            result: scoreData
        });
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        });
    }
};


export {
    getAllScores,
    updateScores,
}