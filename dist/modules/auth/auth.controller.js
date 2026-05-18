"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const authService = new auth_service_1.AuthService();
const register = async (req, res) => {
    try {
        const data = req.body;
        const result = await authService.register(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const data = req.body;
        const result = await authService.login(data);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(401).json({ error: true, message: error.message });
    }
};
exports.login = login;
