import Sheet from "../model/sheet.js";

// Get all sheets
export const getAllSheets = async (type) => {
    return await Sheet.find(type ? { type } : {});
};

// Create new sheet
export const createNewSheet = async (data) => {
    const { name, link, type } = data;
    const sheet = new Sheet({ name, link, type });
    return await sheet.save();
};

// Update sheet
export const updateSheetById = async (id, data) => {
    return await Sheet.findByIdAndUpdate(id, data, { new: true });
};

// Delete sheet
export const deleteSheetById = async (id) => {
    return await Sheet.findByIdAndDelete(id);
};
