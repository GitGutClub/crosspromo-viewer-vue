# Crosspromo Assets Viewer (Docker Edition)


**Crosspromo Assets Viewer** — веб-приложение для просмотра и управления рекламными ассетами (баннеры, видео и другие файлы) с динамическим отображением размеров файлов и превью изображений.  

В этой версии весь стек работает через Docker-контейнеры:

- **MongoDB**  
- **Backend (Node.js + Express)**  
- **Frontend (Vue 3 + Vuetify 3)**  

---

## ⚡ Основные возможности

- Просмотр ассетов по платформе (`Android` / `iOS`), `StoreCode` и `AppId`.
- Динамическое отображение:
  - **Превью изображений и видео**.
  - **Размер файла в МБ**.
  - **Разрешение изображений (Width x Height)**.
- Модальное окно с подробной информацией об ассете.
- Фильтрация и обновление данных через кнопку **Refresh**.
- Асинхронная подгрузка размеров файлов через бэкенд.

---

## 🛠 Стек технологий

- **Frontend:** Vue 3 + Vuetify 3  
- **Backend:** Node.js + Express  
- **База данных:** MongoDB  
- **API:** REST для ассетов и получения размера файлов  

---

## 🚀 Быстрый запуск через Docker

### 1. Клонируем репозиторий
```bash
git clone https://github.com/yourusername/crosspromo-assets-viewer.git
cd crosspromo-assets-viewer
```

> Обрати внимание: фронтенд и бэкенд автоматически подключаются к MongoDB через сеть Docker.

### 3. Запускаем контейнеры
```bash
docker-compose up --build
```

Контейнеры будут доступны:

- **Frontend:** `http://localhost:8080`  
- **Backend API:** `http://localhost:3000`  
- **MongoDB:** порт `27017`  

### 4. Перезапуск с новой сборкой
Если внесли изменения во фронтенд или бэкенд:
```bash
docker-compose down
docker-compose up --build
```

---

## 🔗 Примеры API

- **Список ассетов:**  
`GET http://localhost:3000/api/assets?storeCode=ABC&platform=Android&appId=123`  

- **Размер файла:**  
`GET http://localhost:3000/api/file-size?url=https://example.com/file.png`  

Ответ:
```json
{
  "ok": true,
  "size": 1534000
}
```

---

---

## ⚙ Настройки

- **MongoDB URL:** `MONGO_URL` (по умолчанию `mongodb://mongo:27017/crosspromo_assets`)  
- **Порт бэкенда:** `3000`  
- **Порт фронтенда:** `8080`  

---
