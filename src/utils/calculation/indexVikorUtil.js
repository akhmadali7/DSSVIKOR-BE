const calculateQScores = (data, summary, scoreV) => {
    return data.map(alternative => {
        const { utility_measure, regret_measure, ID_alternative, alternative_name } = alternative;
        const { maxUtility, minUtility, maxRegret, minRegret } = summary;

        // Function to calculate the Q_score
        const calculateScore = (value) => {
            const utilityPart = (utility_measure - minUtility) / (maxUtility - minUtility);
            const regretPart = (regret_measure - minRegret) / (maxRegret - minRegret);
            return (value * utilityPart) + ((1 - value) * regretPart);
        };

        // Calculate Q_scores for each value in scoreV
        const Q_score_1 = calculateScore(scoreV.value_1);
        const Q_score_2 = calculateScore(scoreV.value_2);
        const Q_score_3 = calculateScore(scoreV.value_3);

        // Return the result with ID and name, grouped by scoreV values
        return {
            ID_alternative,
            alternative_name,
            Q_scores: {
                value_1: Q_score_1,
                value_2: Q_score_2,
                value_3: Q_score_3
            }
        };
    });
};

export default calculateQScores;