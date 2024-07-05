# Dockerfile

# Backend
FROM python:3.12 AS backend

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN pip install poetry
RUN poetry install

COPY . .

# Frontend
FROM node:16 AS frontend

WORKDIR /frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Combine
FROM backend AS final

COPY --from=frontend /frontend/dist /app/frontend/dist

CMD ["poetry", "run", "uvicorn", "stock_fight.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
