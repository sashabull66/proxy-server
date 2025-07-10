const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешенные домены (ваш фронтенд + локальная разработка)
const allowedOrigins = [
    'https://smart-id-dev.netlify.app',
    'http://localhost',
    /^http:\/\/localhost:\d+$/ // Все локальные порты
];

// Настройка CORS
app.use(cors({
    origin: allowedOrigins,
    methods: ['POST', 'OPTIONS'], // Разрешаем только нужные методы
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json()); // Для обработки JSON-тела запроса

const ALFA_API_URL = 'https://test-alfa-mobile.alfabank.ru/mobile/welcome/api/v1/qr-reader/activation';
const ALFA_HEADERS = {
    'Authorization': 'Basic ZXh0ZXJuYWw6NWJ4QjJOMjRQNTg3MlA5ZDg2N3g=',
    'Content-Type': 'application/json'
};

// Прокси-эндпоинт для POST-запросов
app.post('/api/alfa-qr', async (req, res) => {
    try {
        const response = await axios.post(
            ALFA_API_URL,
            req.body, // Передаём тело запроса дальше
            {
                headers: ALFA_HEADERS
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({
            error: 'Proxy error',
            details: error.message
        });
    }
});

// Старт сервера
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});