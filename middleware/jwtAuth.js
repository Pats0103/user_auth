const JWT = require('jsonwebtoken');


const jwtAuth = (req, res, next) => {

    const token = req.cookies.token||null;
    if (!token) {
        return res.status(401).json({
            status: "failed",
            message: "Unauthorized",
        });
    }
try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = {id: decoded.id, email: decoded.email}
    
} catch (error) {
    return res.status(401).json({
        status: "failed",
        message: error.message,
    });
}
    next();
}

module.exports = jwtAuth;
