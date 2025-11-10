# Munin Alert Frontend

This is the frontend application for Munin Alert, a safety alert system.

## Setup and Running

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

1. Install dependencies:

```bash
npm install
```

### Running the development server

```bash
npm start
```

This will start the development server on [http://localhost:3000](http://localhost:3000).

### Building for production

```bash
npm run build
```

## Backend Connection

The frontend is configured to connect to the backend at `http://localhost:8081` through the proxy setting in package.json.

## Authentication

The application uses JWT authentication. Make sure the backend endpoints match the following:

- `/api/auth/register` - For user registration
- `/api/auth/login` - For user login

### Registration Requirements

When registering a new user, the following fields are required:

- First Name
- Last Name
- Username (3-20 characters)
- Email
- Password (minimum 6 characters)

## Troubleshooting

### Backend Server Connection Issues

Before using the application, make sure the backend server is running:

1. Run the `check-backend.ps1` script to verify if the backend is running
2. If the backend is not running, follow the instructions in `BACKEND_SETUP.md` to start it
3. Ensure the backend server is configured to run on port 8081 (or update the port in `src/config/apiConfig.js`)
4. Visit `/backend-test` route in the application to run direct API tests

### Registration Failures

If registration is failing:

1. Check that the backend server is running on port 8081
2. Ensure the registration endpoint `/api/auth/register` is correctly implemented
3. Make sure all required fields are properly filled in
4. Check browser console for specific error messages (press F12 to open developer tools)
5. Visit `/backend-test` route in the application to run direct API tests
6. Verify that your backend RegisterRequest DTO matches the frontend form data:
   ```java
   public class RegisterRequest {
       private String firstName;
       private String lastName;
       private String username; // Must be between 3-20 characters
       private String email;
       private String password; // Must be at least 6 characters
       private String phoneNumber; // Optional in some implementations
   }
   ```
7. Check CORS configuration in your Spring Security setup:
   ```java
   @Configuration
   public class WebSecurityConfig {
       @Bean
       public CorsConfigurationSource corsConfigurationSource() {
           CorsConfiguration configuration = new CorsConfiguration();
           configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
           configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
           configuration.setAllowedHeaders(Arrays.asList("*"));
           configuration.setAllowCredentials(true);
           UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
           source.registerCorsConfiguration("/**", configuration);
           return source;
       }
   }
   ```

### Login Failures

If login is failing:

1. Make sure you're using the correct username (not email) for login
2. Verify credentials match those used during registration
3. Check that the backend login endpoint is properly handling authentication

## Additional Help

For additional help or to report issues, please contact the project maintainers.