const generateNamesFromEmail = (email) => {
    const username = email.split("@")[0]; // Get the part before the '@'
    const cleanedUsername = username.replace(/[^a-zA-Z0-9_.-]/g, ""); // Remove invalid characters, allow numbers, underscores, periods, hyphens
    const splitName = cleanedUsername.split(/[._-]/); // Split based on common delimiters like '.', '_', or '-'

    let first_name = splitName[0] || "";
    let last_name = splitName.length > 1 ? splitName.slice(1).join(" ") : ""; // If more than one part, join the remaining ones as last name

    // Capitalize the first letter of both names
    first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1).toLowerCase();
    last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1).toLowerCase();

    // If there's no last name, assign a space or handle it as a fallback
    if (!last_name) {
        last_name = " ";
    }

    return { first_name, last_name };
};

export {
    generateNamesFromEmail,
}