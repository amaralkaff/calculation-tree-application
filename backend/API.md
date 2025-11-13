# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "string (min 3 chars)",
  "password": "string (min 6 chars)"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

**Errors:**
- `400` - Invalid input
- `409` - Username already exists

---

#### Login
Authenticate an existing user.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "username": "john_doe"
  }
}
```

**Errors:**
- `400` - Invalid input
- `401` - Invalid credentials

---

#### Get Current User
Get the authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:** Requires authentication

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "username": "john_doe",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `401` - Not authenticated
- `404` - User not found

---

### Calculations

#### Get All Calculations
Retrieve all calculation trees.

**Endpoint:** `GET /calculations`

**Headers:** Optional authentication

**Response:** `200 OK`
```json
{
  "calculations": [
    {
      "id": 1,
      "userId": 1,
      "username": "john_doe",
      "parentId": null,
      "operationType": null,
      "operand": 10,
      "result": 10,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "children": [
        {
          "id": 2,
          "userId": 2,
          "username": "jane_doe",
          "parentId": 1,
          "operationType": "add",
          "operand": 5,
          "result": 15,
          "createdAt": "2024-01-01T00:01:00.000Z",
          "children": []
        }
      ]
    }
  ]
}
```

---

#### Get Specific Calculation
Retrieve a specific calculation with its immediate children.

**Endpoint:** `GET /calculations/:id`

**Headers:** Optional authentication

**Response:** `200 OK`
```json
{
  "calculation": {
    "id": 1,
    "userId": 1,
    "username": "john_doe",
    "parentId": null,
    "operationType": null,
    "operand": 10,
    "result": 10,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "children": [...]
  }
}
```

**Errors:**
- `404` - Calculation not found

---

#### Create Calculation
Create a new calculation (starting number or operation).

**Endpoint:** `POST /calculations`

**Headers:** Requires authentication

**Request Body for Starting Number:**
```json
{
  "operand": 10
}
```

**Request Body for Operation:**
```json
{
  "parentId": 1,
  "operationType": "add",
  "operand": 5
}
```

**Operation Types:**
- `add` - Addition
- `subtract` - Subtraction
- `multiply` - Multiplication
- `divide` - Division

**Response:** `201 Created`
```json
{
  "message": "Calculation created successfully",
  "calculation": {
    "id": 2,
    "userId": 1,
    "username": "john_doe",
    "parentId": 1,
    "operationType": "add",
    "operand": 5,
    "result": 15,
    "createdAt": "2024-01-01T00:01:00.000Z"
  }
}
```

**Errors:**
- `400` - Invalid input or division by zero
- `401` - Not authenticated
- `404` - Parent calculation not found

---

#### Delete Calculation
Delete a calculation and all its children (owner only).

**Endpoint:** `DELETE /calculations/:id`

**Headers:** Requires authentication

**Response:** `200 OK`
```json
{
  "message": "Calculation deleted successfully"
}
```

**Errors:**
- `401` - Not authenticated
- `403` - Not the owner
- `404` - Calculation not found

---

## WebSocket Events

Connect to WebSocket server at `ws://localhost:3000`

### Client → Server

**calculation:created**
Emit when a calculation is created.
```json
{
  "id": 1,
  "userId": 1,
  "username": "john_doe",
  ...
}
```

**calculation:deleted**
Emit when a calculation is deleted.
```json
{
  "id": 1
}
```

### Server → Client

**calculation:new**
Broadcasted when a new calculation is created by another user.
```json
{
  "id": 2,
  "userId": 2,
  "username": "jane_doe",
  ...
}
```

**calculation:removed**
Broadcasted when a calculation is deleted by another user.
```json
{
  "id": 1
}
```

---

## Error Response Format

All errors follow this format:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
