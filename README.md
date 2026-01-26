# ☕ Coffee Shop Reservation Website (Full-Stack)

A modern, full-stack coffee shop website with a **real table reservation system**, built to demonstrate **frontend, backend, database, and system design skills**.

This project is being built **step by step** with clean Git history, realistic features, and production-style architecture.

---

##  Current Status (Up to Step 11)

Customer-facing website complete  
Backend API with SQLite database  
Live table availability & reservation logic  
Double-booking prevention (server-side)  

> Admin dashboard and deployment are coming next.

---

##  Tech Stack

### Frontend
- React + Vite
- Plain CSS (custom modern UI, no Tailwind)
- React Router
- Accessible components (labels, aria, keyboard-friendly)

### Backend
- Node.js + Express
- SQLite (async via `sqlite` + `sqlite3`)
- REST API design
- Input validation
- Server-side booking validation

### Tooling
- Git (many small, clear commits)
- Nodemon (backend dev)
- Vercel-ready frontend

---

##  Project Structure
coffee-shop/
│
├── client/ # React frontend
│ ├── src/
│ │ ├── pages/ (Home, Menu, Offers, Reserve, Contact, Location)
│ │ ├── data/ (table layout definitions)
│ │ ├── styles/
│ │ └── main.jsx
│ └── package.json
│
├── server/ # Node + Express backend
│ ├── src/
│ │ ├── db/
│ │ │ ├── migrations/
│ │ │ ├── db.js
│ │ │ └── runMigrations.js
│ │ ├── routes/
│ │ │ ├── offers.js
│ │ │ ├── menu.js
│ │ │ ├── availability.js
│ │ │ └── reservations.js
│ │ └── index.js
│ └── package.json
│
└── README.md


---

##  Features Implemented (So Far)

###  Customer Website
- Home page with modern hero & sections
- Menu page (category-based layout)
- Offers page
- Location & Contact pages
- Responsive, clean UI

---

###  Table Reservation System (Core Feature)

**Movie-seat-style table booking**

Flow:
1. Select date
2. Select time slot (30-minute intervals)
3. View real-time table availability
4. Select a table (2-seat, 4-seat, 8-seat)
5. Enter name & email
6. Confirm reservation

✔ Availability updates instantly  
✔ Reserved tables become unavailable  
✔ Double booking prevented at DB level  

---

###  Backend Reservation Logic

- `GET /api/availability`
  - Returns table availability for date + time
- `POST /api/reservations`
  - Creates reservation
  - Prevents conflicts using server-side checks
- Uses SQLite with async queries
- Correct HTTP status handling:
  - `201` → success
  - `409` → table already booked
  - `500` → server error

---

##  What Runs Locally (Right Now)

### 1️ Start Backend
cd server
npm install
npm run dev

runs on http://localhost:5001

### 1️ Start Frontend
cd client
npm install
npm run dev

runs on http://localhost:5173

###  Live Local Demo Flow

1. Open the frontend application
2. Navigate to **Reserve a Table**
3. Choose a **date**
4. Choose a **time slot**
5. Pick an **available table**
6. Submit the reservation
7. Refresh availability → the table becomes locked/unavailable

This confirms **real backend + database integration**, not mock or static data.

---

###  Design & Engineering Highlights

- Clean separation between frontend and backend
- Async SQLite database with migrations
- Server-side validation (not just UI checks)
- RESTful API design
- Step-by-step Git commit history
- Built with deployment readiness in mind

---

###  What’s Coming Next

- Admin dashboard (`/admin`)
  - View all reservations
  - Cancel or edit bookings
  - Manage offers
- Admin authentication
- SEO optimization
- Frontend deployment on **Vercel**
- Backend deployment (serverless or managed service)

---

###  Purpose of This Project

This project demonstrates:

- Real-world full-stack architecture
- Database-backed business logic
- Reservation & availability systems
- Production-style backend validation
- Incremental development with clean Git practices