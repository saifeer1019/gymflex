import jwt from 'jsonwebtoken';

/**
 * Authentication middleware
 * @param {Function} handler - The next handler to call if authentication is successful
 * @returns {Function} - Middleware function
 */
export default function authMiddleware(handler) {
    return async (req, res) => {
        const token = req.cookies.auth_token; // Retrieve the token from cookies

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' }); // No token, return 401
        }

        try {
            // Verify the token using the secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Attach user info to request
            req.user = {
                id: decoded.id, // Assuming the token contains the user ID
                email: decoded.email // Assuming the token contains the user email
            };

            return handler(req, res); // Proceed to the next middleware or handler
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' }); // Token verification failed
        }
    };
}