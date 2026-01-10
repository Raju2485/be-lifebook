import { Router } from 'express';
import { signin } from '../../controllers/v1/signin'
import { signup } from '../../controllers/v1/signup'
import { profile } from '../../controllers/v1/profile'
import { refreshToken } from '../../controllers/v1/refreshToken';
import { signout } from '../../controllers/v1/signout';


const router = Router();
import { verifyAuth } from '../../utils/verifyAuth';

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', profile);
router.post('/refresh-token', refreshToken);
router.post('/signout', verifyAuth, signout);

export default router;
