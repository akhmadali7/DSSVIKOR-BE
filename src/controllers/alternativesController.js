import * as model from "../models/alternativesModel.js";
import validateRequiredFields from "../utils/validateRequiredFields.js";
import * as scoreModel from "../models/scoreModel.js";
import * as transactionModel from "../models/transactionModel.js";

const getAllAlternatives = async (req, res) => {
    const {userData} = req;
    const {user_id} = userData;

    const {is_active} = req.query;
    if (is_active && is_active !== 'true' && is_active !== 'false') {
        return res.status(400).json({
            message: "Invalid value for 'is_active'. Valid values are 'true', 'false', or omit the parameter for all data.",
        });
    }

    try {
        const data = await model.getAllAlternatives(user_id, is_active);

        if (!data || data.length === 0) {
            return res.status(200).json({
                code: "DATA_EMPTY",
                message: "Data alternatives in database is empty",
            });
        }
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
    const {userData} = req;
    const {user_id} = userData;

    const requiredFields = ['alternative_name'];
    if (validateRequiredFields(requiredFields, body, res)) {
        return;
    }



    try {
        await transactionModel.start()
        const newAlternativeID = await model.createAlternative(body, user_id)
        const scoreSeed = await scoreModel.seedScoreByAlternative(newAlternativeID)
        await transactionModel.commit()
        res.status(201).json({
            code: "DATA_CREATED",
            message: "success create new alternative",
            message2: "success seeding score for new alternative",
            created_id: newAlternativeID,
            data: body
        });
    } catch (err) {
        await transactionModel.rollback()
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
};
const getOneAlternative = async (req, res) => {
    const id = req.params.id
    const {userData} = req;
    const {user_id} = userData;

    const data = await model.getOneAlternative(id, user_id)
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
    const {userData} = req;
    const {user_id} = userData;

    const data = await model.getOneAlternative(id, user_id)

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
        await model.updateOneAlternative(body, id, user_id)
        const updatedAlternative = await model.getOneAlternative(id, user_id)
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
    const {userData} = req;
    const {user_id} = userData;
    const data = await model.getOneAlternative(id, user_id)
    if (!data) {
        return res.status(200).json({
            code: "DATA_NOT_FOUND",
            message: "not found",
            requested_id: id
        })
    }

    try {
        await model.deleteOneAlternative(id, user_id)
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
    const {userData} = req;
    const {user_id} = userData;
    const total_alternative = await model.getTotalAlternatives(user_id);
    try {
        res.status(200).json({
            message: "success get total of alternatives",
            total_alternative: total_alternative,
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
