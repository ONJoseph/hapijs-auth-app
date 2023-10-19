import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthForm.css';

function AuthForm({ registration }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    registrationError: '',
    loginError: '',
    isAuthenticated: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 201) {
        alert('Registration successful');
        setFormData({ ...formData, registrationError: '' });
        navigate('/login');
      } else if (response.status === 400) {
        const data = await response.json(); // Added this line
        setFormData({ ...formData, registrationError: data.message });
      } else {
        const data = await response.json(); // Added this line
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setFormData({ ...formData, registrationError: error.message || 'Registration failed' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.status === 200) {
        alert('Login successful');
        setFormData({ ...formData, loginError: '', isAuthenticated: true });
        // Redirect to a different page after successful login if needed
        // navigate('/dashboard');
      } else if (response.status === 401) {
        setFormData({ ...formData, loginError: 'Invalid email or password. Please check your credentials and try again.' });
      } else {
        const data = await response.json(); // Added this line
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setFormData({ ...formData, loginError: error.message || 'Login failed' });
    }
  };
  
  return (
    <div>
      {registration ? (
        <div>
          <h1>User Registration</h1>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit">Register</button>
          </form>
          {formData.registrationError && (
            <p className="error">{formData.registrationError}</p>
          )}
        </div>
      ) : (
        <div>
          <h1>User Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button type="submit">Login</button>
          </form>
          {formData.loginError && (
            <p className="error">{formData.loginError}</p>
          )}
          {/* Add a link to the registration page */}
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      )}

      {formData.isAuthenticated && (
        <p className="success">You are logged in as {formData.email}.</p>
      )}
    </div>
  );
}

export default AuthForm;



/*
Import Statements:

The code starts by importing necessary modules and components from the react and react-router-dom libraries.
It also imports a CSS file named AuthForm.css.
Functional Component Declaration:

The code defines a functional component named AuthForm that takes a single prop called registration.
State Initialization:

Inside the AuthForm component, there's a useState hook used to initialize the component's state. It sets up the following initial state values in an object:
email: An empty string.
password: An empty string.
registrationError: An empty string (used to store registration-related error messages).
loginError: An empty string (used to store login-related error messages).
isAuthenticated: A boolean set to false (used to track whether the user is authenticated or not).
Navigation Setup:

The useNavigate hook from react-router-dom is used to get the navigate function, which can be used to programmatically navigate to different pages within the app.
Event Handlers:

There are two event handlers defined within the component:
handleChange: This function is used to handle changes in the input fields. When an input value changes, it updates the corresponding property in the component's state.
handleRegister: This function is called when the user submits the registration form. It sends a POST request to the /api/register endpoint with the user's email and password. Depending on the response status code, it updates the state to reflect success or error.
Registration Form:

If the registration prop is true, the component renders a registration form.
The form includes input fields for the user's first name, last name, email, and password.
When the user submits the form, it triggers the handleRegister function.
Login Form:

If the registration prop is false, the component renders a login form.
The form includes input fields for the user's email and password.
When the user submits the form, it triggers the handleLogin function.
Error Handling:

If there are registration or login errors, error messages are displayed below the respective forms.
Navigation Links:

Depending on whether it's a registration or login form, there's a link to navigate to the opposite form (e.g., from login to registration).
Authentication Success Message:

If the user is authenticated (isAuthenticated is true), a success message is displayed with the user's email.
Component Export:
Finally, the AuthForm component is exported, making it available for use in other parts of the application.
This component is designed to handle both user registration and login. Depending on the value of the registration prop, it switches between registration and login forms. It also handles form submissions, error messages, and user authentication. The code structure follows common patterns in React functional components.
*/