//const sql = require('sqlite3');
//const path = require('path');

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new sqlite3.Database(path.join(__dirname, "../_data/data.db"));

const variedArr = [];

/*export default async function getDBInfo()
{
    variedArr.length=0;
    db.all("select * from fc_table", (err,data)=>{
        if(err)
        {
            console.log(err);
        } else{
            data.forEach((value, index)=>{
                variedArr.push(value.front);
                console.log("should have pushed " + value.front + " to the array");
            });
        }
    });

}*/

export default async function getDBInfo()
{
    const arr = await DBPromise();
    console.log(variedArr);
}

async function DBPromise()
{
    return new Promise((resolve, reject)=>{
        db.all("select * from fc_table", (err,data)=>{
            try
            {
                data.forEach((value, index)=>{
                variedArr.push(value.front);
                console.log("should have pushed " + value.front + " to the array")
            });
            }
            catch
            {
                reject(err);
            }

            resolve();
        });
    });
}
