import models from '../../models/index';

export const signout = async (req, res) => {
    const { id } = req.user;
    
  try {
    const isExists = await models.AccessAndRefreshTokens.findOne({
      where: { UserId: id },
    });

    if (!isExists) {
      return res.status(200).json({
        success: true,
        message: 'Thanks! You have logged out successfully',
      });
    }

    await isExists.destroy();
    return res.status(200).json({
      success: true,
      message: 'Thanks! You have logged out successfully',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};