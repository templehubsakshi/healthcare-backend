# Healthcare Backend

REST API for managing patients, doctors and the assignment of doctors to patients.
Built with Node.js, Express, PostgreSQL (Sequelize ORM) and JWT authentication.

> Built with Node.js/Express .

## Tech stack

- Node.js + Express
- PostgreSQL with Sequelize
- JWT (jsonwebtoken) and bcryptjs for passwords
- Joi for request validation
- helmet, cors, express-rate-limit, morgan

## Getting started

1. Install Node 18+ and PostgreSQL, then create a database:

   ```bash
   psql -U postgres -c "CREATE DATABASE healthcare_db;"
   ```

2. Install dependencies and set up the environment:

   ```bash
   npm install
   cp .env.example .env
   ```

   Edit `.env` with your database password and a long random `JWT_SECRET`.

3. Start the server (tables are created automatically on first run):

   ```bash
   npm run dev      # with nodemon
   npm start        # plain node
   ```

The API runs on `http://localhost:5000` by default. `GET /health` returns a quick status check.

## Environment variables

| Variable | Description |
| --- | --- |
| PORT | Port for the server (default 5000) |
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret used to sign tokens |
| JWT_EXPIRES_IN | Token lifetime, e.g. `1d` |

The server exits at startup with a clear message if a required variable is missing.

## Project structure

```
src/
  config/        env loading and database connection
  models/        Sequelize models and associations
  validators/    Joi schemas for request bodies
  middleware/    auth, validation, error handling
  controllers/   request handling logic
  routes/        one router per resource
  utils/         ApiError, asyncHandler, pagination helpers
  app.js         express app setup
  server.js      connects to the database and starts listening
```

## API

All routes except register and login need the header `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /api/auth/register | Register with name, email, password |
| POST | /api/auth/login | Log in, returns a JWT |
| POST | /api/patients | Add a patient |
| GET | /api/patients | List your patients (optional `?page=1&limit=20`, default limit is 100) |
| GET | /api/patients/:id | Get one of your patients |
| PUT | /api/patients/:id | Update a patient |
| DELETE | /api/patients/:id | Delete a patient |
| POST | /api/doctors | Add a doctor |
| GET | /api/doctors | List all doctors (optional `?page=1&limit=20`, default limit is 100) |
| GET | /api/doctors/:id | Get a doctor |
| PUT | /api/doctors/:id | Update a doctor (creator only) |
| DELETE | /api/doctors/:id | Delete a doctor (creator only) |
| POST | /api/mappings | Assign a doctor to a patient |
| GET | /api/mappings | List mappings for your patients |
| GET | /api/mappings/:patientId | Doctors assigned to a patient |
| DELETE | /api/mappings/:id | Remove a doctor from a patient |

List endpoints return `data` plus a `meta` object: `{ page, limit, total, totalPages }`.

### Example requests

```json
POST /api/auth/register
{ "name": "Sakshi", "email": "sakshi@example.com", "password": "password123" }

POST /api/patients
{ "name": "Ravi", "age": 34, "gender": "male", "phone": "9999999999" }

POST /api/doctors
{ "name": "Dr. Mehta", "specialization": "Cardiology", "experienceYears": 10 }

POST /api/mappings
{ "patient": 1, "doctor": 1 }
```

Responses follow one shape: `{ success, message, data }`, and errors return
`{ success: false, message, details? }` with the right status code
(400 validation, 401 auth, 403 forbidden, 404 not found, 409 duplicate).

## Quick test

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Sakshi","email":"sakshi@example.com","password":"password123"}'

curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sakshi@example.com","password":"password123"}'

curl http://localhost:5000/api/patients -H "Authorization: Bearer YOUR_TOKEN"
```

## Design decisions

- **Ownership:** a patient belongs to the user who created it. Every patient query is filtered by `userId`, so other users get a 404 instead of someone else's data.
- **Doctors** are visible to all authenticated users, but only the user who added a doctor can edit or delete them.
- **Mappings:** a unique index on (patientId, doctorId) stops duplicate assignments. Listing mappings only returns those for your own patients, and deleting a patient or doctor removes its mappings (cascade).
- **Passwords** are hashed with bcrypt (12 rounds) and never returned in responses.
- **Errors** go through one central handler, so internal errors are logged but never leak details to the client.
- Tables are created with `sequelize.sync()`. For a production setup I would switch to migrations.

## Possible improvements

- Automated tests (Jest + Supertest)
- Refresh tokens and role-based access (admin / doctor)
- Migrations with sequelize-cli
- Docker setup
