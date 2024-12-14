const normalizedWeightsUtil = (criteria, score) => {
    // Result array to store the normalized weight values
    const normalizedWeights = [];

    // Loop through the score array
    score.forEach(s => {
        // Find the corresponding criteria by matching ID_criteria
        const criterion = criteria.find(c => c.ID_criteria === s.ID_criteria);

        if (criterion) {
            // Calculate the normalized weight (normalized_score * criteria_weight)
            const normalizedWeight = s.normalized_score * criterion.criteria_weight;

            // Store the result with ID_alternative, ID_criteria, and the calculated normalized_weight
            normalizedWeights.push({
                ID_alternative: s.ID_alternative,
                alternative_name: s.alternative_name,
                ID_criteria: s.ID_criteria,
                normalized_weight: normalizedWeight
            });
        }
    });

    return normalizedWeights;
}

export default normalizedWeightsUtil;