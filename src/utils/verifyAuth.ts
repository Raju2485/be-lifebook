const jwt = require('jsonwebtoken');
import config from '../config/config'

export const verifyAuth = async(req, res, next)=> {
    try {
        // console.log("header: ", req?.headers)
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
        // Check if the token exists
        if (!token) {
            return res.status(401).json({success: false, message: 'No token provided' });
        }
        const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
        
        // Attach the decoded token to the request object
        req.user = decoded;

        // Call the next middleware
        next();
    } catch (error) {
        console.log("error at token check: ", error.message)
        if (error.message == 'jwt expired') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                error: error?.message
            });
        }
        else {
            return res.status(400).json({
                success: false,
                message: 'Something went wrong, we are looking into it',
                error: error?.message
            }); 
        }
    }
}