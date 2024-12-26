const groupByCriteria = (criteria, score) => {
    let result = criteria.map((criterion) => {
        const scoresForCriterion = score.filter(score => score.ID_criteria === criterion.ID_criteria)
        return {
            ...criterion,
            scores: scoresForCriterion
        };
    });

    return result
}

export default groupByCriteria;