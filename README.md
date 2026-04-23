# Sonic

Sonic is a full-stack music streaming web app with a Spring Boot proxy backend and a React/Vite frontend.

## Run

Backend:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

The frontend runs at `http://localhost:5173` and calls the backend at `http://localhost:8080`.

