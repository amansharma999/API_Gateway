# API Gateway

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setup Instructions](#setup-instructions)
3. [Endpoints](#endpoints)
4. [Tools and Technologies](#tools-and-technologies)
5. [Acknowledgements](#acknowledgements)
6. [Contributing](#contributing)

## Project Overview

The API Gateway is a microservice designed to handle routing and request forwarding to various backend services. It provides a single entry point for clients and manages authentication, rate limiting, and proxying requests to other microservices. This service is built using Node.js and Express.

## Setup Instructions

### Installation

1. Clone the project:

   ```sh
   git clone https://github.com/amansharma999/APIGateway.git
   cd APIGateway
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```env
   PORT=3005
   AUTH_SERVICE_URL=http://localhost:3001/authservice
   BOOKING_SERVICE_URL=http://localhost:3002/bookingservice
   FLIGHTS_SERVICE_URL=http://localhost:3003/flightsservice
   REMINDER_SERVICE_URL=http://localhost:3004/reminderservice
   ```

4. Start the server:

   ```sh
   npm start
   ```

## Endpoints

### AuthService Endpoints

- **Proxy to AuthService**

  - **URL:** `/authservice/*`
  - **Method:** `ALL`
  - **Description:** Proxies all requests to the AuthService.
  - **Details:** For more specific details, visit [AuthService](https://github.com/amansharma999/AuthService).

### BookingService Endpoints

- **Proxy to BookingService (Protected)**

  - **URL:** `/bookingservice/*`
  - **Method:** `ALL`
  - **Description:** Proxies all requests to the BookingService. Requires authentication.
  - **Details:** For more specific details, visit [BookingService](https://github.com/amansharma999/BookingService).

### FlightsAndSearchService Endpoints

- **Proxy to FlightsAndSearchService**

  - **URL:** `/flightsservice/*`
  - **Method:** `ALL`
  - **Description:** Proxies all requests to the FlightsAndSearchService.
  - **Details:** For more specific details, visit [FlightsAndSearchService](https://github.com/amansharma999/FlightsAndSearchService).

### ReminderService Endpoints

- **Proxy to ReminderService (Protected)**

  - **URL:** `/reminderservice/*`
  - **Method:** `ALL`
  - **Description:** Proxies all requests to the ReminderService. Requires authentication.
  - **Details:** For more specific details, visit [ReminderService](https://github.com/amansharma999/ReminderService).

## Tools and Technologies

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for Node.js.
- **http-proxy-middleware**: Middleware for creating proxy servers.
- **axios**: Promise-based HTTP client.
- **express-rate-limit**: Middleware for rate limiting.
- **morgan**: HTTP request logger middleware.

## Acknowledgements

This project was developed as part of the backend course by Sanket Sir. Special thanks to Sanket Sir for his invaluable guidance and support throughout the course.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. **Fork the repository**: Click the "Fork" button at the top right of this page to create a copy of this repository in your GitHub account.
2. **Clone your fork**: Clone the forked repository to your local machine.
   ```sh
   git clone https://github.com/your-username/APIGateway.git
   ```
3. **Create a branch**: Create a new branch for your feature or bugfix.
   ```sh
   git checkout -b feature-name
   ```
4. **Make your changes**: Make your changes to the codebase.
5. **Commit your changes**: Commit your changes with a descriptive commit message.
   ```sh
   git commit -m "Description of your changes"
   ```
6. **Push to your fork**: Push your changes to your forked repository.
   ```sh
   git push origin feature-name
   ```
7. **Create a pull request**: Open a pull request to the main repository with a description of your changes.