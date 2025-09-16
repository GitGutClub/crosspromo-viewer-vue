# Crosspromo Assets Viewer (Docker Edition)

Crosspromo Assets Viewer — веб-приложение для просмотра и управления рекламными ассетами (баннеры, видео и другие файлы) с показом размеров файлов и превью изображений.  

Все компоненты запускаются через Docker-контейнеры:

- MongoDB  
- Backend (Node.js + Express)  
- Frontend (Vue 3 + Vuetify 3)  

---

## Основные функции

- Просмотр ассетов по платформе (Android / iOS), StoreCode и AppId.
- Превью изображений и видео.
- Размер файлов в мегабайтах.
- Разрешение изображений (Width x Height).
- Фильтры и кнопка обновления Refresh.
- Асинхронная загрузка размеров файлов.

---

## Технологии

- Frontend: Vue 3 + Vuetify 3  
- Backend: Node.js + Express  
- База данных: MongoDB  
- API: REST

---

## Запуск через Docker

### 1. Клонирование репозитория
```bash
git clone https://github.com/yourusername/crosspromo-assets-viewer.git
cd crosspromo-assets-viewer
```

> Важно: фронтенд и бэкенд подключаются к MongoDB через внутреннюю сеть Docker.

### 3. Запуск контейнеров
```bash
docker-compose up --build
```

Доступ к сервисам:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000`
- MongoDB: порт 27017

### 4. Пересборка контейнеров
При изменении кода:
```bash
docker-compose down
docker-compose up --build
```

---

## Примеры API

- Получение ассетов:
`GET http://localhost:3000/api/assets?storeCode=ABC&platform=Android&appId=123`

- Размер файла:
`GET http://localhost:3000/api/file-size?url=https://example.com/file.png`

Пример ответа:
```json
{
  "ok": true,
  "size": 1534000
}
```

## Настройки

- MongoDB URL: `MONGO_URL` (по умолчанию `mongodb://mongo:27017/crosspromo_assets`)  
- Порт бэкенда: 3000  
- Порт фронтенда: 8080  

---
