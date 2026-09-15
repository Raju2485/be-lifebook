import { Router } from 'express';
import { signin } from '../../controllers/v1/signin';
import { signup } from '../../controllers/v1/signup';
import { profile } from '../../controllers/v1/profile';
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
import { getNonAccountUsers } from '../../controllers/v1/getNonAccountUsers';
import { getRoles } from '../../controllers/v1/getRoles';
import { getAccountTypes } from '../../controllers/v1/getAccountTypes';
import { createAccount } from '../../controllers/v1/createAccount';
import { getAccounts } from '../../controllers/v1/getAccounts';
import { checkIfAccountExistsInOrg } from '../../controllers/v1/checkIfAccountExistsInOrg';
import { checkIfUserExists } from '../../controllers/v1/checkIfUserExists';
import { getAccountingReports } from '../../controllers/v1/getAccountingReports';
import { generateAccountingReports } from '../../controllers/v1/generateAccountingReports';
import { importJournalsFromExcel } from '../../controllers/v1/importJournalsFromExcel';
import { downloadBulkUploadTemplate } from '../../controllers/v1/downloadBulkUploadTemplate';
import { getYearsAndMonths } from '../../controllers/v1/getYearsAndMonths';

const router = Router();
import { verifyAuth } from '../../middlewares/verifyAuth';
import { attachMetadataToRequest } from '../../middlewares/attachMetaToReq';
import { checkRole } from '../../middlewares/checkRole';
import { upload } from '../../utils/multer';
import { getCards } from '../../controllers/v1/getDashboardCards';

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh-token', refreshToken);

(router.use(verifyAuth), router.use(attachMetadataToRequest));
router.get('/profile', profile);
router.post('/signout', signout);
router.post('/create-organization', createOrg);
router.get('/get-organizations', getOrganizations);
router.post('/post-journal-entry', checkRole(['book keeper']), postJournalEntry);
router.get(
  '/get-journal-entries',
  checkRole(['book keeper']),
  getJournalEntries
);
router.post('/change-password', changePassword);
router.post('/send-password-reset-link', sendPasswordResetLink);
router.post('/reset-password', resetPassword);
router.get('/get-users', getUsers);
router.get('/get-non-account-users', getNonAccountUsers);
router.get('/get-roles', getRoles);
router.get('/get-account-types', getAccountTypes);
router.post(
  '/create-accounts',
  checkRole(['book keeper', 'admin']),
  createAccount
);
router.get('/get-accounts', checkRole(['book keeper', 'admin']), getAccounts);
router.get(
  '/check-if-account-exists',
  checkRole(['book keeper']),
  checkIfAccountExistsInOrg
);
router.get(
  '/check-if-user-exists',
  checkRole(['book keeper']),
  checkIfUserExists
);
router.get('/get-accounting-reports', getAccountingReports);
router.get(
  '/generate-accounting-reports',
  checkRole(['book keeper']),
  generateAccountingReports
);
router.post(
  '/import-journals-from-excel',
  upload.single('file'),
  checkRole(['book keeper']),
  importJournalsFromExcel
);
router.get('/get-cards', getCards);
router.get(
  '/download-bulk-upload-template',
  checkRole(['book keeper']),
  downloadBulkUploadTemplate
);

router.get('/get-years-and-months', getYearsAndMonths);

export default router;
