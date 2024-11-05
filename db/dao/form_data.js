import { openDatabase } from '../database'

//create database 
const db = openDatabase()

//1. insert data
export const insertFormData = (item) => {
    let sql = "INSERT INTO tb_form_data (uuid, form, form_data, created_at, updated_at, created_by, deleted, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    let params = [item.uuid, item.form, item.form_data, item.created_at, item.updated_at, item.created_by, item.deleted, item.synced];

    try {
        db.runSync(sql, params);
        return true
    } catch (e) {
        console.log("Failed to insert form data", e)
        return false
    }
}

//2. update data
export const updateFormData = (item) => {
    let sql = 'UPDATE tb_form_data SET form_data = ?, updated_at = ?, synced = ? WHERE uuid = ?';
    let params = [item.form_data, item.updated_at, 1, item.uuid];

    try {
        db.runSync(sql, params);
    } catch (e) {
        console.log("Failed to update form data", e)
    }
}

export const updateFormDataSync = (uuid) => {
    let sql = 'UPDATE tb_form_data SET synced = 1 WHERE uuid = ?';
    let params = [uuid];
    try {
        db.runSync(sql, params);
    } catch (e) {
        console.log("Failed to update form data", e)
    }
}

//3. get all data
export const getAllFormData = (item) => {
    let sql = "SELECT * FROM tb_form_data WHERE synced = 0";

    return db.getAllSync(sql)
}

//4. get single data
export const getFormData = (item) => {
    let sql = "SELECT * FROM tb_form_data WHERE uuid = ?";
    let params = [item.uuid];

    return db.getFirstSync(sql, params);
}

//5. check data if exists
export const isFormDataExist = (item) => {
    let sql = "SELECT COUNT(id) as number_forms FROM tb_form_data WHERE uuid = ?";
    let params = [item.uuid];

    //query
    const query = db.getFirstSync(sql, params);

    if (query.number_forms > 0) {
        return true;
    } else {
        return false;
    }
}

//6. delete data
export const deleteFormData = (uuid) => {
    //console.log('deleting form',uuid)
    let sql = "UPDATE tb_form_data SET deleted = 1, synced = 0 WHERE uuid = ?";
    let params = [uuid];

    try {
        db.runSync(sql, params);
    } catch (e) {
        console.log("Failed to delete form data", e)
    }
}

export const deleteFormData1 = (item) => {
    let sql = "DELETE FROM tb_form_data WHERE uuid = ?";
    let params = [item.uuid];

    try {
        db.runSync(sql, params);
    } catch (e) {
        console.log("Failed to delete form data", e)
    }
}
