import React, { useState } from 'react'; // Import necessary React hooks

// Mock component functions to simulate navigation (e.g., in a real app,
// you would use react-router-dom's navigate function or similar state management).
// These simply log the action in this example.
const navigateToUserPage = () => console.log("NAVIGATING to: User Demo Page");
const navigateToAdminPage = () => console.log("NAVIGATING to: Admin Demo Page");
const navigateToOperationsPage = () => console.log("NAVIGATING to: Operations Demo Page");

// The main functional component for the login screen.
function LoginScreen({ onLoginSuccess }) {
    // State hook to store the email input value.
    const [email, setEmail] = useState('');
    // State hook to store the password input value.
    const [password, setPassword] = useState('');

    // Function to handle the form submission when the "Log In" button is clicked.
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevents the default browser form submission (page reload).

        // --- Role-Based Routing Logic Starts Here ---

        // 1. Define the specific email addresses for each role.
        const userEmail = 'user@sc.com';
        const adminEmail = 'admin@sc.com';
        const operationsEmail = 'operation@sc.com'; // Note: Corrected typo 'operation@@sc.com' to 'operation@sc.com'

        // 2. Simple validation check (make sure both fields are filled).
        if (!email || !password) {
            alert('Please enter both email and password.'); // Show an error message.
            return; // Stop the function execution if validation fails.
        }

        // 3. Check the entered email against the predefined roles.
        if (email === userEmail) {
            // If the email matches the user email.
            alert('Successful login! Welcome, User.'); // Show a success message.
            navigateToUserPage(); // Call the function to navigate to the User page.
        } else if (email === adminEmail) {
            // If the email matches the admin email.
            alert('Successful login! Welcome, Admin.'); // Show a success message.
            navigateToAdminPage(); // Call the function to navigate to the Admin page.
        } else if (email === operationsEmail) {
            // If the email matches the operations email.
            alert('Successful login! Welcome, Operations.'); // Show a success message.
            navigateToOperationsPage(); // Call the function to navigate to the Operations page.
        } else {
            // If the email does not match any known role.
            alert('Login Failed: Invalid email or password.'); // Show a generic failure message.
        }
    };
    
    // Placeholder for other functions like togglePasswordVisibility
    const togglePasswordVisibility = () => {
        // Implementation for showing/hiding password input type
        console.log('Toggling password visibility...');
    };

    // The component's rendered output (JSX).
    return (
        <div className="login-page-container">
            {/* The rest of your login page UI structure goes here */}
            
            <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update the 'email' state on input change.
                        required
                    />
                </div>

                {/* Password Input */}
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update the 'password' state on input change.
                        required
                    />
                    {/* Placeholder for the eye icon/toggle */}
                    <span onClick={togglePasswordVisibility}>👁️</span>
                </div>

                {/* Login Button */}
                <button type="submit">Log In</button>
            </form>
            
        </div>
    );
}

// Export the component for use in other files.
export default LoginScreen; 



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Here we define the “valid credentials” for each role
  const credentials = {
    user: {
      email: 'user@sc.com',
      password: 'userpass123'
    },
    admin: {
      email: 'admin@sc.com',
      password: 'adminpass456'
    },
    operations: {
      email: 'operations@sc.com',
      password: 'opspass789'
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    // Check each role
    if (email === credentials.user.email) {
      if (password === credentials.user.password) {
        alert('Successful login! Welcome, User.');
        navigate('/userpage');
      } else {
        alert('Invalid password for user.');
      }
    }
    else if (email === credentials.admin.email) {
      if (password === credentials.admin.password) {
        alert('Successful login! Welcome, Admin.');
        navigate('/adminpage');
      } else {
        alert('Invalid password for admin.');
      }
    }
    else if (email === credentials.operations.email) {
      if (password === credentials.operations.password) {
        alert('Successful login! Welcome, Operations.');
        navigate('/operationspage');
      } else {
        alert('Invalid password for operations.');
      }
    }
    else {
      // Email not matched any role
      alert('Invalid email or user not recognized.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default LoginScreen;

