import express from 'express';
import {matchRouter} from "./routes/matches.js";
import * as http from "node:http";
import {attachWebSocketServer} from "./ws/server.js";
import {securityMiddleware} from "./arcjet.js";

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express sever!');
});

app.use('/matches',matchRouter)
app.use(securityMiddleware())

const {broadcastMatchCreated} = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, () => {
    const baseUrl =
        HOST === '0.0.0.0'
            ? `http://localhost:${PORT}`
            : `http://${HOST}:${PORT}`;

    console.log(`Server is running on ${baseUrl}`);
    console.log(`WebSocket server is running on ${baseUrl.replace('http', 'ws')}/ws`);
});