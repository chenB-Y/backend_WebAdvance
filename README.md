# Shopping List App

The Shopping List App is a web application designed to help users manage and share shopping lists. Users can create new shopping groups, join existing ones, and add products with various details to their lists. The app provides a user-friendly interface for efficient shopping list management, supported by real-time updates and robust security features.

## Features

- **User Registration and Login**: Users can register new accounts and log in securely.
- **Shopping Groups**: Create and join shopping groups to collaborate with others.
- **Product Management**: Add, edit, and delete products in your shopping list.
- **Real-time Updates**: Get instant updates on list changes using EventSource.
- **Comments**: Add and manage comments on products.
- **API Documentation**: Comprehensive API documentation with Swagger.
- **Authentication**: Secure authentication using JWT and refresh tokens.
- **Google Login**: Log in using your Google account.

## Project Structure
├── backend
│ ├── public
│ │ ├── products
│ │ └── users
│ └── src
│ ├── controller
│ ├── model
│ ├── routes
│ ├── tests
│ └── server.ts


## Backend

The backend is built with Express and TypeScript, and it serves a Vite-built frontend. It supports HTTPS for secure communication, and the server runs on port 4000. The backend uses Mongoose for MongoDB interactions and includes models for `comment`, `group`, `product`, and `user`.

### Setup

1. Install dependencies:

    ```sh
    npm install
    ```

2. Configure environment variables:

    Create a `.env` file in the backend directory and add your configuration:

    ```env
    PORT=4000
    MONGODB_URI=<your_mongodb_uri>
    JWT_SECRET=<your_jwt_secret>
    REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>
    ```

3. Start the backend server:

    ```sh
    npm run dev
    ```

### API Documentation

The backend API is documented using Swagger. Access the documentation at `http://localhost:4000/api-docs`.

### Testing

The backend includes tests for adding, retrieving, and deleting comments on products. Tests are implemented using Supertest and can be run with the following command:

```sh
npm test
```
### JWT and Refresh Tokens

The backend implements JSON Web Tokens (JWT) for secure authentication and authorization. JWTs verify user identity and grant access to protected resources. Upon login, the server issues a JWT and a refresh token. The refresh token allows users to obtain a new JWT without re-authenticating, maintaining a seamless user experience. This system mitigates security risks associated with token expiration and ensures continuous protection of user sessions.

Frontend
