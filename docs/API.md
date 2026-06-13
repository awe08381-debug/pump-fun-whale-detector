# Pump.Fun Whale Detector API Documentation

## Overview

API سرویس تحلیل و شناسایی نهنگ‌ها و Pump/Dump در توکن‌های Pump.fun

## Authentication

تمام درخواست‌ها نیاز به Bearer token دارند:

```
Authorization: Bearer your_api_key
```

## Response Format

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

## Endpoints

### 1. Tokens

#### Trending Tokens
```
GET /api/tokens/trending?limit=50
```

Response:
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "address": "0x...",
      "name": "TokenName",
      "symbol": "TOKEN",
      "price": 0.0001,
      "marketCap": 1000000,
      "liquidity": 50000,
      "volume24h": 500000,
      "analysis": {
        "whaleScore": 45,
        "pumpRisk": 65,
        "dumpRisk": 30
      }
    }
  ]
}
```

#### Token Details
```
GET /api/tokens/:tokenAddress
```

### 2. Whales

#### Whale Activities
```
GET /api/whales/activities?timeframe=1h&limit=100
```

#### Whale Addresses
```
GET /api/whales/addresses?limit=50
```

#### Specific Whale
```
GET /api/whales/:whaleAddress
```

### 3. Analysis

#### Token Analysis
```
POST /api/analysis/token
Content-Type: application/json

{
  "tokenAddress": "0x..."
}
```

#### Pump/Dump Analysis
```
POST /api/analysis/pump-dump
Content-Type: application/json

{
  "tokenAddress": "0x...",
  "timeframe": "24h"
}
```

### 4. Alerts

#### Get Alerts
```
GET /api/alerts?severity=all&limit=50
```

#### Create Alert
```
POST /api/alerts
Content-Type: application/json

{
  "tokenAddress": "0x...",
  "alertType": "PUMP_DETECTED",
  "threshold": 50,
  "condition": "priceChange > 50",
  "notificationEmail": "user@example.com"
}
```

## Analysis Metrics

### Whale Score (0-100)
- نشان‌دهنده میزان فعالیت نهنگ‌ها
- بر اساس: تمرکز دارنده، تعداد تراکنش‌های بزرگ

### Pump Risk (0-100)
- ریسک افزایش سریع قیمت
- بر اساس: تغییر حجم، تغییر قیمت، نسبت نقدینگی

### Dump Risk (0-100)
- ریسک کاهش سریع قیمت
- بر اساس: تمرکز دارنده، فشار فروش، تاریخچه قیمت

## Error Handling

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Rate Limiting

- 100 درخواست در دقیقه
- 10,000 درخواست در ساعت
