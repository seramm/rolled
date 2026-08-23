# rolled

Self-hosted app to track film rolls

## Stack
- **Backend:** Django Ninja + PostgreSQL
- **Frontend:** Vite + React + Mantine

## Features implemented
- Track rolls through their lifecycle: stored -> loaded -> started -> finished -> developed -> scanned
- Log shot ISO with push/pull indicator
- Manager gear: film stocks, camera models and owned cameras

## Running with Docker

```bash
cp .env.example .env # Edit accordingly
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000 (proxied by the front in prod)

## Local developement

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

> [!NOTE]
> Remember to regenerate the typed API client after changing backend schemas
> ```bash
>  npm run generate-api # requires the back to be running
> ```

## Testing & linting
```bash
cd backend
pytest
ruff check .
```
```bash
cd frontend
npm run typecheck
npm run lint
```
