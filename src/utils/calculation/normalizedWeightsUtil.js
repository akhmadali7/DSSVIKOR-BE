const normalizedWeightsUtil = (dataCriteria, dataScore) => {
  // Result array to store the normalized weight values
  if (!Array.isArray(dataCriteria) || !Array.isArray(dataScore))  {
    return null
  }
  const normalizedWeights = [];

  // Loop through the score array
  dataScore.forEach((s) => {
    // Find the corresponding criteria by matching ID_criteria
    const criterion = dataCriteria.find((c) => c.ID_criteria === s.ID_criteria);

    if (criterion && s.score !== null) {
      // Calculate the normalized weight (normalized_score * criteria_weight)
      const normalizedWeight = s.score * criterion.criteria_weight;

      // Store the result with ID_alternative, alternative_name, ID_criteria, and the calculated normalized_weight
      normalizedWeights.push({
        ID_alternative: s.ID_alternative,
        alternative_name: s.alternative_name,
        ID_criteria: s.ID_criteria,
        score: normalizedWeight,
      });
    }
  });

  return normalizedWeights;
};

export default normalizedWeightsUtil;
