# Events — Event Registration Website

A full-stack website to browse events and register for them. Users can sign up, log in, pick an event, register, and get a confirmation email.

**Live website:** https://events-omega-seven.vercel.app

| Part | Repository |
| --- | --- |
| Frontend | https://github.com/vijaycode12/event-registration |
| Backend | https://github.com/vijaycode12/Event-registration-backend |

---

## Features

- Browse events by category — Private, Corporate, Marriage and Concert
- View full details of each event
- Sign up and log in securely
- Register for an event
- Get a confirmation email after registering
- Contact form to send queries to the organiser

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Email:** SendGrid
- **Hosting:** Vercel (frontend), Render (backend)

## Project Structure

```
event-registration/            # Frontend
├── index.html                 # Home page
├── events.html                # Event list
├── eventDetails.html          # Event details
├── registration.html          # Registration form
├── login.html / signup.html   # Login and sign up
└── images/

Event-registration-backend/    # Backend
├── controllers/               # Logic for each feature
├── models/                    # Database schemas
├── routes/                    # API routes
├── middlewares/               # Auth and error handling
├── config/                    # Settings
└── app.js                     # Server entry point
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/v1/auth/sign-up` | Create an account |
| POST | `/api/v1/auth/log-in` | Log in |
| POST | `/api/v1/auth/sign-out` | Log out |
| GET | `/api/v1/event` | Get all events |
| GET | `/api/v1/event/:id` | Get one event |
| POST | `/api/v1/register/:eventId` | Register for an event |
| POST | `/api/v1/contact` | Send a contact query |

## How to Run Locally

### Backend

```bash
git clone https://github.com/vijaycode12/Event-registration-backend.git
cd Event-registration-backend
npm install
```

Create a file named `.env.development.local`:

```env
PORT=5000
NODE_ENV=development
DB_URL=your_mongodb_url
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
ARCJET_KEY=your_arcjet_key
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_USER=your_email
```

Start the server:

```bash
npm run dev
```

### Frontend

```bash
git clone https://github.com/vijaycode12/event-registration.git
cd event-registration
```

Open `index.html` with **Live Server** in VS Code (port 5500).

To use your local backend, change `window.BACKEND_URL` in the HTML files to `http://localhost:5000`.

## Future Improvements

- Admin panel to add and manage events
- "My Registrations" page
- Reminder email one day before the event
