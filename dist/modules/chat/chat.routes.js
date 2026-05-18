"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authGuard_1 = require("../../shared/middleware/authGuard");
const chat_controller_1 = require("./chat.controller");
const router = (0, express_1.Router)();
// POST /api/chat
// Body: { message: string, history?: [{role, content}] }
router.post('/', authGuard_1.authGuard, chat_controller_1.chatHandler);
exports.default = router;
