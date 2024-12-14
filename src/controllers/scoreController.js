import * as model from '../models/scoreModel.js';


//controller
const getAllScores = async (req, res) => {
    const [dataCriteria] = await model.getDataCriteria();
    const [dataScore] = await model.getAllScores();

    const groupedScores = dataCriteria.map((criterion) => {
        const scoresForCriterion = dataScore.filter(score => score.ID_criteria === criterion.ID_criteria)
        return {
            ...criterion,
            scores: scoresForCriterion
        };
    });
    try {
        res.status(200).json({
            code: "DATA_RETRIEVED",
            message: "success get all scores",
            criteria: groupedScores

        })
    } catch (err) {
        res.status(500).json({
            serverMessage: err,
            message: "Server Error",
        })
    }
}

// const

export {
    getAllScores
}