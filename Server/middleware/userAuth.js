// Import JSON Web Token library for token verification
import jwt from 'jsonwebtoken'

// Middleware function for user authentication
const userAuth = async (req, res, next) => {
    // Extract token from cookies in the request
    const { token } = req.cookies;

    // Check if token exists
    if(!token){
        // Return unauthorized status if no token is present
        return res.status(401).json({ success: false, message: 'Not authorised login again' });
    }
    try {
        // Verify and decode the JWT token using the secret key
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        // Check if decoded token contains user ID
        if(tokenDecode.id){
            // Add user ID to request body for further use
            req.body.userId = tokenDecode.id
        }else{
            // Return unauthorized if token doesn't contain user ID
            return res.status(401).json({ success: false, message: 'Not authorised login again' });
        }

        // Call next middleware in the chain
        next();

    } catch (error) {
        // Handle token verification errors
        res.status(401).json({ success: false, message: error.message });
    }
}

export default userAuth;