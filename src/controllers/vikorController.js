import * as model from "../models/scoreModel.js";
import * as modelV from "../models/scoreVModel.js";
import criteriaWeightUtil from "../utils/calculation/criteriaWeightsUtil.js";
import decisionMatrixUtils from "../utils/calculation/decisionMatrixUtil.js";
import normalizedMatrixUtil from "../utils/calculation/normalizedMatrixUtil.js";
import normalizedWeightsUtil from "../utils/calculation/normalizedWeightsUtil.js";
import * as calculateSR from "../utils/calculation/utilityRegretUtil.js";
import calculateQScores from "../utils/calculation/indexVikorUtil.js";
import sortResultsByScore from "../utils/calculation/rankByScoreQ.js";

const [dataCriteria] = await model.getDataCriteria();
const [dataScore] = await model.getAllScores();
const [scoreV] = await modelV.getAllScoreV()

const stepOneResult = decisionMatrixUtils(dataCriteria, dataScore);
const stepTwoResult = criteriaWeightUtil(dataCriteria, dataScore);
const stepThreeResult = normalizedMatrixUtil(stepTwoResult, dataScore)
const stepFourResult = normalizedWeightsUtil(dataCriteria, stepThreeResult)
const stepFiveResult = calculateSR.calculateSR(stepFourResult)
const maxMinSR = calculateSR.getMaxMinValuesSR(stepFiveResult)
const stepSixResult = calculateQScores(stepFiveResult, maxMinSR, scoreV)
const stepSevenResult = sortResultsByScore(stepSixResult, "value_1");

const decisionMatrix = async (req, res) => {
    //1. decision-matrix
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #1 - Decision Matrix",
            desc: "Step 1 - Retrieves the decision matrix (F), which represents the alternatives and their values for each criterion.",
            result: stepOneResult
        })

    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}
const criteriaWeights = async (req, res) => {
    //2. criteria-weight
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #2 - Criteria Weight",
            desc: "Step 2 - Retrieves the criteria weights (W), which define the relative importance of each criterion in the decision-making process.",
            result: stepTwoResult
        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}
const normalizedMatrix = async (req, res) => {
    //3. normalized-matrix
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #3 - Normalized Matrix",
            desc: "Retrieves the normalized decision matrix (N), which represents the decision matrix values normalized for comparison.",
            result: stepThreeResult

        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}
const normalizedWeights = async (req, res) => {
    //4. normalized-weight
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #4 - Normalized Weights",
            desc: "Retrieves the normalized weighted matrix (F*), which is the normalized matrix after applying the criteria weights.",
            result: stepFourResult

        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}
const utilityRegret = async (req, res) => {
    //5. Utility & Regret Measure
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #5 - Utility & Regret Measure",
            desc: "Retrieves the utility (S) and regret (R) measures, which evaluate the alternatives based on their performance and distance from the ideal solution.",
            result: stepFiveResult,
            summary: maxMinSR

        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}
const vikorIndex = async (req, res) => {
    //6.  VIKOR Index
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #6 - VIKOR index",
            desc: "Retrieves the VIKOR index (Q) values, which combine utility and regret measures to rank the alternatives.",
            result: stepSixResult

        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}
const alternativeRanking = (req, res) => {
    //7. Alternative Ranking
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #7 - Alternative Ranking",
            desc: "Retrieves the best compromise solution from the ranked alternatives, which balances utility and regret measures.",
            result: stepSevenResult

        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}
const compromiseSolution = async (req, res) => {
    //8. Compromise Solution
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #6 - Compromise Solution",
            desc: "Retrieves the ranked alternatives based on the VIKOR index (Q), ordering the alternatives from the best to the worst.",
            result: stepSixResult

        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}

export {
    decisionMatrix,
    normalizedMatrix,
    criteriaWeights,
    normalizedWeights,
    utilityRegret,
    vikorIndex,
    alternativeRanking
}