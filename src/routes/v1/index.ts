import { Router } from 'express';
import { signin } from '../../controllers/v1/signin'
import { signup } from '../../controllers/v1/signup'
import { profile } from '../../controllers/v1/profile'
import { refreshToken } from '../../controllers/v1/refreshToken';
import { signout } from '../../controllers/v1/signout';
import { createOrg } from '../../controllers/v1/createOrganization';
import { getOrganizations } from '../../controllers/v1/getOrganizations';
import { getCashBookEntries } from '../../controllers/v1/getCashBookEntries';
import { changePassword } from '../../controllers/v1/changePassword';
import { sendPasswordResetLink } from '../../controllers/v1/sendPasswordResetLink';
import { resetPassword } from '../../controllers/v1/resetPassword';

const router = Router();
import { verifyAuth } from '../../middlewares/verifyAuth';

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', profile);
router.post('/refresh-token', refreshToken);
router.post('/signout', verifyAuth, signout);
router.post('/create-organization', verifyAuth, createOrg);
router.get('/get-organizations', verifyAuth, getOrganizations);
router.get('/get-cash-book-entries', verifyAuth, getCashBookEntries);
router.post('/change-password', verifyAuth, changePassword);
router.post('/send-password-reset-link', sendPasswordResetLink);
router.post('/reset-password', resetPassword);

export default router;
