import mysql from 'mysql'

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'surgeny'
})
db.connect((err)=>{
    if(err){
        console.log("Error connecting to database:" + err.stack);
        return
    }
    console.log("Database Connected succesfully!")

})
export default db