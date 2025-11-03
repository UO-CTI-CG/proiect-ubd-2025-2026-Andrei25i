import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: "Acces refuzat. Token lipsa."});
    }

    try {
        const secret = process.env.JWT_SECRET;
        const payload = jwt.verify(token, secret);

        req.user = payload; 
        next()

    } catch (err) {
        res.status(403).json({error: "Token invalid sau expirat."})
    }
}

export default authMiddleware;