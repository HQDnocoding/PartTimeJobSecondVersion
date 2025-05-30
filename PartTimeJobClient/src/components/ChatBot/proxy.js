const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Proxy server is running');
});

app.post('/proxy/openrouter', async (req, res) => {
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            req.body,
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || "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"}`,
                    "Content-Type": "application/json",
                    "X-Title": "JobHome",
                    "HTTP-Referer": "http://localhost:3000/",
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Proxy server running on http://localhost:3001');
});