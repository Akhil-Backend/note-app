# Note App Backend

A simple RESTful API backend for a note-taking application built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- CRUD operations for notes
- Secure password hashing
- JWT-based authentication
- MongoDB database integration
- CORS enabled
- Security headers with Helmet
- Error handling middleware

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Akhil-Backend/note-app.git
cd Note-App-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start running on `http://localhost:5000` (or the port specified in your .env file).

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user

### Notes
- `GET /api/notes` - Get all notes (requires authentication)
- `POST /api/notes` - Create a new note (requires authentication)
- `GET /api/notes/:id` - Get a specific note (requires authentication)
- `PUT /api/notes/:id` - Update a note (requires authentication)
- `DELETE /api/notes/:id` - Delete a note (requires authentication)

## Project Structure

```
Note-App-Backend/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── .env            # Environment variables
├── .gitignore      # Git ignore file
├── index.js        # Application entry point
└── package.json    # Project dependencies
```

## Dependencies

- express: Web framework
- mongoose: MongoDB object modeling
- bcrypt: Password hashing
- jsonwebtoken: JWT authentication
- cors: Cross-origin resource sharing
- helmet: Security headers
- dotenv: Environment variables
- nodemon: Development server (dev dependency)

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Security headers with Helmet
- CORS protection
- Environment variable configuration

## Error Handling

The application includes global error handling middleware that catches and processes errors appropriately.

## License

ISC
