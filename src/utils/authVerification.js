import jwt from 'jsonwebtoken';

const authVerification = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            status: "error",
            code: "TOKEN_NEEDED",
            message: "token needed"
        });
    }

    const token = authorization.split(' ')[1];
    const JWT_SECRET_AT = process.env.JWT_SECRET_AT;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET_AT);
        req.userData = decodedToken; // Attach user data to the request object

        next(); // Continue to the next middleware/route
    } catch (err) {
        return res.status(401).json({
            code: "UNAUTHORIZED",
            status: "error",
            serverMessage: "Internal Server Error"
        });
    }
}

const adminVerification = (req, res, next) => {
    // Ensure the user has admin privileges
    if (req.userData && req.userData.role === 'admin') {
        return next();
    }

    return res.status(403).json({
        status: "error",
        code: "FORBIDDEN",
        message: "Admin access required"
    });
}

export { authVerification, adminVerification };
