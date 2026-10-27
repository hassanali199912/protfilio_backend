/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management & Authentication
 */


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: User login
 *     description: Authenticate user using email and password, returns JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: hassanalihassan1203@gmail.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 */


/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fname:
 *                 type: string
 *               lname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 example: "CODEMODE"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user by ID (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * tags:
 *   name: CV
 *   description: Job analysis and local PDF compile. Does not write portfolio data.
 */

/**
 * @swagger
 * /api/cv/analyze:
 *   post:
 *     tags: [CV]
 *     summary: Analyze a job description
 *     description: Reads the saved profile and returns a summary, matching skills, and a cover letter. Does not update the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobTitle, companyName, jobDescription]
 *             properties:
 *               jobTitle:
 *                 type: string
 *               companyName:
 *                 type: string
 *               jobDescription:
 *                 type: string
 *     responses:
 *       200:
 *         description: Analysis result
 *       400:
 *         description: Validation error or missing profile data
 *       500:
 *         description: OPENROUTER_API_KEY is not configured
 *       502:
 *         description: The model request failed
 */

/**
 * @swagger
 * /api/cv/compile:
 *   post:
 *     tags: [CV]
 *     summary: Compile a filled TeX document to PDF
 *     description: Runs a local LaTeX engine in a temporary folder and returns the PDF. The file is not stored.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tex, filename]
 *             properties:
 *               tex:
 *                 type: string
 *               filename:
 *                 type: string
 *                 enum: [cv, cover-letter]
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Validation error
 *       422:
 *         description: LaTeX compilation failed
 *       500:
 *         description: LaTeX engine is missing or not allowed
 */
