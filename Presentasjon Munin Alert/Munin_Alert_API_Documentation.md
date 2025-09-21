# Munin Alert API Endpoints

## Authentication Endpoints

### Register a New User
- **Endpoint:** `/api/auth/register`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_here",
    "userId": "user_id_here",
    "username": "johndoe"
  }
  ```

### User Login
- **Endpoint:** `/api/auth/login`
- **Method:** POST
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "password": "securePassword123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_here",
    "userId": "user_id_here",
    "username": "johndoe"
  }
  ```

## User Management Endpoints

### Get User Profile
- **Endpoint:** `/api/users/{userId}`
- **Method:** GET
- **Authentication:** JWT Bearer Token
- **Response:**
  ```json
  {
    "id": "user_id_here",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "lastKnownLocation": {
      "latitude": 59.9139,
      "longitude": 10.7522,
      "timestamp": "2025-09-21T15:32:10Z"
    },
    "preferences": {
      "notificationsEnabled": true,
      "locationSharingEnabled": true,
      "emergencyContacts": ["contact_id_1", "contact_id_2"]
    }
  }
  ```

### Update User Location
- **Endpoint:** `/api/users/{userId}/location`
- **Method:** PUT
- **Authentication:** JWT Bearer Token
- **Request Body:**
  ```json
  {
    "latitude": 59.9139,
    "longitude": 10.7522,
    "accuracy": 10.5,
    "timestamp": "2025-09-21T15:45:32Z"
  }
  ```

## Alert Management Endpoints

### Create Alert
- **Endpoint:** `/api/alerts`
- **Method:** POST
- **Authentication:** JWT Bearer Token
- **Request Body:**
  ```json
  {
    "alertType": "MANUAL",
    "location": {
      "latitude": 59.9139,
      "longitude": 10.7522,
      "accuracy": 5.0,
      "timestamp": "2025-09-21T16:01:45Z"
    },
    "groupId": "group_id_here",
    "mediaUrls": ["url_to_photo_1", "url_to_video_1"]
  }
  ```
- **Response:**
  ```json
  {
    "id": "alert_id_here",
    "userId": "user_id_here",
    "alertType": "MANUAL",
    "location": {
      "latitude": 59.9139,
      "longitude": 10.7522,
      "accuracy": 5.0,
      "timestamp": "2025-09-21T16:01:45Z"
    },
    "status": "ACTIVE",
    "createdAt": "2025-09-21T16:01:45Z",
    "groupId": "group_id_here",
    "mediaUrls": ["url_to_photo_1", "url_to_video_1"]
  }
  ```

### Respond to Alert
- **Endpoint:** `/api/alerts/{alertId}/respond`
- **Method:** POST
- **Authentication:** JWT Bearer Token
- **Request Body:**
  ```json
  {
    "responseType": "COMING",
    "estimatedArrivalTime": "2025-09-21T16:20:00Z",
    "message": "I'm on my way, stay where you are!"
  }
  ```

### Get Active Alerts
- **Endpoint:** `/api/alerts/active`
- **Method:** GET
- **Authentication:** JWT Bearer Token
- **Response:**
  ```json
  [
    {
      "id": "alert_id_here",
      "userId": "user_id_here",
      "alertType": "MANUAL",
      "location": {
        "latitude": 59.9139,
        "longitude": 10.7522,
        "accuracy": 5.0,
        "timestamp": "2025-09-21T16:01:45Z"
      },
      "status": "ACTIVE",
      "createdAt": "2025-09-21T16:01:45Z",
      "responses": [
        {
          "userId": "responder_id_here",
          "responseType": "COMING",
          "estimatedArrivalTime": "2025-09-21T16:20:00Z",
          "message": "I'm on my way, stay where you are!"
        }
      ]
    }
  ]
  ```

## Group Management Endpoints

### Create Group
- **Endpoint:** `/api/groups`
- **Method:** POST
- **Authentication:** JWT Bearer Token
- **Request Body:**
  ```json
  {
    "name": "Family Safety Circle",
    "description": "Close family members for emergency situations",
    "isPrivate": true
  }
  ```

### Add Member to Group
- **Endpoint:** `/api/groups/{groupId}/members`
- **Method:** POST
- **Authentication:** JWT Bearer Token
- **Request Body:**
  ```json
  {
    "userId": "user_id_to_add",
    "role": "MEMBER"
  }
  ```

### Get User's Groups
- **Endpoint:** `/api/users/{userId}/groups`
- **Method:** GET
- **Authentication:** JWT Bearer Token
- **Response:**
  ```json
  [
    {
      "id": "group_id_1",
      "name": "Family Safety Circle",
      "description": "Close family members for emergency situations",
      "isPrivate": true,
      "memberCount": 5,
      "role": "ADMIN"
    },
    {
      "id": "group_id_2",
      "name": "Hiking Buddies",
      "description": "Friends for outdoor activities",
      "isPrivate": true,
      "memberCount": 8,
      "role": "MEMBER"
    }
  ]
  ```

## Safe Haven Endpoints

### Create Safe Haven
- **Endpoint:** `/api/safehavens`
- **Method:** POST
- **Authentication:** JWT Bearer Token
- **Request Body:**
  ```json
  {
    "name": "City Police Station",
    "description": "24/7 police station with public access",
    "location": {
      "latitude": 59.9111,
      "longitude": 10.7500
    },
    "isPublic": true,
    "type": "POLICE",
    "operatingHours": "24/7",
    "contactInfo": "+47 02800"
  }
  ```

### Find Nearby Safe Havens
- **Endpoint:** `/api/safehavens/nearby`
- **Method:** GET
- **Authentication:** JWT Bearer Token
- **Query Parameters:**
  - `latitude`: User's current latitude
  - `longitude`: User's current longitude
  - `radius`: Search radius in meters (default: 1000)
  - `limit`: Maximum number of results (default: 10)
- **Response:**
  ```json
  [
    {
      "id": "safehaven_id_1",
      "name": "City Police Station",
      "description": "24/7 police station with public access",
      "location": {
        "latitude": 59.9111,
        "longitude": 10.7500
      },
      "distance": 450.3,
      "type": "POLICE",
      "isPublic": true,
      "rating": 4.8,
      "operatingHours": "24/7"
    },
    {
      "id": "safehaven_id_2",
      "name": "Central Hospital",
      "description": "Emergency department entrance",
      "location": {
        "latitude": 59.9200,
        "longitude": 10.7600
      },
      "distance": 820.7,
      "type": "HOSPITAL",
      "isPublic": true,
      "rating": 4.5,
      "operatingHours": "24/7"
    }
  ]
  ```

## WebSocket Endpoints

### Connect to WebSocket
- **Endpoint:** `/ws`
- **Authentication:** JWT Bearer Token in CONNECT frame

### Subscribe to User Updates
- **Destination:** `/user/queue/updates`
- **Message Types:**
  - Alert notifications
  - Location updates from contacts
  - Group membership changes
  - Safe haven recommendations

### Send Location Update
- **Destination:** `/app/location`
- **Payload:**
  ```json
  {
    "latitude": 59.9139,
    "longitude": 10.7522,
    "accuracy": 8.5,
    "timestamp": "2025-09-21T17:10:15Z"
  }
  ```

### Send Emergency Alert
- **Destination:** `/app/alert`
- **Payload:**
  ```json
  {
    "alertType": "FALL_DETECTED",
    "location": {
      "latitude": 59.9139,
      "longitude": 10.7522,
      "accuracy": 5.0,
      "timestamp": "2025-09-21T17:15:30Z"
    },
    "groupIds": ["group_id_1", "group_id_2"]
  }
  ```

## Risk Alert Endpoints

### Report Risk Area
- **Endpoint:** `/api/risks`
- **Method:** POST
- **Authentication:** JWT Bearer Token
- **Request Body:**
  ```json
  {
    "riskType": "UNSAFE_AREA",
    "location": {
      "latitude": 59.9150,
      "longitude": 10.7540
    },
    "radius": 200,
    "description": "Poor lighting and reported thefts in this area",
    "expiresAt": "2025-09-25T23:59:59Z"
  }
  ```

### Get Nearby Risks
- **Endpoint:** `/api/risks/nearby`
- **Method:** GET
- **Authentication:** JWT Bearer Token
- **Query Parameters:**
  - `latitude`: User's current latitude
  - `longitude`: User's current longitude
  - `radius`: Search radius in meters (default: 2000)
- **Response:**
  ```json
  [
    {
      "id": "risk_id_1",
      "riskType": "UNSAFE_AREA",
      "location": {
        "latitude": 59.9150,
        "longitude": 10.7540
      },
      "radius": 200,
      "description": "Poor lighting and reported thefts in this area",
      "reportedBy": "user_id_here",
      "reportedAt": "2025-09-21T14:30:00Z",
      "expiresAt": "2025-09-25T23:59:59Z",
      "confirmedCount": 5
    }
  ]
  ```