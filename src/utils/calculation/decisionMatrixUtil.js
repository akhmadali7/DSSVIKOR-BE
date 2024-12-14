// Step 1

const decisionMatrixUtils = (criteria, score) => {
    let stepOneresult = criteria.map((criterion) => {
        const scoresForCriterion = score.filter(score => score.ID_criteria === criterion.ID_criteria)
        return {
            ...criterion,
            scores: scoresForCriterion
        };
    });

return stepOneresult
}

export default decisionMatrixUtils;