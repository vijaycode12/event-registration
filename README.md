# Events — Event Registration Website

A full-stack event-booking website where visitors browse events by category, view event details, sign up / log in, and register for an event. A confirmation email is sent automatically after registration, and visitors can send queries through a contact form.

- **Frontend:** plain HTML, CSS and JavaScript
- **Backend:** Node.js, Express 5 and MongoDB (Mongoose), secured with JWT cookies, bcrypt and Arcjet

**Live website:** https://events-omega-seven.vercel.app


| Part | Repository |
| --- | --- |
| Frontend | https://github.com/vijaycode12/event-registration |
| Backend | https://github.com/vijaycode12/Event-registration-backend |

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express%205-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## Table of contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Data models](#data-models)
- [API reference](#api-reference)
- [Getting started](#getting-started)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## Features

### For visitors
- **Landing page** with a looping hero video, an About section, event category cards and a Contact form
- **Four event categories** — Private, Corporate, Marriage and Concert — each opening a filtered list of events
- **Event details page** showing the image, type, time, location and description
- **Sign up and log in** with live, field-by-field validation (email format, password length, password match)
- **Event registration** — name and email are pre-filled from your account, event details from the API
- **Confirmation email** with registration id and event details after registering
- **Contact form** (10-digit Indian mobile validation) that emails the query to the organiser
- Navbar switches *Login* for a profile icon with *Sign Out* once you are logged in

### Under the hood
- bcrypt-hashed passwords and a JWT stored in an `httpOnly`, `secure`, `SameSite=None` cookie
- Arcjet shield, bot detection (production) and token-bucket rate limiting (10 requests, refilling 5 every 10 s)
- CORS allow-list for the frontend origins
- Central error handler with friendly messages for invalid ids, duplicate keys and validation errors
- Event images served by the API from `/public/images`
- Event reminder emails 24 hours before an event via Upstash QStash *(in progress)*

## Architecture

```
┌──────────────────────────┐   fetch (credentials: include)   ┌──────────────────────────┐
│  Frontend (Vercel)       │ ───────────────────────────────► │  Backend API (Render)    │
│  HTML · CSS · JS         │ ◄─────────── JSON ────────────── │  Express 5 · Arcjet      │
│  index / events /        │        httpOnly JWT cookie       │  JWT · bcrypt            │
│  eventDetails / login /  │                                  └─────┬───────────┬────────┘
│  signup / registration   │                                        │           │
└──────────────────────────┘                                        ▼           ▼
                                                              MongoDB Atlas   SendGrid
                                                              (users, events,  (emails)
                                                               registrations)
```

### User flow

```
Home ──► Category card ("Book Now") ──► Event list ──► Event details ──► Register
                                                                         │
                         Sign up ──► Log in ◄─── (must be logged in) ────┘
                                                                         │
                                                  Confirmation email ◄───┘
```

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, vanilla JavaScript (`fetch`, `async/await`), Font Awesome 7 |
| Backend | Node.js (ES modules), Express 5 |
| Database | MongoDB with Mongoose 8 |
| Auth | JSON Web Tokens, bcryptjs, cookie-parser |
| Email | SendGrid |
| Scheduling | Upstash Workflow / QStash |
| Security | Arcjet, CORS |
| Hosting | Vercel (frontend), Render (backend), MongoDB Atlas |

## Project structure

### Frontend — `event-registration`

```
event-registration/
├── images/                          # Hero video and category images
├── index.html   style.css   script.js            # Landing page + contact form
├── events.html  events.css  events.js            # Event list by type
├── eventDetails.html  eventDetails.css  eventDetails.js
├── registration.html  registration.css  registration.js
├── signup.html  signup.css  signup.js
└── login.html   login.css   login.js
```

| Page | What it does |
| --- | --- |
| `index.html` | Hero video, About, category cards, contact form, login state in navbar |
| `events.html?type=<type>` | Lists events for `private`, `corporate`, `marriage` or `concert` |
| `eventDetails.html?id=<id>` | One event with a Register button |
| `registration.html?id=<id>` | Registration form for a logged-in user |
| `signup.html` / `login.html` | Create an account / log in |

### Backend — `Event-registration-backend`

```
Event-registration-backend/
├── app.js                          # Express app: CORS, middleware, routes, server start
├── config/                         # env.js, arcjet.js, sendGrid.js, upstash.js
├── controllers/
│   ├── auth.controller.js          # signUp, logIn, signOut, getMe
│   ├── event.controller.js         # getEvents, getEventsById
│   ├── registration.controller.js
│   ├── conformation.controller.js  # Registration confirmation email
│   ├── contact.controller.js       # Contact form email
│   └── workflow.controller.js      # Reminder scheduling
├── database/mongodb.js
├── middlewares/                    # auth (protect), arcjet, error
├── models/                         # user, event, registration, contact
├── routes/                         # auth, event, registration, contact, workflow
└── public/images/                  # Event images served at /public/images/*
```

## Data models

| Model | Fields |
| --- | --- |
| **User** | `username` (2–20 chars), `email` (unique, lowercase), `password` (bcrypt hash, min 6) |
| **Event** | `name`, `description`, `eventType`, `date`, `time`, `location`, `image`, timestamps |
| **Registration** | `user` → User, `event` → Event, `registeredAt` |
| **Contact** | `firstName`, `lastName`, `email`, `phone`, `eventType`, `query` |

## API reference

Base URL: `/api/v1`. "Cookie" means the request must carry the `token` cookie set at login.

| Method | Endpoint | Auth | Body | Description |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/sign-up` | — | `username, email, password, confirmPassword` | Create an account |
| `POST` | `/auth/log-in` | — | `email, password` | Log in; sets the `token` cookie (1 day) |
| `POST` | `/auth/sign-out` | — | — | Clears the cookie |
| `GET` | `/auth/me` | Cookie | — | Current user's `username` and `email` |
| `GET` | `/event` | — | — | All events (`?type=concert` to filter) |
| `GET` | `/event/:id` | — | — | One event |
| `POST` | `/register/:eventId` | Cookie | `phone` | Register and send confirmation email |
| `POST` | `/contact` | — | `firstName, lastName, email, phone, eventType, query` | Email a query to the organiser |
| `POST` | `/workflow/scheduleReminder` | — | `email, eventName, eventDate` | Schedule a reminder 24 h before *(in progress)* |
| `POST` | `/workflow/sendReminder` | — | `email, eventName, eventDate` | Called by QStash to send the reminder |

### Example

```bash
# Log in and save the cookie
curl -c cookies.txt -X POST http://localhost:5000/api/v1/auth/log-in \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'

# Register for an event
curl -b cookies.txt -X POST http://localhost:5000/api/v1/register/<eventId> \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'
```

Success: `{ "success": true, "message": "...", "data": { ... } }`
Error: `{ "success": false, "error": "Resource not found" }`

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB **replica set** — MongoDB Atlas works out of the box (sign-up uses a Mongoose transaction, which a standalone `mongod` does not support)
- A SendGrid API key and a verified sender email
- An Arcjet key (free tier)
- *(Optional)* an Upstash QStash token for reminders
- VS Code **Live Server** extension or `npx serve` for the frontend

### 1. Backend

```bash
git clone https://github.com/vijaycode12/Event-registration-backend.git
cd Event-registration-backend
npm install
```

The app loads `.env.<NODE_ENV>.local`, so create **`.env.development.local`**:

```env
PORT=5000
NODE_ENV=development

DB_URL=mongodb+srv://<user>:<password>@<cluster>/events

JWT_SECRET=change-me
JWT_EXPIRES_IN=1d

ARCJET_KEY=ajkey_xxxxxxxx
ARCJET_ENV=development

SENDGRID_API_KEY=SG.xxxxxxxx
EMAIL_USER=verified-sender@example.com

# Optional — reminder emails
QSTASH_URL=https://qstash.upstash.io
QSTASH_TOKEN=xxxxxxxx
BACKEND_URL=http://localhost:5000
```

```bash
npm run dev    # development (nodemon)
npm start      # production
```

`GET http://localhost:5000/` returns *"Welcome to event registration website"*.

#### Add events

There is no admin endpoint yet, so insert events into the `events` collection (Atlas UI, Compass or `mongosh`):

```json
{
  "name": "Jazz Night Live",
  "description": "An evening of live jazz with local artists.",
  "eventType": "concert",
  "date": "2026-12-20",
  "time": "7:00 PM",
  "location": "Phoenix Arena, Hyderabad",
  "image": "http://localhost:5000/public/images/jazz.jpg"
}
```

Use `private`, `corporate`, `marriage` or `concert` as `eventType` so the event shows under a category.

### 2. Frontend

```bash
git clone https://github.com/vijaycode12/event-registration.git
cd event-registration
npx serve -l 5500 .        # or: VS Code → "Open with Live Server"
```

Each HTML page sets the API address before loading its script:

```html
<script>
  window.BACKEND_URL = "https://event-registration-backend-yyr7.onrender.com";
</script>
```

For a local backend, change it to `http://localhost:5000` in `index.html`, `events.html`, `eventDetails.html`, `registration.html`, `login.html` and `signup.html`.

Open http://127.0.0.1:5500.

> **CORS:** the backend only accepts the origins listed in `app.js` — `http://127.0.0.1:5500`, `http://localhost:5500` and the Vercel URL. Serve the frontend on port 5500 or add your origin to `allowedOrigins`.

## Deployment

| Part | Platform | Settings |
| --- | --- | --- |
| Frontend | Vercel | Static site, no build command, root directory as output |
| Backend | Render | Build `npm install`, start `npm start`, all env vars with `NODE_ENV=production` |
| Database | MongoDB Atlas | Allow Render's IPs in Network Access |

With `NODE_ENV=production`, Arcjet runs in `LIVE` mode with bot detection. Add any new frontend URL to the backend's CORS allow-list.

## Roadmap

- [ ] Prevent duplicate registrations (unique index on `user + event`) and store `phone` on Registration
- [ ] Wire up reminder scheduling after registration and fix the callback path to `/api/v1/workflow/sendReminder`
- [ ] Admin endpoints to create, update and delete events
- [ ] "My registrations" page for logged-in users
- [ ] "All events" view on the event list page
- [ ] Move `BACKEND_URL` into one shared `config.js`
- [ ] Escape user and event data before inserting it into HTML and emails
- [ ] Request validation and automated tests (Jest + Supertest)
