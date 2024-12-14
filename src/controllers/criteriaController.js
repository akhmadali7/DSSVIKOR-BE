import * as model from "../models/criteriaModel.js";
import * as scoreModel from "../models/scoreModel.js";

import validateRequiredFields from "../utils/validateRequiredFields.js";

const getAllCriteria = async (req, res) => {
    const [data] = await model.getAllCriteria();

    if (data.length === 0) {
        return res.status(200).json({
            code: "DATA_NOT_EXIST_IN_DATABASE",
            message: 'Data criteria in database is empty'
        })
    }
    try {
        res.status(200).json({
            message: "success get all criteria",
            code: "SUCCESS_GET_DATA",
            total_data: data.length,
            data: data
        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }

}
const getTotalCriteria = async (req, res) => {
    const data = await model.getTotalCriteria();
    try {
        res.status(200).json({
            message: "success get total of criteria",
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
const getOneCriteria = async (req, res) => {
    const id = req.params.id;
    const data = await model.getOneCriteria(id)
    if (!data) {
        return res.status(200).json({
            code: "DATA_NOT_FOUND",
            message: "selected data criteria not found",
            requested_id: id
        })
    }
    try {
        res.status(200).json({
            message: "success get one criteria",
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
const createNewCriteria = async (req, res) => {
    const body = req.body;
    const {trend, parameter_count, criteria_weight} = req.body;
    const requiredFields = ['criteria_name', 'criteria_weight', 'trend', 'parameter_count'];
    if (validateRequiredFields(requiredFields, body, res)) {
        return;
    }

    if (trend !== 'benefit' && trend !== 'cost') {
        return res.status(400).json({
            message: "error while creating criteria",
            code: "VALUE_NOT_ACCEPTED",
            error: 'Invalid trend value. Must be "benefit" or "cost".'
        });
    }

    if (isNaN(criteria_weight) || isNaN(parameter_count)) {
        return res.status(400).json({
            code: "VALUE_NOT_ACCEPTED",
            message: 'Both criteria_weight and parameter_count must be valid numbers.'
        });
    }
    if (parameter_count > 0) {
        body.has_parameter = 1;
    } else if (parameter_count == 0) {
        body.has_parameter = 0;
    } else {
        return res.status(400).json({
            code: "VALUE_NOT_ACCEPTED",
            message: 'parameter count cannot be less than 0'
        });
    }

    try {
        const newCriteriaId = await model.createNewCriteria(body)
        const scoreSeed = await scoreModel.seedScoreByCriteria(newCriteriaId)
        res.status(200).json({
            code: "DATA_CREATED",
            message: "success create one new criteria",
            message2: "success seeding score for new criteria",
            created_id: newCriteriaId,
            data: body
        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}
const deleteOneCriteria = async (req, res) => {
    const id = req.params.id;
    const data = await model.getOneCriteria(id)
    if (!data) {
        return res.status(200).json({
            code: "DATA_NOT_FOUND",
            message: "selected data criteria not found",
            requested_id: id
        })
    }
    try {
        const dataDeleted = await model.getOneCriteria(id)
        await model.deleteOneCriteria(id)
        res.status(200).json({
            message: "success delete one new criteria",
            code: "DATA_DELETED",
            deleted_data: dataDeleted

        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}
const updateOneCriteria = async (req, res) => {
    const id = req.params.id;
    const body = req.body
    const data = await model.getOneCriteria(id)
    if (!data) {
        res.status(200).json({
            code: "DATA_NOT_FOUND",
            message: "selected data criteria not found",
            requested_id: id
        })
    }

    const {trend, parameter_count, criteria_weight} = req.body;
    const requiredFields = ['criteria_name', 'criteria_weight', 'trend', 'parameter_count'];
    if (validateRequiredFields(requiredFields, body, res)) {
        return;
    }
    if (trend !== 'benefit' && trend !== 'cost') {
        return res.status(400).json({
            message: "error while creating criteria",
            code: "VALUE_NOT_ACCEPTED",
            error: 'Invalid trend value. Must be "benefit" or "cost".'
        });
    }
    if (isNaN(criteria_weight) || isNaN(parameter_count)) {
        return res.status(400).json({
            code: "VALUE_NOT_ACCEPTED",
            message: 'Both criteria_weight and parameter_count must be valid numbers.'
        });
    }

    try {
        if (parameter_count > 0) {
            body.has_parameter = 1;
        } else {
            body.has_parameter = 0;
        }
        const updateData = await model.updateOneCriteria(id, body)
        console.log(updateData)
        res.status(200).json({
            message: "success update one new criteria",
            code: "DATA_UPDATED",
            requested_id: id,
            updated_data: body

        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}
export {
    getAllCriteria,
    getTotalCriteria,
    getOneCriteria,
    createNewCriteria,
    deleteOneCriteria,
    updateOneCriteria
}
