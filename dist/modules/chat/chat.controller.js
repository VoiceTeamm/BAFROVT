"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHandler = chatHandler;
const chat_service_1 = require("./chat.service");
async function chatHandler(req, res, next) {
    try {
        const { message, history = [] } = req.body;
        const userId = req.user.id;
        if (!message || typeof message !== 'string') {
            res.status(400).json({ error: 'El campo "message" es requerido.' });
            return;
        }
        const reply = await (0, chat_service_1.sendChatMessage)(userId, message, history);
        res.status(200).json({ reply });
    }
    catch (error) {
        next(error);
    }
}
