// Post - Sign In

/**
 * @swagger
 * /api/v1/signin:
 *   post:
 *     summary: Sign in
 *     tags:
 *       - Common
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: email1256@mailinator.com
 *               password:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: Signed in successfully!
 */

// Post - Sign Up

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
 *                 example: john.doe@example.com
 *                 description: "User's email address (must be unique)"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *                 description: "User's password (minimum 6 characters)"
 *               name:
 *                 type: string
 *                 example: John
 *                 description: User's first name
 *               middleName:
 *                 type: string
 *                 nullable: true
 *                 example: Michael
 *                 description: "User's middle name (optional)"
 *               surName:
 *                 type: string
 *                 nullable: true
 *                 example: Doe
 *                 description: "User's surname (optional)"
 *               mobileNumber:
 *                 type: integer
 *                 example: 1234567890
 *                 description: "User's mobile number (must be a positive number)"
 *               countryCode:
 *                 type: string
 *                 pattern: '^\+?[1-9]\d{0,3}$'
 *                 example: '+1'
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
 *                 example: 1
 *                 description: "Type ID reference (must exist in TypeMasters table)"
 *               GenderId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *                 description: "Gender ID reference (must exist in GenderMasters table)" 
 *     responses:
 *       200:
 *         description: Signed up successfully!
 */