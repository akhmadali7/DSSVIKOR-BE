const calculateSR = (data) => {
    //check whether data is null or not
    if (!data) {
        return null
    }

    // Create a map to store utility and regret measures by ID_alternative
    const measures = {};

    // Iterate over the data to calculate utility and regret for each ID_alternative
    data.forEach((item) => {
        const {ID_alternative, alternative_name, score} = item;

        // Initialize the entry for this ID_alternative if it doesn't exist
        if (!measures[ID_alternative]) {
            measures[ID_alternative] = {
                alternative_name,
                utility_measure: 0, // Sum of score
                regret_measure: -Infinity, // Maximum score
            };
        }

        // Add the score to the utility measure for this ID_alternative
        measures[ID_alternative].utility_measure += score;

        // Update the regret measure with the max score for this ID_alternative
        measures[ID_alternative].regret_measure = Math.max(measures[ID_alternative].regret_measure, score);
    });

    // Convert the object into an array of objects
    const result = Object.keys(measures).map((id) => ({
        ID_alternative: parseInt(id),
        alternative_name: measures[id].alternative_name,
        utility_measure: measures[id].utility_measure,
        regret_measure: measures[id].regret_measure,
    }));

    // Return the result as an array
    return result;
};

const getMaxMinValuesSR = (data) => {
    //check whether data is null or not
    if (!data) {
        return null
    }

    // Initialize variables to track the maximal and minimal values for both measures
    let maxUtility = -Infinity;
    let minUtility = Infinity;
    let maxRegret = -Infinity;
    let minRegret = Infinity;

    // Loop through the data to calculate the maximal and minimal values
    data.forEach((item) => {
        // Utility measure comparison
        if (item.utility_measure > maxUtility) maxUtility = item.utility_measure;
        if (item.utility_measure < minUtility) minUtility = item.utility_measure;

        // Regret measure comparison
        if (item.regret_measure > maxRegret) maxRegret = item.regret_measure;
        if (item.regret_measure < minRegret) minRegret = item.regret_measure;
    });

    // Return the maximal and minimal values for both measures
    return {
        maxUtility,
        minUtility,
        maxRegret,
        minRegret,
    };
};

export {calculateSR, getMaxMinValuesSR};
