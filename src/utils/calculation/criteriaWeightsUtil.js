//Step 2
// Function to calculate best and worst values for each criteria based on its trend
const criteriaWeightUtil = (criteria, scores) => {
    // Create a map to hold the best and worst values for each criteria
    let stepTwoResult = [];

    // Iterate through each criteria
    criteria.forEach(criterion => {
        let criterionScores = scores.filter(score => score.ID_criteria === criterion.ID_criteria);

        let bestValue = null;
        let worstValue = null;

        // Determine best and worst values based on the trend
        if (criterion.trend === "cost") {
            // For cost trend, best value is the lowest score, worst value is the highest score
            bestValue = Math.min(...criterionScores.map(score => score.score));
            worstValue = Math.max(...criterionScores.map(score => score.score));
        } else if (criterion.trend === "benefit") {
            // For benefit trend, best value is the highest score, worst value is the lowest score
            bestValue = Math.max(...criterionScores.map(score => score.score));
            worstValue = Math.min(...criterionScores.map(score => score.score));
        }

        // Store the result for this criterion
        stepTwoResult.push({
            ID_criteria: criterion.ID_criteria,
            criteria_name: criterion.criteria_name,
            trend: criterion.trend,
            criteria_weight: criterion.criteria_weight,
            best_value: bestValue,
            worst_value: worstValue
        });

        // console.log(criterionScores)

    });
    return stepTwoResult;
};

// Export the function
export default criteriaWeightUtil;
