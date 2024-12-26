import validateRequiredFields from "../utils/validateRequiredFields.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {v4 as uuidv4} from 'uuid';
import moment from 'moment';

import {passwordSpecificationValidator} from "../utils/validatePassword.js";
import {checkExistingEmail} from "../models/authModel.js";
import {generateNamesFromEmail} from "../utils/generateNamesFromEmail.js";
import * as transactionModel from "../models/transactionModel.js";

import * as model from "../models/authModel.js";
import {createNewScoreV, getAllScoreV} from "../models/scoreVModel.js";
import {getTotalCriteria} from "../models/criteriaModel.js";
import {getTotalAlternatives} from "../models/alternativesModel.js";

const logIn = async (req, res) => {
    const requiredFields = ['email', 'password'];
    const {email, password} = req.body;
    const body = req.body;
    try {
        //validate is required field filled
        if (validateRequiredFields(requiredFields, body, res)) {
            return;
        }
        //Validate if email exist in database
        const user = await model.login(email);
        if (!user) {
            return res.status(401).json({
                status: "error",
                code: "EMAIL_NOT_FOUND",
                message: "Email not exists",
                requested_email: email,
            });
        }
        //Compare provided password with stored password hash
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({
                status: "error",
                code: "PASSWORD_INCORRECT",
                message: "Invalid credentials",
            });
        }

        if (user.status !== "active") {
            return res.status(400).json({
                status: "error",
                code: "ACCOUNT_INACTIVE",
                message: "Account is inactive, please verify your email first or contact admin"
            })
        }

        // generate jwt if success
        const payload = {
            user_id: user.user_id,
            uuid: user.uuid,
            email: user.email,
            role: user.role,
        };

        const JWT_SECRET_AT = process.env.JWT_SECRET_AT;
        const JWT_SECRET_RT = process.env.JWT_SECRET_RT;
        const AT_expiresIn = 60 * 60 * 1;
        const RT_expiresIn = 60 * 60 * 24 * 7;
        const accessToken = jwt.sign(payload, JWT_SECRET_AT, {expiresIn: AT_expiresIn});
        const refreshToken = jwt.sign(payload, JWT_SECRET_RT, {expiresIn: RT_expiresIn});

        const expiresAt = moment().add(RT_expiresIn, 'seconds').toDate();
        await model.saveRefreshToken(user.user_id, refreshToken, expiresAt);
        await model.logLogin(email)

        res.status(200).json({
            message: "Email and password are verified and login succeed",
            code: "LOGIN_SUCCESS",
            logged_in_as: email,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
}

const logOut = async (req, res) => {
    const {userData} = req
    const {user_id, uuid} = userData
    if (!req.userData) {
        return res.status(401).json({
            message: "User is not logged in",
            code: "USER_NOT_LOGGED_IN",
        });
    }
    await model.logOut(user_id);
    try {
        res.status(201).json({
            message: "user logged out successfully",
            code: "USER_LOGGED_OUT",
            logged_out: uuid
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }

}

const register = async (req, res) => {
    try {
        const {email, password} = req.body;
        const body = req.body;

        const requiredFields = ['email', 'password'];
        if (validateRequiredFields(requiredFields, body, res)) {
            return;
        }

        const existingEmail = await checkExistingEmail(email);
        if (existingEmail) {
            return res.status(400).json({
                status: "error",
                code: "EMAIL_ALREADY_REGISTERED",
                message: "The provided email is already registered.",
                registered: email,
            });
        }

        const passwordSpecification = await passwordSpecificationValidator(password);
        if (!passwordSpecification.valid) {
            return res.status(400).json({
                status: passwordSpecification.status,
                code: passwordSpecification.code,
                error: passwordSpecification.message,
            });
        }

        const generatedNames = generateNamesFromEmail(email);
        const {first_name, last_name} = generatedNames

        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
        const password_hash = await bcrypt.hash(password, saltRounds);

        const uuid = uuidv4();
        let status = "inactive"
        let role = "user"

        const newUserData = {uuid, first_name, last_name, status, email, password_hash, role};
        await transactionModel.start();
        const newUserID = await model.register(newUserData);
        const createScoreVRow = await createNewScoreV(newUserID, 0.45, 0.5, 0.55)
        await transactionModel.commit();
        console.log(newUserID)

        res.status(201).json({
            message: "user registered successfully",
            code: "REGISTER_SUCCESS",
            data: {
                email: email,
                first_name: first_name,
                last_name: last_name,
                role: role,
                status: status,
                uuid: uuid
            },
        });
    } catch (err) {
        const rollback = await transactionModel.rollback();
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
}


const getProfileData = async (req, res) => {
    const {userData} = req
    const {user_id, uuid} = userData
    try {
        const [data] = await model.getProfileData(uuid);
        const {total_criteria} = await getTotalCriteria(user_id);
        const totalAlternative = await getTotalAlternatives(user_id);
        const scoreV = await getAllScoreV(user_id);

        res.status(201).json({
            message: "success get user data",
            code: "DATA_RETRIEVED",
            result: {
                data: data,
                total_criteria: total_criteria,
                total_alternative: totalAlternative,
                score_v: scoreV
            }
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error",
            serverMessage: err,
        });
    }
}


export {
    logIn,
    register,
    getProfileData,
    logOut
}