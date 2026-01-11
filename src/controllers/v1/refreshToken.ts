const jwt = require('jsonwebtoken');
import config from '../../config/config';
import models from '../../models/index';
import { generateTokens } from '../../utils/generateTokens';

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
    try {
        const isExists = await models.AccessAndRefreshTokens.findOne({
            where: { refreshToken },
          });
    
          if (!isExists) {
            return res.status(400).json({ success: false, message: 'Invalid refresh token' });
          }
    
          const tokenDetails = jwt.verify(
            refreshToken,
            config.REFRESH_TOKEN_SECRET_KEY            
        );  
        // delete tokenDetails.iat;
        // delete tokenDetails.exp;
          
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateTokens(tokenDetails);

        await isExists.destroy();

    return res.status(200).json({
      success: true,
      message: 'New access token created successfully!',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      user_details: tokenDetails
    });
  } catch (error) {
    console.log(error);
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
  }  }
};