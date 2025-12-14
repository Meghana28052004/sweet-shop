# TDD Kata: Sweet Shop Management System

Full-stack app with FastAPI backend and React frontend.

## Tech
- Backend: FastAPI, SQLAlchemy, JWT, Alembic, pytest
- Frontend: React + Vite + TypeScript, TailwindCSS, shadcn/ui, React Query, React Router

## Getting Started (Backend)
1. Create a virtual env and install deps
```
python -m venv .venv
.venv/Scripts/activate
pip install -r backend/requirements.txt
```
2. Run API
```
uvicorn app.main:app --reload --app-dir backend
```
3. Run tests
```
pytest -q backend
```

## API Summary
- POST /api/auth/register
- POST /api/auth/login
- Protected sweets CRUD, search, purchase and restock

## My AI Usage
I used an AI coding assistant (Cascade) to scaffold the project, generate boilerplate, and draft tests and endpoints. I reviewed and adjusted logic, validations, and structure. Future commits will include AI co-author trailers when AI assistance is used.
