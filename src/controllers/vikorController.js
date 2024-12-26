import * as model from "../models/scoreModel.js";
import * as modelV from "../models/scoreVModel.js";
import {getTotalAlternatives} from "../models/alternativesModel.js";
import criteriaWeightUtil from "../utils/calculation/criteriaWeightsUtil.js";
import decisionMatrixUtils from "../utils/calculation/decisionMatrixUtil.js";
import normalizedMatrixUtil from "../utils/calculation/normalizedMatrixUtil.js";
import normalizedWeightsUtil from "../utils/calculation/normalizedWeightsUtil.js";
import * as calculateSR from "../utils/calculation/utilityRegretUtil.js";
import calculateQScores from "../utils/calculation/indexVikorUtil.js";
import sortResultsByScore from "../utils/calculation/rankByScoreQ.js";
import * as testingCondition from "../utils/calculation/compromiseSolution.js";
import groupByCriteria from "../utils/groupByCriteria.js";

const calculateDecisionPipeline = async (req, res) => {
    const {userData} = req;
    const {user_id} = userData;
    const dataCriteria = await model.getDataCriteria(user_id);
    const dataScore = await model.getAllScores(user_id);
    const scoreV = await modelV.getAllScoreV(user_id);
    const totalAlternative = await getTotalAlternatives(user_id);
    const stepTwoResult = criteriaWeightUtil(dataCriteria, dataScore);
    const stepThreeResult = normalizedMatrixUtil(stepTwoResult, dataScore);
    const stepFourResult = normalizedWeightsUtil(dataCriteria, stepThreeResult);
    const stepFiveResult = calculateSR.calculateSR(stepFourResult);
    const maxMinSR = calculateSR.getMaxMinValuesSR(stepFiveResult);
    const stepSixResult = calculateQScores(stepFiveResult, maxMinSR, scoreV);
    const rankByScoreV = sortResultsByScore(stepSixResult, "value_2");

    //Compromise Solutions
    const conditionOneResult = testingCondition.Condition1_AcceptableAdvantage(rankByScoreV, totalAlternative);
    const conditionTwoResult = testingCondition.Condition2_AcceptableStabilityInDecisionMaking(stepSixResult);
    const {conclusion: conclusion1, DQValue} = conditionOneResult || 0;
    const {conclusion: conclusion2} = conditionTwoResult || 0;
    const stepEightResult = testingCondition.finalConclusion(conclusion1, conclusion2, rankByScoreV, DQValue);

    return {
        dataCriteria,
        dataScore,
        scoreV,
        totalAlternative,
        stepTwoResult,
        stepThreeResult,
        stepFourResult,
        stepFiveResult,
        maxMinSR,
        stepSixResult,
        rankByScoreV,

            conditionOneResult,
            conditionTwoResult,
            conclusion1,
            DQValue,
            conclusion2,
            stepEightResult
    }
};


const decisionMatrix = async (req, res) => {
    //1. decision-matrix
    const result = await calculateDecisionPipeline(req, res)
    const dataCriteria = result.dataCriteria;
    const dataScore = result.dataScore;
    if (!dataScore || !dataScore) {
        return res.status(200).json({
            code: "DATA_EMPTY",
            message: "Data decision matrix in database is empty",
        })
    }

    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #1 - Decision Matrix",
            description: "Step 1 - Retrieves the decision matrix (F), which represents the alternatives and their values for each criterion.",
            //   result: stepOneResult,
            dataCriteria: dataCriteria,
            dataScore: dataScore,
        });
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        });
    }
};
const criteriaWeights = async (req, res) => {
    //2. criteria-weight
    const result = await calculateDecisionPipeline(req, res);
    const stepTwoResult = result.stepTwoResult;
    if (!stepTwoResult) {
        return res.status(200).json({
            code: "DATA_EMPTY",
            message: "Data criteria weight in database is empty",
        })
    }
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #2 - Criteria Weight",
            description:
                "Step 2 - Retrieves the criteria weights (W), which define the relative importance of each criterion in the decision-making process.",
            result: stepTwoResult,
        });
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        });
    }
};
const normalizedMatrix = async (req, res) => {
    //3. normalized-matrix
    const result = await calculateDecisionPipeline(req, res)
    const stepThreeResult = result.stepThreeResult;
    const dataCriteria = result.dataCriteria

    if (!stepThreeResult || !dataCriteria) {
        return res.status(200).json({
            code: "DATA_EMPTY",
            message: "Data normalized matrix in database is empty",
        })
    }
    try {

        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #3 - Normalized Matrix",
            description: "Retrieves the normalized decision matrix (N), which represents the decision matrix values normalized for comparison.",
            // result: stepThreeResult
            // result: groupResult,
            dataCriteria: dataCriteria,
            dataScore: stepThreeResult,
        });
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        });
    }
};
const normalizedWeights = async (req, res) => {
    //4. normalized-weight
    const result = await calculateDecisionPipeline(req, res)
    const stepFourResult = result.stepFourResult;
    const dataCriteria = result.dataCriteria

    if (!stepFourResult || !dataCriteria) {
        return res.status(200).json({
            code: "DATA_EMPTY",
            message: "Data normalized weighs in database is empty",
        })
    }
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #4 - Normalized Weights",
            description: "Retrieves the normalized weighted matrix (F*), which is the normalized matrix after applying the criteria weights.",
            dataCriteria: dataCriteria,
            dataScore: stepFourResult,
        });
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        });
    }
};
const utilityRegret = async (req, res) => {
    //5. Utility & Regret Measure
    const result = await calculateDecisionPipeline(req, res)
    const stepFiveResult = result.stepFiveResult;
    const maxMinSR = result.maxMinSR
    if (!stepFiveResult || !maxMinSR) {
        return res.status(200).json({
            code: "DATA_EMPTY",
            message: "Data utility and regret measures in database are empty",
        })
    }
    try {

        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #5 - Utility & Regret Measure",
            description:
                "Retrieves the utility (S) and regret (R) measures, which evaluate the alternatives based on their performance and distance from the ideal solution.",
            result: stepFiveResult,
            summary: maxMinSR,
        });
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        });
    }
};
const vikorIndex = async (req, res) => {
    //6.  VIKOR Index
    const result = await calculateDecisionPipeline(req, res)
    const scoreV = result.scoreV
    const stepSixResult = result.stepSixResult

    if (!stepSixResult) {
        return res.status(200).json({
            code: "DATA_EMPTY",
            message: "Data VIKOR index in database is empty",
        })
    }
    try {

        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #6 - VIKOR index",
            description: "Retrieves the VIKOR index (Q) values, which combine utility and regret measures to rank the alternatives.",
            scoreV: scoreV,
            result: stepSixResult,
        });
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        });
    }
};
const alternativeRanking = async (req, res) => {
    //7. Alternative Ranking
    const result = await calculateDecisionPipeline(req, res)
    const rankByScoreV = result.rankByScoreV
    if (!rankByScoreV) {
        return res.status(200).json({
            code: "DATA_EMPTY",
            message: "Data alternative ranking in database is empty",
        })
    }
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #7 - Alternative Ranking",
            description: "Retrieves the best compromise solution from the ranked alternatives, which balances utility and regret measures.",
            result: rankByScoreV,
        });
    } catch (err) {
        console.error(err)
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        });
    }
};


const compromiseSolution = async (req, res) => {
    //8. Compromise Solution

    const result = await calculateDecisionPipeline(req, res)
    const totalAlternative = result.totalAlternative
    if (!totalAlternative) {
        return res.status(200).json({
            code: "DATA_EMPTY",
            message: "Data compromise solution in database is empty, try adding alternative first",
        })
    }
    const stepSixResult = result.stepSixResult

    const conditionOneResult = result.conditionOneResult
    const conditionTwoResult = result.conditionTwoResult

    const conclusion1 = result.conclusion1
    const conclusion2 = result.conclusion2
    const stepEightResult = result.stepEightResult

    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get data for Step #6 - Compromise Solution",
            description: "Retrieves the ranked alternatives based on the VIKOR index (Q), ordering the alternatives from the best to the worst.",
            totalAlternative: totalAlternative,
            scoreOnAllV: stepSixResult,

            conditionOne: conditionOneResult,
            conditionTwo: conditionTwoResult,

            finalConclusion: {
                conclusion1: conclusion1,
                conclusion2: conclusion2,
                bestAlternative_ranked: stepEightResult,
            },
        });
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        });
    }
};
export {
    decisionMatrix,
    criteriaWeights,
    normalizedMatrix,
    normalizedWeights,
    utilityRegret,
    vikorIndex,
    alternativeRanking,
    compromiseSolution,
};
