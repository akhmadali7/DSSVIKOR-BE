//Step 3
//Retrieves the normalized decision matrix (N), which represents the decision matrix values normalized for comparison.
const normalizedMatrixUtil = (criteria, score) => {
  if (!Array.isArray(criteria) || !Array.isArray(score))  {
    return null
  }
  // Result to store normalized data

  const stepThreeResult = [];

  // Loop through the scores
  score.forEach((s) => {
    // Find corresponding criteria
    const criterion = criteria.find((c) => c.ID_criteria === s.ID_criteria);

    if (criterion) {
      const { best_value, worst_value } = criterion;

      // Check if best_value is different from worst_value to avoid division by zero
      if (best_value !== worst_value) {
        const normalizedScore = (best_value - s.score) / (best_value - worst_value);
        stepThreeResult.push({
          ID_alternative: s.ID_alternative,
          alternative_name: s.alternative_name,
          ID_criteria: s.ID_criteria,
          score: normalizedScore,
        });
      } else {
        // If best_value equals worst_value, normalization is not applicable, we set score to 0 or NaN.
        stepThreeResult.push({
          ID_alternative: s.ID_alternative,
          alternative_name: s.alternative_name,
          ID_criteria: s.ID_criteria,
          score: 0, // or NaN, depending on your preference
        });
      }
    }
  });

  return stepThreeResult;
};

export default normalizedMatrixUtil;
