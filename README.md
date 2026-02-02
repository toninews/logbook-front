# 📘 Logbook Frontend (Nuxt)

## 🎯 Project Purpose

This project is the frontend application for the Logbook system, built to consume a real-world REST API and simulate a production-ready frontend environment.

The main goal was to design a clean, scalable, and maintainable user interface that interacts with a backend API deployed on a real VPS.

This frontend focuses on:

- Real API consumption
- Clean UI/UX architecture
- Separation of concerns
- Production-aware configuration
- Deployment and real-world access

---

## 🌐 Live Demo

- Live Application:  
  http://168.138.135.249:3000/

This live demo is connected to the production backend API, running on a Linux VPS.

---

## 🖥️ About the Application

The Logbook frontend allows users to manage daily log entries in a simple and intuitive way.

Users can:

- Create new log entries
- View logs with pagination
- Search logs by title, content, or tags
- Soft-delete logs
- Interact with a real backend API in real time

This project was built with Nuxt to leverage:

- Component-based architecture
- Client-side and server-side rendering
- Clean routing system
- Optimized production builds

---

## ✨ Features

### 🧩 Core Features

- Log Creation  
  Create daily log entries with title, content, and tags

- Log Listing  
  Paginated list of logs fetched from the backend API

- Search & Filtering  
  Search logs by title, content, or tags

- Soft Delete Handling  
  Deleted logs are handled logically, preserving data integrity

---

### 🎨 UI & UX

- Clean and minimal interface
- Focused on readability and usability
- Responsive layout
- Clear feedback for loading, success, and error states
- User-friendly alerts and confirmations using SweetAlert2 (Swal)

---

### 🔌 API Integration

- Fully integrated with the Logbook REST API
- Centralized API configuration
- Error handling aligned with backend responses

---

## ⚙️ Tech Stack

- Nuxt.js
- Vue.js
- SweetAlert2 (Swal) for alerts and confirmations
- REST API integration
- Docker-ready configuration
- Deployed on an Ubuntu VPS hosted on Oracle Cloud Infrastructure (OCI)

---

## 🔐 Environment Variables

This project uses environment variables to configure the API connection.

Environment Variables
Variable Description Example
API_BASE_URL Backend API base URL http://168.138.135.249:4010

⚠️ Note:
In production, this value should match the backend API address, Docker network, or reverse proxy configuration.

🚀 Running the Project Locally
Install dependencies

```
npm install
```

Start development server

```
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

🧪 Production Build

```
npm run build
npm run start
```

Or via Docker (recommended for production environments).

## 🧠 Architectural Notes

- This frontend was designed with production awareness in mind:
- Clear separation between UI and API layers
- Centralized configuration for API endpoints
- No hardcoded environment-specific values
- Ready for containerized deployment
- Easily extendable for authentication, roles, or dashboards

## 🚀 Conclusion

This frontend completes the Logbook system by providing a clean and functional interface on top of a real production backend.

Together with the backend API, this project demonstrates:

- Full-stack development skills
- Real-world API consumption
- Production-aware configuration
- Deployment and maintenance on a real VPS
- Clean architecture and maintainable codebase

This project was built as a portfolio piece, aiming to reflect how modern frontend applications are structured, deployed, and maintained in real production environments.
