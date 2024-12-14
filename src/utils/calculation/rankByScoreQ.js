//Step 7 - Alternative Ranking
//select either rank by value_1, value_2, or
//Used in #8 compromise solution - Testing 2nd condition: Acceptable Stability in Decision-Making

const sortResultsByScore = (result, valueKey) => {
    return result
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