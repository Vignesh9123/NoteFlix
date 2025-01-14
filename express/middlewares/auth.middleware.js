import jwt from 'jsonwebtoken';

export async function authMiddleware(req, res, next) {
    try {
        console.log(req);
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: "Unauthorized" });
    }
}