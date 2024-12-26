// passwordValidation.js

// Regular Expression to match the updated password requirements
const passwordSpecificationValidator = (password) => {
    const minLength = 8;
    const maxLength = 20; // Optional: You could add an upper limit to the password length.

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;

    // Check for required length and characters
    if (password.length < minLength || password.length > maxLength) {
        return { valid: false, status: "error", code: "PASSWORD_INVALID", message: `Password must be between ${minLength} and ${maxLength} characters.` };
    }

    if (!regex.test(password)) {
        return {
            valid: false,
            status: "error",
            code: "PASSWORD_INVALID",
            message: "Password must include at least one lowercase letter, one uppercase letter, and one number.",
        };
    }

    return { valid: true, message: "Password is valid." };
};

export { passwordSpecificationValidator };
