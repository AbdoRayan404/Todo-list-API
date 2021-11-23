//TODO: GET Read Tasks API (token)
//TODO: PUT Update Task:State API (token & password)
//TODO: DELETE Delete Task API (token & Apassword)
//TODO: POST Create Token/Task API (dpeneds)
//INFO: POST is for creating tasks and tokens.
///////////////////////////////////////////////////////////////////
/*
//INFO: Token is "Profile" name so.. each token holds tasks:state
        to access this Token fully access you need to provide the token password.
        Token is unDeleteable which means when you make it there is no way to delete it.
*/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//INFO: object to store Tasks with Tokens
//Token:{Task:State}
let Tokens = {
    "First-Token": {
        "Create the first token ever!":true,
        "Create the first Task ever!":true
        },
    "Terry-404":{
        "Study NodeJS":true,
        "Stuudy Express":true,
        "Study JSON & API's":true,
        "Practice Express & API's":true
        }
}

//INFO: this object will be used to validate API's that require Task password
// Token:Password
let Passwords = {
    "First-Token": "12345678",
    "Terry-404": "Terry-404"
}

app.use(bodyParser.json())

///------- API's -------///

//Read API (GET) Access:Token
//Takes: Token
app.get('/api/tasks/:token', (req,res) =>{
    //check if token exist
    let task = Tokens.hasOwnProperty(req.params.token)
    if(!task){
        res.status(404).send('cannot find this Token.')
    }

    //send the Task object back with 200 status
    res.status(200).send(Tokens[req.params.token])
})

//Update API (PUT) Access:Token & Password
//Takes: Token, Password, Task, State
app.put('/api/tasks/', (req,res) =>{
    //check if token exist
    let token = Tokens.hasOwnProperty(req.body.token)
    if(!token){
        res.status(404).send('cannot find this Token.')
    }

    //check if password is correct
    let password = Passwords[req.body.token]
    if(password !== req.body.password){
        res.status(403).send('password is incorrect')
    }

    //check if task is inside the token
    let task = Tokens[req.body.token].hasOwnProperty(req.body.task)
    if(!task){
        res.status(404).send('the task doesnt exist')
    }

    //check if state is correct
    if(req.body.state !== true && req.body.state !== false){
        res.status(400).send('wrong state.')
    }

    //do the update
    Tokens[req.body.token][req.body.task] = req.body.state

    //check if update worked
    if(Tokens[req.body.token][req.body.task] === req.body.state){
        res.status(202).send('Task has been updated successfully.')
    }else{
        res.status(500).send('Server couldnt do the changes.')
    }
    
})

//Delete API (DELETE) Access:Token & Password
//Takes:Token, Password, Task
app.delete('/api/tasks/', (req,res) =>{
    //check if token exist
    let token = Tokens.hasOwnProperty(req.body.token)
    if(!token){
        res.status(404).send('cannot find this Token.')
    }

    //check if password is correct
    let password = Passwords[req.body.token]
    if(password !== req.body.password){
        res.status(403).send('password is incorrect')
    }

    //check if task is inside the token
    let task = Tokens[req.body.token].hasOwnProperty(req.body.task)
    if(!task){
        res.status(404).send('the task doesnt exist')
    }

    //delete the task
    delete Tokens[req.body.token][req.body.task]

    //check if task is deleted
    task = Tokens[req.body.token].hasOwnProperty(req.body.task)
    if(!task){
        res.status(200).send('task has been deleted successfully.')
    }
})

//Create API (POST) Access:Depends
//Takes: Token:- action, Token, password Task:- action, token, password, task
app.post('/api/tasks', (req,res) =>{
    let action = req.body.action

    if(action === "task"){
        //check if token exist
        let token = Tokens.hasOwnProperty(req.body.token)
        if(!token){
            res.status(404).send('cannot find this Token.')
        }

        //check if password is correct
        let password = Passwords[req.body.token]
        if(password !== req.body.password){
            res.status(403).send('password is incorrect')
        }
        
        //check if task exist
        let task = Tokens[req.body.token].hasOwnProperty(req.body.task)
        if(task){
            res.status(400).send('this task already exist.')
        }

        //add the task
        Tokens[req.body.token][req.body.task] = false

        //check if task added
        task = Tokens[req.body.token].hasOwnProperty(req.body.task)
        if(task){
            res.status(202).send('task has been added successfully')
        }
    }

    if(action === "token"){
        //check if token and password is more than 5 chars
        if(req.body.token.length < 5 && req.body.password.length < 5){
            res.status(400).send('token or password must be 5 chars or more.')
        }

        //check if token doesn't exist already
        let token = Tokens.hasOwnProperty(req.body.token)
        if(token){
            res.status(400).send('token already exist')
        }

        //add the token
        Tokens[req.body.token] = {}

        //add the password
        Passwords[req.body.token] = req.body.password

        //check if token has been added
        token = Tokens.hasOwnProperty(req.body.token)
        password = Passwords.hasOwnProperty(req.body.token)
        if(token && password){
            res.status(201).send('token has been created successfully.')
        }
    }

})

app.listen(process.env.PORT || 3000, () =>{
    console.log('app is running on port:5000')
})
