const Hapi = require('@hapi/hapi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const HapiCors = require('hapi-cors');

const jwtSecret = 'a8cd872709c7c96ddef3b994bd3646febce22951ce7fdd08c114182900dc32e313472b938284a582d2cb06c3fc23ddd99b';
const serverPort = 3000;

const init = async () => {
  const server = Hapi.server({
    port: serverPort,
    host: 'localhost',
  });

  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'authdb',
    password: '2023',
    port: 5432,
  });

  // Register the authentication plugin
  await server.register(require('@hapi/cookie'));

  // Register the hapi-cors plugin with your desired configuration
  await server.register({
    plugin: HapiCors,
    options: {
      origins: ['http://localhost:3000'], // List of allowed origins
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // List of allowed HTTP methods
    },
  });

  // Registration Route
  server.route({
    method: 'POST',
    path: '/api/register',
    handler: async (request, h) => {
      try {
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
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const query = {
          text: 'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
          values: [firstName, lastName, email, hashedPassword],
        };
  
        const result = await pool.query(query);
  
        if (result.rows.length === 1) {
          const token = jwt.sign({ email }, jwtSecret);
  
          // Return the JWT token upon successful registration
          return h.response({ message: 'Registration successful', token }).code(201);
        } else {
          return h.response({ message: 'Registration failed' }).code(500);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        return h.response({ message: 'An internal server error occurred' }).code(500);
      }
    },
  });
      
  // Login Route
server.route({
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

    try {
      const result = await pool.query(query);
      const user = result.rows[0];

      // Check if the user exists and the password is correct
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return h.response('Invalid email or password. Please check your credentials and try again.').code(401);
      }

      // Generate a JWT token upon successful login
      const token = jwt.sign({ email: user.email }, jwtSecret);

      // Redirect to the login page with the JWT token in the query parameter
      return h.response({ message: 'Login successful', token }).code(200);
    } catch (error) {
      console.error('Error during login:', error);
      return h.response({ message: 'An internal server error occurred' }).code(500);
    }
  },
});

  return server;
};

const startServer = async () => {
  try {
    const server = await init();
    await server.start();
    console.log(`Server running on http://localhost:${serverPort}`);
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

startServer();


/*
Node.js server application that handles user registration, login, and authentication. It uses the Hapi.js framework for building the server. Let's break down the code:

Module Imports:

The code begins by importing several Node.js modules and dependencies:
Hapi: This is the Hapi.js framework for building HTTP servers.
bcrypt: Used for hashing passwords securely.
jsonwebtoken: Used for generating JSON Web Tokens (JWTs) for user authentication.
Pool from pg: Part of the PostgreSQL client library, it allows managing a pool of database connections.
HapiCors: A plugin for handling Cross-Origin Resource Sharing (CORS) in Hapi.js applications.
Configuration Variables:

jwtSecret: This variable holds a secret key used for signing and verifying JWT tokens.
serverPort: It specifies the port number (3000) on which the server will listen.
Server Initialization:

The init function is defined, which is an asynchronous function responsible for setting up and configuring the Hapi.js server.
Create an HTTP Server:

Inside the init function, an instance of the Hapi server is created using Hapi.server(). It listens on the serverPort and 'localhost'.
Database Connection Pool:

A PostgreSQL database connection pool (pool) is created with connection details such as username, host, database name, password, and port. This pool allows efficient database connections and queries.
Plugin Registration:

Two plugins are registered with the Hapi server:
@hapi/cookie: This plugin is used for handling cookies.
HapiCors: It's used to enable CORS for specified origins and HTTP methods.
Registration Route:

A route is defined for user registration with the path /api/register. It listens for HTTP POST requests.
Inside the route's handler function, user registration logic is implemented:
User input data such as firstName, lastName, email, and password is extracted from the request payload.
An SQL query is constructed to check if the provided email already exists in the database. If it does, a 400 response is sent.
The user's password is hashed securely using bcrypt.
Another SQL query is constructed to insert the user's data into the 'users' table. If successful, a JWT token is generated and sent in the response.
Error handling is implemented to catch and log any errors during registration.
Login Route:

A similar route is defined for user login with the path /api/login, listening for HTTP POST requests.
The login logic checks if the provided credentials (email and password) are valid:
It queries the database to retrieve the user's hashed password.
It uses bcrypt.compare to compare the provided password with the hashed password.
If the user exists and the password is correct, a JWT token is generated and sent in the response.
If the credentials are invalid, a 401 response is sent.
Error handling is implemented for any errors that may occur during login.
Server Start:

The startServer function is defined, which starts the server by calling the init function and then calling server.start().
If the server starts successfully, a message is logged indicating its address.
If there's an error, it's caught, logged, and the process exits with an error code.
Unhandled Rejection Handling:

An event listener is added for unhandled promise rejections, which logs any unhandled promise rejection errors and exits the process with an error code.
Start the Server:

Finally, the startServer function is called to start the server when the script is executed.
In summary, this code sets up a Hapi.js server with routes for user registration and login, handles database interactions using a PostgreSQL connection pool, and provides JWT-based authentication. It also includes error handling to ensure the server operates smoothly.

*/