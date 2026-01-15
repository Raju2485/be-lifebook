import { Router } from 'express';
import { signin } from '../../controllers/v1/signin'
import { signup } from '../../controllers/v1/signup'
import { profile } from '../../controllers/v1/profile'
import { refreshToken } from '../../controllers/v1/refreshToken';
import { signout } from '../../controllers/v1/signout';
import { createOrg } from '../../controllers/v1/createOrganization';
import { getOrganizations } from '../../controllers/v1/getOrganizations';
import { getJournalEntries } from '../../controllers/v1/getJournalEntries';
import { postJournalEntry } from '../../controllers/v1/postJournalEntry';
import { changePassword } from '../../controllers/v1/changePassword';
import { sendPasswordResetLink } from '../../controllers/v1/sendPasswordResetLink';
import { resetPassword } from '../../controllers/v1/resetPassword';
import { getUsers } from '../../controllers/v1/getUsers';
import { getRoles } from '../../controllers/v1/getRoles';
import { getAccountTypes } from '../../controllers/v1/getAccountTypes';
import { createAccount } from '../../controllers/v1/createAccount';

const router = Router();
import { verifyAuth } from '../../middlewares/verifyAuth';
import { checkRole } from '../../middlewares/checkRole';

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', profile);
router.post('/refresh-token', refreshToken);
router.post('/signout', verifyAuth, signout);
router.post('/create-organization', verifyAuth, createOrg);
router.get('/get-organizations', verifyAuth, getOrganizations);
router.post('/post-journal-entry', verifyAuth, checkRole(['bookKeeper']), postJournalEntry);
router.get('/get-journal-entries', verifyAuth, getJournalEntries);
router.post('/change-password', verifyAuth, changePassword);
router.post('/send-password-reset-link', sendPasswordResetLink);
router.post('/reset-password', resetPassword);
router.get('/get-users', verifyAuth, getUsers);
router.get('/get-roles', verifyAuth, getRoles);
router.get('/get-account-types', verifyAuth, getAccountTypes);
router.post('/create-account', verifyAuth, createAccount);

export default router;
