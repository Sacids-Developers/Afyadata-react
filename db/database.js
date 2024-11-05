import * as SQLite from 'expo-sqlite'

//TODO: database versioning

//open database connection
export const openDatabase = () => {
    return SQLite.openDatabaseSync('mlf-v2.db');
}

const db = openDatabase()

//1. create table if not exists
export const createTables = () => {
    //Form Definition
    let FORM_DEFN_SQL = `CREATE TABLE IF NOT EXISTS tb_form_definition (
        id INTEGER PRIMARY KEY NOT NULL, 
        form_id INTEGER NOT NULL UNIQUE,
        depends_on INTEGER DEFAULT 0,
        title TEXT NOT NULL, 
        version TEXT DEFAULT 0, 
        short_title TEXT NOT NULL, 
        code INTEGER NOT NULL, 
        form_type TEXT NOT NULL, 
        form_actions TEXT NOT NULL, 
        form_category TEXT NOT NULL, 
        form_defn TEXT NOT NULL, 
        description TEXT NULL, 
        compulsory TEXT NOT NULL, 
        summary TEXT, 
        created_at TEXT NOT NULL, 
        updated_at TEXT NOT NULL, 
        sort_order INTEGER DEFAULT 0,
        active INTEGER DEFAULT 0,
        synced INTEGER
    );`;

    //Form Data
    let FORM_DATA_SQL = `CREATE TABLE IF NOT EXISTS tb_form_data (
        id INTEGER PRIMARY KEY NOT NULL, 
        uuid TEXT NOT NULL, 
        form TEXT NOT_NULL,  
        deleted INTEGER DEFAULT 0, 
        form_data TEXT NOT NULL, 
        created_by INTEGER NOT NULL, 
        created_at TEXT NOT NULL, 
        updated_at TEXT NOT NULL, 
        synced INTEGER
    );`;

    try {
        db.execSync(FORM_DEFN_SQL);
        db.execSync(FORM_DATA_SQL);
    } catch (e) {
        console.log("Failed to create tables", e)
    }
}

//drop tables
export const dropTables = () => {
    const FORM_DEFN_SQL = 'DROP TABLE tb_form_definition'
    const FORM_DATA_SQL = 'DROP TABLE tb_form_data'

    try {
        db.execSync(FORM_DEFN_SQL);
        db.execSync(FORM_DATA_SQL);

        console.log("tables droped")
    } catch (e) {
        console.log("Failed to drop tables", e)
    }
}