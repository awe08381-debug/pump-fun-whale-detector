# Environment Configuration

## Backend Setup

```bash
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pump-fun-whale-detector
DB_NAME=pump_fun_whale

# Pump.fun API
PUMP_FUN_API_URL=https://api.pump.fun
PUMP_FUN_API_KEY=your_api_key_here

# Analysis Settings
WHALE_THRESHOLD=1000000
PUMP_THRESHOLD=50
DUMP_THRESHOLD=-30

# WebSocket
WS_PORT=5001
```

## Frontend Setup

```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5001
```

## نصب و اجرا

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Tokens
- `GET /api/tokens/trending` - توکن‌های trending
- `GET /api/tokens/:address` - جزئیات توکن

### Whales
- `GET /api/whales/activities` - فعالیت‌های نهنگ‌ها
- `GET /api/whales/addresses` - آدرس‌های نهنگ‌ها
- `GET /api/whales/:address` - جزئیات نهنگ

### Analysis
- `POST /api/analysis/token` - تحلیل توکن
- `POST /api/analysis/pump-dump` - تحلیل pump/dump

### Alerts
- `GET /api/alerts` - لیست هشدارها
- `POST /api/alerts` - ایجاد هشدار
- `PATCH /api/alerts/:id` - بروزرسانی هشدار
