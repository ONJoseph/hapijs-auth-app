const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (pool) => [
  {
    method: 'POST',
    path: '/api/register',
    handler: async (request, h) => {
      try {
        // Retrieve user input (first name, last name, email, password)
        const { firstName, lastName, email, password } = request.payload;

        // Check if the email is already registered
        const emailExistsQuery = {
          text: 'SELECT * FROM users WHERE email = $1',
          values: [email],
        };

        const emailExistsResult = await pool.query(emailExistsQuery);
        if (emailExistsResult.rows.length > 0) {
          return h.response({ message: 'Email address is already in use' }).code(400);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store the user data in the PostgreSQL database
        // You need to create a 'users' table in your 'authdb' database
        const insertUserQuery = {
          text: 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
          values: [firstName, lastName, email, hashedPassword],
        };

        const result = await pool.query(insertUserQuery);

        if (result.rows.length === 1) {
          const token = jwt.sign({ email }, 'a8cd872709c7c96ddef3b994bd3646febce22951ce7fdd08c114182900dc32e313472b938284a582d2cb06c3fc23ddd99b');
          return h.response({ message: 'Registration successful', token }).code(201);
        } else {
          throw new Error('Registration failed');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        return h.response({ message: 'An internal server error occurred' }).code(500);
      }
    },
  },
  {
    method: 'POST',
    path: '/api/login',
    handler: async (request, h) => {
      // Handle user login
      // Retrieve user input (email and password)
      const { email, password } = request.payload;

      // Query the database to retrieve the user's hashed password
      const query = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      };

      const result = await pool.query(query);
      const user = result.rows[0];

      // Check if the user exists and the password is correct
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return h.response('Invalid credentials').code(401);
      }

      // Generate a JWT token
      const token = jwt.sign({ email: user.email }, 'a8cd872709c7c96ddef3b994bd3646febce22951ce7fdd08c114182900dc32e313472b938284a582d2cb06c3fc23ddd99b');

      // Set the token as a cookie
      h.state('token', token);

      return h.response('Login successful').code(200);
    },
  },
];


/*
Node.js application that handles user registration and login, including hashing passwords and generating JWT (JSON Web Tokens). Let's break it down:

Module Imports:

The code begins by importing two important Node.js modules: bcrypt and jsonwebtoken. These modules are used for password hashing and JWT token generation.
Module Exports:

The code exports a function that takes a pool object as an argument. This function returns an array of route objects. It seems to be designed to work with a web framework like Hapi.js or Express.js.
Registration Route:

An object is defined for the registration route:
HTTP method: POST
Path: /api/register
Handler function: An asynchronous function that takes request and h (response toolkit) as parameters.
Inside the handler function, there's a try-catch block, indicating that this route handles errors gracefully.
User Input Retrieval:

User input, including firstName, lastName, email, and password, is retrieved from the request.payload.
Email Existence Check:

An SQL query (emailExistsQuery) is constructed to check if the provided email address already exists in the database.
The query is executed using the pool.query method.
If the email already exists (emailExistsResult.rows.length > 0), a response is sent indicating that the email address is already in use with a 400 status code.
Password Hashing:

The user's password is hashed using bcrypt.hash with a salt factor of 10.
User Data Insertion:

A SQL query (insertUserQuery) is constructed to insert the user's data (first name, last name, email, and hashed password) into a database table named 'users'.
The RETURNING * clause is used to return the inserted user data.
The query is executed, and the result is stored in the result variable.
JWT Token Generation:

If the user is successfully registered (i.e., result.rows.length === 1), a JWT token is generated using jsonwebtoken.sign.
The email is embedded in the token payload, and a secret key is used for signing the token.
Response:

A response is sent back to the client with a 201 status code, indicating a successful registration.
The response includes a message stating "Registration successful" and the JWT token.
Error Handling:

If any error occurs during registration (e.g., database errors or validation issues), it is caught in the catch block.
An error message is logged, and an internal server error response with a 500 status code is sent.
Login Route:

Similar to the registration route, there's another route defined for user login.
It listens for POST requests to /api/login.
User Authentication and JWT Generation:

In the login route, the code queries the database to retrieve the user's hashed password.
It checks if the user exists and if the provided password matches the hashed password using bcrypt.compare.
If the user is authenticated, a JWT token is generated and signed with the user's email and a secret key.
The token is set as a cookie using h.state('token', token).
Login Response:

If the login is successful, a response is sent back to the client with a 200 status code, indicating a successful login.
If the credentials are invalid, a 401 status code is returned with an "Invalid credentials" message.
In summary, this code defines routes for user registration and login. It checks if the email address is already registered, hashes passwords, stores user data in a database, and generates JWT tokens for authentication. It also handles errors and sends appropriate responses based on the outcome of registration and login attempts.

*/