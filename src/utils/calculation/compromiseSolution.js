const Condition1_AcceptableAdvantage = (rankbyScoreV, totalAlternative) => {
    // Ensure the input data is valid
    if (!rankbyScoreV || !totalAlternative) {
        return null;
    }

    // If there are fewer than two alternatives, the condition cannot be met
    if (totalAlternative < 2) {
        return {
            conclusion: false
        };
    }

    // Sort the alternatives by 'value_1' in ascending order
    const sortedAlternatives = [...rankbyScoreV].sort((a, b) => a.Q_scores.value_2 - b.Q_scores.value_2);

    // Calculate the threshold DQ
    const DQ = 1 / (totalAlternative - 1);

    // Retrieve the top two ranked alternatives
    const rank1 = sortedAlternatives[0];
    const rank2 = sortedAlternatives[1];

    // Calculate the difference between the second and first ranked alternatives
    const q2minusq1 = rank2.Q_scores.value_2 - rank1.Q_scores.value_2;

    // Determine if the difference meets the acceptable advantage condition
    const conclusion = q2minusq1 >= DQ;

    return {
        q2minusq1Value: q2minusq1,
        DQValue: DQ,
        conclusion: conclusion
    };
};


const Condition2_AcceptableStabilityInDecisionMaking = (data) => {
    // Ensure the input data is valid
    if (!data) {
        return null;
    }

    // If there are fewer than two alternatives, the condition cannot be met
    if (data.length < 2) {
        return {
            conclusion: false
        };
    }

    // Function to sort data by a specific score key
    const sortByScore = (scoreKey) => {
        return [...data].sort((a, b) => a.Q_scores[scoreKey] - b.Q_scores[scoreKey]);
    };

    // Sort the data by 'value_1', 'value_2', and 'value_3'
    const rankingByValue1 = sortByScore('value_1');
    const rankingByValue2 = sortByScore('value_2');
    const rankingByValue3 = sortByScore('value_3');

    // Retrieve the top-ranked alternative for each ranking
    const firstPlaceByValue1 = rankingByValue1[0].ID_alternative;
    const firstPlaceByValue2 = rankingByValue2[0].ID_alternative;
    const firstPlaceByValue3 = rankingByValue3[0].ID_alternative;

    // Check if the top-ranked alternative is consistent across all rankings
    const conclusion = firstPlaceByValue1 === firstPlaceByValue2 && firstPlaceByValue1 === firstPlaceByValue3

    return {firstPlaceByValue1, firstPlaceByValue2, firstPlaceByValue3, conclusion};
};

const finalConclusion = (conclusion1, conclusion2, rankByScoreV, DQValue) => {
    // Ensure the input data is valid
    if (!rankByScoreV || !DQValue) {
        return {
            data: "",
            status: "error",
            message: "No alternatives can be proposes as best alternatives cause of some reasons:",
            possible_reasons: [
                "Data alternatives or criteria are either empty or contain only one entry.",
                "Data scores are incomplete or incorrectly filled, leading to division by zero and preventing the calculation from being performed.",
            ]
        };
    }
    let result = [];
    const sortedAlternatives = rankByScoreV.sort((a, b) => a.Q_scores.value_2 - b.Q_scores.value_2);
    const lowestQScore = sortedAlternatives[0].Q_scores.value_2;

    // Determine the final conclusion based on the conditions
    if (conclusion1 === true && conclusion2 === true) {
        result = [sortedAlternatives[0]];
    } else if (conclusion1 === true && conclusion2 === false) {
        result = [sortedAlternatives[0], sortedAlternatives[1]];
    } else if (conclusion1 === false) {
        result = sortedAlternatives.filter(item => (item.Q_scores.value_2 - lowestQScore) < DQValue);
    } else {
        result = "Invalid result";
    }

    // Add score difference to the result if valid
    if (result !== "Invalid result" && Array.isArray(result)) {
        result = result.map(item => ({
            ...item,
            scoreDifference: item.Q_scores.value_2 - lowestQScore
        }));
    }
    return {
        data: result
    };
};


export {
    Condition1_AcceptableAdvantage,
    Condition2_AcceptableStabilityInDecisionMaking,
    finalConclusion
}