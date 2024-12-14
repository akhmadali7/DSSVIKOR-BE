import * as model from '../models/scoreVModel.js';
import validateRequiredFields from "../utils/validateRequiredFields.js";

const getAllScoreV = async (req, res) => {
    const [data] = await model.getAllScoreV()
    if (data.length === 0) {
        return res.status(200).json({
            message: 'Data score v in database is empty',
            code: "DATA_NOT_FOUND",
        })
    }

    try {
        res.status(200).json({
            message: "success get score V",
            code: "SUCCESS_GET_DATA",
            data: data
        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}

const updateScoreV = async (req, res) => {
    const {value_1, value_2, value_3} = req.body;
    const body = req.body;
    const requiredFields = ['value_1', 'value_2', 'value_3'];
    if (validateRequiredFields(requiredFields, body, res)) {
        return;
    }

    if (isNaN(value_1) || isNaN(value_2) || isNaN(value_3)) {
        return res.status(400).json({
            code: "VALUE_NOT_ACCEPTED",
            message: 'all value must be valid numbers.'
        });
    }

    try {
        const updateData = await model.updateScoreV(body)
        const [updatedData] = await model.getAllScoreV();
        res.status(200).json({
            message: "success update score v",
            data: updatedData
        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}

export {
    getAllScoreV,
    updateScoreV,
}