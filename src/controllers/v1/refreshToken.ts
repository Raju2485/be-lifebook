const jwt = require('jsonwebtoken');
const { verifyRefreshToken } = require('../../utils/verifyRefreshToken');
import config from '../../config/config';

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const { tokenDetails } = await verifyRefreshToken(refreshToken);
    console.log('tokenDetails = ', tokenDetails)
    delete tokenDetails.iat
    delete tokenDetails.exp
    const accessToken = jwt.sign(tokenDetails, config.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    return res.status(200).json({
      success: true,
      message: 'New access token created successfully!',
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, message: err.message });
  }
};