import {
    getAllSheets,
    createNewSheet,
    updateSheetById,
    deleteSheetById,
} from "../services/sheetService.js";

// GET all
export const getSheets = async (req, res, next) => {
    try {
        const { type } = req.query;
        const sheets = await getAllSheets(type);
        res.json(sheets);
    } catch (err) {
        next(err);
    }
};

// CREATE
export const createSheet = async (req, res, next) => {
    try {

        const sheet = await createNewSheet(req.body);
        res.status(201).json(sheet);
    } catch (err) {
        next(err);
    }
};

// UPDATE
export const updateSheet = async (req, res, next) => {
    try {
        const sheet = await updateSheetById(req.params.id, req.body);
        res.json(sheet);
    } catch (err) {
        next(err);
    }
};

// DELETE
export const deleteSheet = async (req, res, next) => {
    try {
        await deleteSheetById(req.params.id);
        res.json({ message: "Sheet deleted" });
    } catch (err) {
        next(err);
    }
};
