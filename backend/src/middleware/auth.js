const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const db = require('../db');

//Middleware to protect routes
async function requireAuth(req, res, next) {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);
        if (!token) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided'
            });
        }

        //Verify Token
        const decoded = verifyToken(token);

        const user = await db.queryOne(
            'SELECT id,github_id,username,email,avatar_url FROM users WHERE id =$1',
            [decoded.userId]
        );
        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User not found'
            });
        }

        //Attact this user to request

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: error.message
        });
    }
}

//Optional Auth

async function optionalAuth(req, res, next) {
    try {
        const token = extractTokenFromHeader(req.headers.authorization);

        if (token) {
            const decoded = verifyToken(token);
            const user = await db.queryOne(
                'SELECT id, github_id, username, email, avatar_url FROM users WHERE id = $1',
                [decoded.userId]
            );
            req.user = user;
        }
    } catch (error) {
        // Silently fail for optional auth
    }

    next();
}

module.exports = {
    requireAuth,
    optionalAuth
}