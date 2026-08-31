// Sign In
/**
 * @swagger
 * /api/v1/signin:
 *   post:
 *     summary: Sign in
 *     tags:
 *       - Common
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: bheema@mailinator.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Signed in successfully!
 */

// Sign Up
/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     summary: Create a new user account
 *     description: Register a new user with email, password, and personal information
 *     tags:
 *       - Common
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - mobileNumber
 *               - countryCode
 *               - dob
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: bheema@mailinator.com
 *                 description: "User's email address (must be unique)"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *                 description: "User's password (minimum 6 characters)"
 *               name:
 *                 type: string
 *                 example: Bheemaraju
 *                 description: User's first name
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 example:
 *                 description: "User's middle name (optional)"
 *               surName:
 *                 type: string
 *                 nullable: true
 *                 example: Bojja
 *                 description: "User's surname (optional)"
 *               mobileNumber:
 *                 type: integer
 *                 example: 8330955007
 *                 description: "User's mobile number (must be a positive number)"
 *               countryCode:
 *                 type: string
 *                 pattern: '^\+?[1-9]\d{0,3}$'
 *                 example: '+91'
 *                 description: "Country code for mobile number (format: +XX or XX)"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: '1990-01-15'
 *                 description: "Date of birth (must be in the past, format: YYYY-MM-DD)"
 *               tob:
 *                 type: string
 *                 format: time
 *                 nullable: true
 *                 example: '14:30:00'
 *                 description: "Time of birth (optional, format: HH:MM or HH:MM:SS)"
 *               TypeId:
 *                 type: integer
 *                 nullable: true
 *                 example: 19
 *                 description: "Type ID reference (must exist in TypeMasters table)"
 *               GenderId:
 *                 type: integer
 *                 nullable: true
 *                 example: 4
 *                 description: "Gender ID reference (must exist in GenderMasters table)"
 *     responses:
 *       200:
 *         description: Signed up successfully!
 */

// Refresh Token
/**
 * @swagger
 * /api/v1/refresh-token:
 *   post:
 *     summary: "Re generate an access token"
 *     tags:
 *       - Common
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Sign Out
/**
 * @swagger
 * /api/v1/signout:
 *   post:
 *     summary: "Signout"
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Change Password
/**
 * @swagger
 * /api/v1/change-password:
 *   post:
 *     summary: "Change Password"
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Send Password Reset Link
/**
 * @swagger
 * /api/v1/send-password-reset-link:
 *   post:
 *     summary: "Send Password Reset Link"
 *     tags:
 *       - Common
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Reset password
/**
 * @swagger
 * /api/v1/reset-password:
 *   post:
 *     summary: "Reset Password"
 *     tags:
 *       - Common
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - hash
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               hash:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Create Organization
/**
 * @swagger
 * /api/v1/create-organization:
 *   post:
 *     summary: "Create Organization"
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Get Organizations
/**
 * @swagger
 * /api/v1/get-organizations:
 *   get:
 *     summary: "get organizations"
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *          type: string
 *       - in: query
 *         name: id
 *         schema:
 *          type: integer
 *       - in: query
 *         name: page
 *         schema:
 *          type: integer
 *         example: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *          type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Get Journal entries
/**
 * @swagger
 * /api/v1/get-journal-entries:
 *   get:
 *     summary: "Get journal"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orgId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the organization
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-1-1
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2026-1-31
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occurred.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Post Journal entry
/**
 * @swagger
 * /api/v1/post-journal-entry:
 *   post:
 *     summary: "Post Journal entry"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orgId
 *               - date
 *               - particulars
 *               - DebitorId
 *               - CreditorId
 *               - amount
 *             properties:
 *               orgId:
 *                 type: integer
 *                 example: 1
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-1-14
 *               particulars:
 *                 type: string
 *                 example: bought furniture
 *               DebitorId:
 *                 type: integer
 *                 example: 1
 *               CreditorId:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: integer
 *                 example: 50000
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Get Users
/**
 * @swagger
 * /api/v1/get-users:
 *   get:
 *     summary: "get users"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orgId
 *         schema:
 *          type: string
 *         required: true
 *       - in: query
 *         name: search
 *         schema:
 *          type: string
 *       - in: query
 *         name: page
 *         schema:
 *          type: integer
 *         example: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *          type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Get Roles
/**
 * @swagger
 * /api/v1/get-roles:
 *   get:
 *     summary: "get roles"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *          type: string
 *       - in: query
 *         name: page
 *         schema:
 *          type: integer
 *         example: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *          type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Get Account Types
/**
 * @swagger
 * /api/v1/get-account-types:
 *   get:
 *     summary: "get account types"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *          type: string
 *       - in: query
 *         name: page
 *         schema:
 *          type: integer
 *         example: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *          type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Check If Account Exists In Org
/**
 * @swagger
 * /api/v1/check-if-account-exists:
 *   get:
 *     summary: "check if account exists in org"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orgId
 *         schema:
 *          type: integer
 *         required: true
 *       - in: query
 *         name: email
 *         schema:
 *          type: string
 *         required: true
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Check If User Exists
/**
 * @swagger
 * /api/v1/check-if-user-exists:
 *   get:
 *     summary: "check if user exists"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orgId
 *         schema:
 *          type: integer
 *         required: true
 *       - in: query
 *         name: email
 *         schema:
 *          type: string
 *         required: true
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Create Account
/**
 * @swagger
 * /api/v1/create-accounts:
 *   post:
 *     summary: "Create Accounts"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orgId
 *               - accounts
 *             properties:
 *               orgId:
 *                 type: integer
 *                 example: 1
 *               accounts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - AccTypeId
 *                   properties:
 *                     UserId:
 *                       type: integer
 *                       example: 1
 *                       description: api is '/api/v1/get-non-account-users'
 *                     isPerson:
 *                       type: boolean
 *                       example: true
 *                       description: true if the account is a person.
 *                     email:
 *                       type: string
 *                       example: bheema@mailinator.com
 *                       description: enter email.
 *                     name:
 *                       type: string
 *                       example: cash
 *                       description: enter name if the desired user not found in dropdown. show either users dropdown or name field.
 *                     middleName:
 *                       type: string
 *                       example: cash
 *                       description: enter middle name.
 *                     surname:
 *                       type: string
 *                       example: cash
 *                       description: enter surname.
 *                     AccTypeId:
 *                       type: integer
 *                       example: 4
 *                       description: api is '/api/v1/get-account-types'
 *                     isMember:
 *                       type: boolean
 *                       example: false
 *                       description: Don't populate if selected user has orgId
 *                     RolesIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 2]
 *                       description: api is '/api/v1/get-roles'. Dropdown should populate if isMember = true. Not a mandatory field
 *                     natureOfAccount:
 *                       type: string
 *                       enum: [null, cash, bank]
 *                       example: cash
 *                       description: Radio buttons should populate if isMember = true. Not a mandatory field
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Get Accounts
/**
 * @swagger
 * /api/v1/get-accounts:
 *   get:
 *     summary: "get accounts"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orgId
 *         schema:
 *          type: string
 *         required: true
 *       - in: query
 *         name: search
 *         schema:
 *          type: string
 *       - in: query
 *         name: page
 *         schema:
 *          type: integer
 *         example: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *          type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Get Accounting Reports
/**
 * @swagger
 * /api/v1/get-accounting-reports:
 *   get:
 *     summary: "Get Accounting Reports"
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orgId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: The ID of the organization
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         example: 2026
 *         required: true
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occurred.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Generate Accounting Reports
/**
 * @swagger
 * /api/v1/generate-accounting-reports:
 *   get:
 *     summary: "Generate Accounting Reports"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: orgId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: The ID of the organization
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           enum:
 *             - January
 *             - February
 *             - March
 *             - April
 *             - May
 *             - June
 *             - July
 *             - August
 *             - September
 *             - October
 *             - November
 *             - December
 *         example: January
 *         required: true
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         example: 2026
 *         required: true
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occurred.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */

// Import journals from excel
/**
 * @swagger
 * /api/v1/import-journals-from-excel:
 *   post:
 *     summary: "import joournals from excel"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - orgId
 *               - file
 *             properties:
 *               orgId:
 *                 type: integer
 *                 example: 1
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: upload excel(.xlsx) file only
 *
 *     responses:
 *       200:
 *         description: The gift created.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: The gift has been declared successfully.
 */

// Get Cards
/**
 * @swagger
 * /api/v1/get-cards:
 *   get:
 *     summary: "get cards"
 *     tags:
 *       - Common
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *          type: string
 *          enum: [dashboard]
 *         required: true
 *       - in: query
 *         name: search
 *         schema:
 *          type: string
 *       - in: query
 *         name: page
 *         schema:
 *          type: integer
 *         example: 1
 *       - in: query
 *         name: perPage
 *         schema:
 *          type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */


// Download Bulk Upload Template
/**
 * @swagger
 * /api/v1/download-bulk-upload-template:
 *   get:
 *     summary: "download bulk upload template"
 *     tags:
 *       - Book Keeper
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: some message
 *       500:
 *         description: Some error occured.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Something went wrong. Our team is working to fix this issue.
 */
