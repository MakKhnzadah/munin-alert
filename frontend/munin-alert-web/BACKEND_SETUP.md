# Backend Server Startup Guide

This guide helps you start the backend server for the Munin Alert application.

## Prerequisites

- Java 17 or higher
- Maven or Gradle (as per your project configuration)

## Starting the Backend Server

### Using Maven

```bash
cd ../backend-munin-alert
mvn spring-boot:run
```

### Using Gradle

```bash
cd ../backend-munin-alert
./gradlew bootRun
```

### Verify the server is running

Once started, the backend server should be available at http://localhost:8081

You can test it with:

```bash
curl http://localhost:8081/api/public/health
```

## Common Issues

### Port already in use

If port 8081 is already in use, you can change the port in the application.properties file:

```
server.port=8082
```

Remember to also update the frontend configuration to use the new port.

### CORS Issues

If you're getting CORS errors, make sure the backend allows requests from your frontend origin.

Add this to your Spring Security configuration:

```java
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
```

### Database Issues

Make sure your database is running and properly configured in application.properties or application.yml.

## Need More Help?

If you continue to have issues, please check the logs for specific error messages.