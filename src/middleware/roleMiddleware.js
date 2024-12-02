import User from '../models/User';
import authMiddleware from './authMiddleware';
import dbConnect from '@/app/lib/dbconnect';

/**
 * Role-based access control middleware
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {Function} - Middleware function
 */
function roleMiddleware(allowedRoles) {
  return (handler) => {
    return authMiddleware(async (req, res) => {
      await dbConnect();
      const user = req.user;

      try {
        // Fetch full user details to get the role
        const fullUser = await User.findById(user.id);

        if (!fullUser) {
          return res.status(401).json({ message: 'User not found' });
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(fullUser.role)) {
          return res.status(403).json({ 
            message: 'Access denied',
            requiredRoles: allowedRoles,
            userRole: fullUser.role 
          });
        }

        // Proceed with the original handler
        return handler(req, res);
      } catch (error) {
        console.error('Role verification error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    });
  };
}

export default roleMiddleware;