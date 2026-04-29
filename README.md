# Booking Service

A focused Node.js microservice for creating airline bookings. This service validates flight availability through the Flight Service, calculates the booking amount, stores the booking in MySQL using Sequelize, and then marks the booking as confirmed.

## Highlights

- Clean Express-based REST API
- Sequelize ORM with MySQL
- Booking creation flow with flight validation
- Automatic total price calculation
- Seat availability check before confirmation
- Environment-based service configuration

## Tech Stack

- Node.js
- Express
- Sequelize
- MySQL
- Axios
- dotenv

## Project Structure

```text
src/
  config/         # Server and Sequelize configuration
  controllers/    # Request handlers
  migrations/     # Database schema changes
  models/         # Sequelize models
  repository/     # Data access layer
  routes/         # API route definitions
  service/        # Business logic
  utils/errors/   # Custom error classes
```

## Environment Variables

This service currently reads the following environment variables:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for the Booking Service | `3002` |
| `DB_SYNC` | If set to `true`, Sequelize sync runs on startup | `false` |
| `FLIGHT_SERVICE_PATH` | Base URL of the Flight Service | `http://localhost:3000` |

Example file: [.env.example](C:/myLearnings/Wev-devlopment/X-BackEnd_Dev/Y-Projects/AirLine%20Managment/BookingService/.env.example)

## Service Setup

Follow these steps to set up and run the Booking Service locally.

### 1. Clone and open the project

```bash
git clone <your-repository-url>
cd BookingService
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a `.env` file in the project root using `.env.example` as a reference.

```env
PORT=3002
DB_SYNC=false
FLIGHT_SERVICE_PATH=http://localhost:3000
```

Variable purpose:

- `PORT` sets the port used by the Booking Service
- `DB_SYNC` controls whether Sequelize sync runs on startup
- `FLIGHT_SERVICE_PATH` points to the Flight Service base URL

### 4. Configure the database connection

This project currently reads Sequelize database credentials from:

`src/config/config.json`

Update the `development` section with your local MySQL settings.

Example:

```json
{
  "development": {
    "username": "root",
    "password": "your_mysql_password",
    "database": "Booking_Service_db",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

### 5. Create the database in MySQL

Make sure the database mentioned in `src/config/config.json` already exists.

Example:

```sql
CREATE DATABASE Booking_Service_db;
```

### 6. Run migrations

Create the required tables and columns with Sequelize migrations.

```bash
npx sequelize-cli db:migrate
```

### 7. Start the dependent Flight Service

Before testing booking creation, make sure your Flight Service is running and reachable at the URL configured in `FLIGHT_SERVICE_PATH`.

This Booking Service expects the Flight Service to provide:

- `GET /api/v1/flight/:id`
- `PATCH /api/v1/flight/:id`

### 8. Start the Booking Service

```bash
npm start
```

The service should start on:

```text
http://localhost:3002
```

### 9. Test the create booking API

You can test the endpoint using Postman, Thunder Client, or cURL.

Example:

```bash
curl --request POST http://localhost:3002/api/v1/booking \
  --header "Content-Type: application/json" \
  --data "{\"flightId\":12,\"userId\":101,\"totalSeats\":2}"
```

If the Flight Service is available and the flight has enough seats, the booking should be created successfully.

## Prerequisites

- Node.js installed
- MySQL running locally or remotely
- Flight Service running and reachable from `FLIGHT_SERVICE_PATH`

## Integration Dependency

This service depends on a Flight Service that exposes:

- `GET /api/v1/flight/:id`
- `PATCH /api/v1/flight/:id`

Expected flight payload fields used by this service:

- `id`
- `price`
- `totalSeats`

## How Booking Creation Works

When a client sends a booking request:

1. The API receives `flightId`, `userId`, and `totalSeats`.
2. The service calls the Flight Service to fetch flight details.
3. Available seats are validated.
4. `totalPrice` is calculated as `price * totalSeats`.
5. A booking row is created in the database.
6. The Flight Service is called again to reduce the remaining seat count.
7. The booking status is updated to `Booked`.

## API Base URL

```text
http://localhost:3002/api/v1
```

## Available Endpoint

### Create Booking

`POST /booking`

Create a new booking for a specific flight.

### Sample Request Body

```json
{
  "flightId": 12,
  "userId": 101,
  "totalSeats": 2
}
```

### Success Response

```json
{
  "message": "Booking created",
  "status": true,
  "data": {
    "id": 1,
    "flightId": 12,
    "userId": 101,
    "status": "Booked",
    "totalSeats": 2,
    "totalPrice": 8000,
    "createdAt": "2026-04-29T06:00:00.000Z",
    "updatedAt": "2026-04-29T06:00:00.000Z"
  },
  "error": []
}
```

### Error Response

```json
{
  "message": "Flight service request failed",
  "success": false,
  "err": "Request failed with status code 404",
  "data": {}
}
```

## Booking Model

The `Booking` model includes:

| Field | Type | Required | Default |
|---|---|---|---|
| `flightId` | Integer | Yes | - |
| `userId` | Integer | Yes | - |
| `status` | Enum | Yes | `InProcess` |
| `totalSeats` | Integer | Yes | `1` |
| `totalPrice` | Integer | Yes | `0` |

Allowed `status` values:

- `InProcess`
- `Booked`
- `Cancelled`

## Notes

- `DB_SYNC=true` can alter tables on startup. It is safer to keep this `false` when you are using migrations.
- Database credentials are not yet driven from `.env`; they are still read from `src/config/config.json`.
- The create-booking flow assumes the Flight Service returns data in the shape `response.data.data`.

## Future Improvements

- Add request validation middleware
- Add transaction handling for booking plus seat update
- Add booking cancellation flow
- Add tests for controller, service, and repository layers
- Move Sequelize DB credentials fully into environment variables

## Authoring Tip

If you are working on this with other airline-related services, keep ports and service URLs consistent across your `.env` files so local integration is easier to debug.
