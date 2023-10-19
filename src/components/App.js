import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './RegistrationPage';
import LoginPage from './LoginPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Redirect any other path to the login page */}
          <Route path="/*" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

/*
Import Statements:

The code starts by importing necessary modules and components from the react-router-dom library.
It imports React, which is the core library for building React applications.
Router Setup:

The code declares a functional component named App. This component serves as the root component of the application.
Router Configuration:

Inside the App component, there's a <Router> component from react-router-dom. This sets up the client-side routing for the application using the HTML5 History API.
Application Structure:

Within the <Router> component, there's a <div> element with the class name "App." This <div> represents the root element of the application.
Route Configuration:

Inside the <Routes> component, the code defines the routing configuration for the application using <Route> elements.
There are two specific routes defined:
Registration Page Route:
<Route path="/register" element={<RegistrationPage />} />
This route specifies that when the URL path matches "/register," it should render the RegistrationPage component.
Login Page Route:
<Route path="/login" element={<LoginPage />} />
This route specifies that when the URL path matches "/login," it should render the LoginPage component.
Wildcard Redirect:

The code includes a wildcard route to capture any other paths that do not match the "/register" or "/login" routes:
<Route path="/*" element={<LoginPage />} />
This route captures any other paths (e.g., "/home," "/about," etc.) and redirects them to the LoginPage component. In essence, it serves as a catch-all route for unknown paths.
Component Rendering:

The <Route> elements use the element prop to specify the component that should be rendered when a route matches. For example, <Route path="/register" element={<RegistrationPage />} /> renders the RegistrationPage component when the URL path is "/register."
Component Exports:

Finally, the App component is exported as the default export of this module. This makes the App component available for use as the root component of the application.
In summary, this code sets up client-side routing for a React application using the react-router-dom library. It defines two specific routes for the "registration" and "login" pages and a wildcard route that redirects to the login page for any other paths. The components (RegistrationPage and LoginPage) associated with these routes will be rendered based on the URL path, allowing for navigation between different parts of the application.

*/