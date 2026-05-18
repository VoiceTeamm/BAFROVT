"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategoriesHandler = listCategoriesHandler;
exports.getCategoryHandler = getCategoryHandler;
exports.createCategoryHandler = createCategoryHandler;
exports.updateCategoryHandler = updateCategoryHandler;
exports.deleteCategoryHandler = deleteCategoryHandler;
const categories_service_1 = require("./categories.service");
async function listCategoriesHandler(req, res, next) {
    try {
        const categories = await (0, categories_service_1.getCategoriesByUser)(req.user.id);
        res.json({ categories });
    }
    catch (error) {
        next(error);
    }
}
async function getCategoryHandler(req, res, next) {
    try {
        const category = await (0, categories_service_1.getCategoryById)(req.params.id, req.user.id);
        if (!category) {
            res.status(404).json({ error: { message: 'Categoria no encontrada', code: 'NOT_FOUND', status: 404 } });
            return;
        }
        res.json({ category });
    }
    catch (error) {
        next(error);
    }
}
async function createCategoryHandler(req, res, next) {
    try {
        const category = await (0, categories_service_1.createCategory)(req.user.id, req.body);
        res.status(201).json({ category });
    }
    catch (error) {
        next(error);
    }
}
async function updateCategoryHandler(req, res, next) {
    try {
        const category = await (0, categories_service_1.updateCategory)(req.params.id, req.user.id, req.body);
        res.json({ category });
    }
    catch (error) {
        next(error);
    }
}
async function deleteCategoryHandler(req, res, next) {
    try {
        await (0, categories_service_1.deleteCategory)(req.params.id, req.user.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
