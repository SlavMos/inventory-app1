# 📦 Inventory Management App

**Full-stack приложение** для управления инвентаризацией (складами, товарами, кастомными полями и пользователями).

## 🚀 Стек технологий

### Frontend:
- ⚛️ React (Vite)
- 🧠 Zustand — глобальное состояние
- 💨 TailwindCSS — стилизация
- 🌐 Axios — запросы к API
- 🔐 JWT — авторизация пользователя

### Backend:
- 🟢 Node.js + Express
- 🗄️ Prisma ORM + SQLite / PostgreSQL
- 🔒 JWT Auth (регистрация / логин)
- 📦 CRUD для Inventories, Items, Custom Fields, Discussions

## 🧭 Структура проекта
inventory-app/
├── server/ # backend (Express + Prisma)
│ ├── prisma/ # схема БД и миграции
│ ├── routes/ # API роуты
│ ├── controllers/ # контроллеры
│ ├── middleware/ # защита (auth)
│ └── index.js # запуск сервера
├── src/ # frontend
│ ├── pages/ # страницы (Login, Inventory, Items)
│ ├── store/ # Zustand
│ ├── components/ # UI-компоненты
│ └── App.jsx # маршруты и навигация
└── README.md

---
# Inventory App

**Live demo**
- **Backend (API)**: https://inventory-app1-f3wl.onrender.com 
- **Frontend (Web)**: https://inventory-app1.vercel.app/

**Quick checks**
- POST `/api/auth/register` → `https://inventory-app1-f3wl.onrender.com/api/auth/register`
- POST `/api/auth/login`    → `https://inventory-app1-f3wl.onrender.com/api/auth/login`

---

## О приложении
Краткое описание, как запускать локально, env, команды и т.д.

## ⚙️ Как запустить локально

1. Клонировать проект:
   ```bash
   git clone https://github.com/<твой-username>/inventory-app.git
   cd inventory-app
Установить зависимости:
npm install

Применить миграции Prisma:
npx prisma migrate dev

Запустить backend:
npm run dev:server

Запустить frontend:
npm run dev
