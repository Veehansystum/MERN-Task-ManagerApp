const express = require('express');
const app = express();
require('dotenv').config();
require('./Models/db');
const TaskRouter = require('./Routes/TaskRouter');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const cors =require('cors');

 app.get('/',(req,res)=>{
    res.send('Hello from the server ..');
})
app.use(cors({
 origin:"*",
 methods:['GET','POST','PUT','DELETE'],
 allowedHeaders:['Content-Type]
}));
app.use(bodyParser.json());
app.use('/tasks',TaskRouter)
app.listen(PORT, () => {
        console.log(`Server is running on PORT = ${PORT}`);    
});

