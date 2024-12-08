import express from "express";
import pg from "pg";
import bodyParser from "body-parser";

const db=new pg.Client({
  user:"postgres",
  password:"rishiadhi",
  host:"localhost",
  port:5432,
  database:"todo"
})

db.connect();

async function getTasks(){
  let response=await db.query('select * from todo order by id');
  return response.rows;
}

const app=express();
const port=3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',async (req,res)=>{
  let tasks=await getTasks();
  console.log(tasks)
  if(tasks.length>0){
    console.log('yes..')
    res.render('index.ejs',{lists:tasks});
  }
  else{
    res.render('index.ejs');
  }
  
});
app.post('/add',async (req,res)=>{
  let response=await db.query('insert into todo(task) values($1)',[req.body.task])
  res.redirect('/');
})

app.post("/delete",async (req,res)=>{
    await db.query('delete from todo where id=$1',[req.body.delete]);
    res.redirect('/');
  
})

app.post('/edit',async (req,res)=>{
  let id=req.body.updatedItemId;
  let title=req.body.updatedItemTitle;

  await db.query('update todo set task=$1 where id=$2',[title,id]);
  res.redirect('/');
})

app.listen(port,()=>{
  console.log(`Server is running on port${port}`);
})