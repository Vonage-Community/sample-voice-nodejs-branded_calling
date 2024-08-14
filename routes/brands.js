import express from "express";

import { getBrands, createBrand, deleteBrand } from "../storage.js";

const router = express.Router();


router.get('/brands', async (req, res, next) => {
    try {
        const brands = await getBrands()
        res.json(brands);
    } catch (e) {
        next(e);
    }
});

router.post('/brands', async (req, res, next) => {
    try {
        await createBrand(req.body);
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
});

router.delete('/brands', async (req, res, next) => {
    try {
        await deleteBrand(req.body.number)
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
});

export default router;