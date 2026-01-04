// Post - Sign In

/**
 * @swagger
 * /api/v1/signin:
 *   post:
 *     summary: Sign in
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