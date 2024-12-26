//Step 7 - Alternative Ranking
//select either rank by value_1, value_2, or value_3 as argument
//Used in #8 compromise solution - Testing 2nd condition: Acceptable Stability in Decision-Making

const sortResultsByScore = (data, valueKey) => {
    if (!data) {
        return null
    }

    if (data.length === 1) {
        return data;
    }

    return data
        .map(alternative => {
            // Create a new object with only the relevant value
            const sortedAlternative = {
                ID_alternative: alternative.ID_alternative,
                alternative_name: alternative.alternative_name,
                Q_scores: {
                    [valueKey]: alternative.Q_scores[valueKey]  // Only include the selected value
                }
            };
            return sortedAlternative;
        })
        .sort((a, b) => a.Q_scores[valueKey] - b.Q_scores[valueKey]);  // Sort based on the selected value
};

export default sortResultsByScore;