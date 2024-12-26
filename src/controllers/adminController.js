import * as model from "../models/adminModel.js";

const getAllUsers = async (req, res) => {

    try {
        const data = await model.getAllUser();
        if (!data || data.length === 0) {
            return res.status(200).json({
                code: "DATA_EMPTY",
                message: "Data users in database is empty",
            });
        }
        res.status(200).json({
            message: "success get all users",
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
}


const getUserByUUID = async (req, res) => {
    try {
        const { uuid } = req.params;
        const data = await model.getUserByUUID(uuid);
        if (!data || data.length === 0) {
            return res.status(200).json({
                code: "DATA_NOT_FOUND",
                message: "Data user in database is empty",
                requested_uuid: uuid,
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
}

const deleteUserByUUID = async (req, res) => {
    try {
        const { uuid } = req.params;
        const data = await model.getUserByUUID(uuid);


        if (!data || data.length === 0) {
            return res.status(200).json({
                code: "DATA_NOT_FOUND",
                message: "Data user in database is empty",
                requested_uuid: uuid,
            });
        }

        const {role} = data
        if (role === "admin") {
            return res.status(200).json({
                code: "CANNOT_DELETE_ADMIN",
                message: "Cannot delete admin user",
                requested_uuid: uuid,
            });
        }
        await model.deleteUserByUUID(uuid);
        res.status(200).json({
            code: "SUCCESS_DELETE_USER",
            message: "success delete user data",
            deleted_uuid: uuid
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
}

const changeStatus = async (req, res) => {
    try {
        const { uuid } = req.params;
        const data = await model.getUserByUUID(uuid);
        if (!data || data.length === 0) {
            return res.status(200).json({
                code: "DATA_NOT_FOUND",
                message: "Data user in database is empty",
                requested_uuid: uuid,
            });
        }

        let newStatus
        const {status} = data
        if (status === "inactive") {
            newStatus = "active"
        } else {
            newStatus = "inactive"
        }

        console.log('status', status)
        console.log('newStatus', newStatus)

        //activate or deactivate function
        const changeStatus = await model.changeStatus(uuid, newStatus)
        res.status(200).json({
            code: "SUCCESS_CHANGE_USER_STATUS",
            message: "success change status of user: " + uuid,
            current_status: newStatus,
        });
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
}

export {
    getAllUsers,
    getUserByUUID,
    deleteUserByUUID,
    changeStatus
}