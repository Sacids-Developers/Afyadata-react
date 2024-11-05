import { openDatabase } from '../database'

//create database 
const db = openDatabase()

//1. insert data
export const insertForm = (item) => {
    let sql = "INSERT OR REPLACE INTO tb_form_definition (form_id, title, depends_on, short_title, version, code, form_type,form_actions, form_category, form_defn, description, compulsory, summary, created_at, updated_at, sort_order, synced) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let params = [item.id, item.title, item.depends_on, item.short_title, item.version, item.code, item.form_type, item.form_actions, item.form_category, JSON.stringify(item.form_defn), item.description, item.compulsory, JSON.stringify(item.summary), item.created_at, item.updated_at, item.sort_order, 1];

    try {
        db.runSync(sql, params);
        return true
    } catch (e) {
        console.log("Failed to insert form defn", e)
        return false
    }
}

export const getFormsDefnVersions = () => {
    let sql = "SELECT form_id, version FROM tb_form_definition WHERE active = 1";
    return db.getAllSync(sql)
}

export const updateFormPerms = (ids) => {
    console.log(ids)
    let sql = "UPDATE tb_form_definition SET active = CASE WHEN form_id IN ("+ids+") THEN 1 ELSE 0 END;";
    //let params = [ids]
    try {
        db.runSync(sql);
        //console.log('updated form permisions')
        return true
    } catch (e) {
        console.log("Failed to update form permissions", e)
        return false
    }
}

//2. update data
export const updateForm = (item) => {
    let sql = 'UPDATE tb_form_definition SET title = ?, short_title = ?, code = ?, form_type = ?,form_actions = ?, form_category = ?, form_defn = ?, description = ?, compulsory = ?, summary = ?, updated_at = ?, sort_order = ?, synced = ? WHERE code = ?';
    let params = [item.title, item.short_title, item.code, item.form_type, item.form_actions, item.form_category, item.form_defn, item.description, item.compulsory, JSON.stringify(item.summary), item.updated_at, item.sort_order, 1, item.code];

    try {
        db.runSync(sql, params);
    } catch (e) {
        console.log("Failed to update form defn", e)
    }
}

//3. get all data
export const getAllForms = () => {
    let sql = "SELECT * FROM tb_form_definition WHERE active = 1 ORDER BY sort_order ASC ";
    return db.getAllSync(sql)
}

//4. get farmers ID 
export const getAllFormIDs = () => {
    let sql = "SELECT form_id FROM tb_form_definition";

    return db.getAllSync(sql)
}

//5. get single data
export const getForm = (item) => {
    let sql = "SELECT * FROM tb_form_definition WHERE code = ?";
    let params = [item.code];

    return db.getFirstSync(sql, params);
}

//6. check data if exists
export const isFormExist = (item) => {
    let sql = "SELECT COUNT(id) as number_forms FROM tb_form_definition WHERE code = ?";
    let params = [item.code];

    //query
    const query = db.getFirstSync(sql, params);

    if (query.number_forms > 0) {
        return true;
    } else {
        return false;
    }
}

//7. delete data
export const deleteForm = (item) => {
    let sql = "DELETE FROM tb_form_definition WHERE code = ?";
    let params = [item.code];

    try {
        db.runSync(sql, params);
    } catch (e) {
        console.log("Failed to delete form", e)
    }
}
