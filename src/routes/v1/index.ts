import { Router } from 'express';
import { signin } from '../../controllers/v1/signin'
import { signup } from '../../controllers/v1/signup'
import { profile } from '../../controllers/v1/profile'

const router = Router();

router.post('/signup', signup);

router.post('/signin',  signin);

router.get('/profile',  profile);

export default router;
