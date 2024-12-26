const calculateQScores = (data, summary, scoreV) => {
    if (!data) {
        return null;
    }


    return data.map(alternative => {
        const { utility_measure, regret_measure, ID_alternative, alternative_name } = alternative;
        const { maxUtility, minUtility, maxRegret, minRegret } = summary;

        // Check for division by zero
        if (maxUtility === minUtility || maxRegret === minRegret) {
            console.error("Max and min utility or regret values are the same, which could lead to division by zero.");
            return {
                ID_alternative,
                alternative_name,
                Q_scores: {
                    value_1: null,
                    value_2: null,
                    value_3: null
                },
            };
        }

        // Function to calculate the Q_score
        const calculateScore = (value) => {
            const utilityPart = (utility_measure - minUtility) / (maxUtility - minUtility);
            const regretPart = (regret_measure - minRegret) / (maxRegret - minRegret);
            return (value * utilityPart) + ((1 - value) * regretPart);
        };

        // Calculate Q_scores for each value in the scoreV object (not array)
        const Q_score_1 = calculateScore(scoreV[0].value_1);  // Accessing the first element of scoreV array
        const Q_score_2 = calculateScore(scoreV[0].value_2);  // Accessing the first element of scoreV array
        const Q_score_3 = calculateScore(scoreV[0].value_3);  // Accessing the first element of scoreV array

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

