import mysql from 'mysql'
import dotenv from 'dotenv'

dotenv.config()

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
db.connect((err)=>{
    if(err){
        console.log("Error connecting to database:" + err.stack);
        return
    }
    console.log("Database Connected succesfully!")

})
export default db