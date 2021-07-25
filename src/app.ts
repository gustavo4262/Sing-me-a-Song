import express from "express";
import cors from "cors";
import connection from "./database";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/recommendations', async(req, res) => {
  
  try{

    const result = await connection.query('select * from recommendations')
    
    const suer = result.rows
    return res.send(suer)
  }
  catch(err) {
    console.log(err.message)
    return res.sendStatus(500)
  }
} );

export default app;
