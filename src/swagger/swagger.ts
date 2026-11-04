// API Schema
/**
 * @swagger
 * /api/schema:
 *   get:
 *     summary: "API Schema"
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
