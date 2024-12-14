import * as model from "../models/alternativesModel.js";
import validateRequiredFields from "../utils/validateRequiredFields.js";
import * as scoreModel from "../models/scoreModel.js";

const getAllAlternatives = async (req, res) => {
    const { is_active } = req.query;
    if (is_active && is_active !== 'true' && is_active !== 'false') {
        return res.status(400).json({
            message: "Invalid value for 'is_active'. Valid values are 'true', 'false', or omit the parameter for all data.",
        });
    }
    const [data] = await model.getAllAlternatives(is_active);

    if (data.length === 0) {
        return res.status(200).json({
            message: "Data alternatives in database is empty",
        });
    }
    try {
        res.status(200).json({
            message: "success get all alternatives",
            code: "SUCCESS_GET_DATA",
            total_data: data.length,
            data: data,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
};
const createNewAlternative = async (req, res) => {
    const body = req.body;
    const requiredFields = ['alternative_name'];
    if (validateRequiredFields(requiredFields, body, res)) {
        return;
    }

    try {
        const newAlternativeID = await model.createAlternative(body)
        const scoreSeed = await scoreModel.seedScoreByAlternative(newAlternativeID)
        res.status(201).json({
            code: "DATA_CREATED",
            message: "success create new alternative",
            message2: "success seeding score for new alternative",
            created_id: newAlternativeID,
            data: body
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
};
const getOneAlternative = async (req, res) => {
    const id = req.params.id
    const data = await model.getOneAlternative(id)
    console.log(data)
    if (!data) {
        return res.status(200).json({
            code: "DATA_NOT_FOUND",
            message: "selected data alternative not found",
            requested_id: id
        })
    }
    try {
        res.status(200).json({
            message: "success get one alternative",
            requested_id: id,
            data: data
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
};
const updateOneAlternative = async (req, res) => {
    const id = req.params.id
    const body = req.body
    const data = await model.getOneAlternative(id)
    console.log(data)
    console.log(body)
    if (!data) {
        return res.status(200).json({
            code: "DATA_NOT_FOUND",
            message: "not found",
            requested_id: id
        })
    }
    const requiredFields = ['alternative_name'];
    if (validateRequiredFields(requiredFields, body, res)) {
        return;
    }

    try {
        await model.updateOneAlternative(body, id)
        const updatedAlternative = await model.getOneAlternative(id)
        res.status(200).json({
            message: "success update alternative",
            code: "DATA_UPDATED",
            requested_id: id,
            data_updated: updatedAlternative
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
};
const deleteOneAlternative = async (req, res) => {
    const id = req.params.id
    const data = await model.getOneAlternative(id)
    if (!data) {
        return res.status(200).json({
            code: "DATA_NOT_FOUND",
            message: "not found",
            requested_id: id
        })
    }

    try {
        await model.deleteOneAlternative(id)
        res.status(200).json({
            message: "success delete alternative",
            code: "DATA_DELETED",
            data_deleted: data
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
};
const getTotalAlternatives = async (req, res) => {
    const data = await model.getTotalAlternatives();
    try {
        res.status(200).json({
            message: "success get total of alternatives",
            data: data[0].count,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
};

export {
    getAllAlternatives,
    createNewAlternative,
    getOneAlternative,
    updateOneAlternative,
    deleteOneAlternative,
    getTotalAlternatives
};
