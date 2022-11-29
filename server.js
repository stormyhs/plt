var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var fs = require('fs');

var hdb = require('./dbhandler');

var cors = require('cors')
var express = require('express');
var cookieParser = require('cookie-parser');
const session = require('express-session');

var app = express();
app.use(express.static('public'));
app.use(cookieParser())
app.use(express.json());
app.use(session({
    name: "Session",
    secret: "secret",
    httpOnly: false,
    saveUninitialized: false
}));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.post('/api/news', async (req, res) =>{
    console.log(`Request: ${JSON.stringify(req.body)}`)
    res.end(JSON.stringify({"news": ["The rewrite has begun.", "Google's UI has been stolen."], "status": [{severity: "info", message: "Account merge is in progress."}]}))
    // res.end(JSON.stringify({}))
})

app.post('/api/test', async (req, res) =>{
    console.log(`Request: ${JSON.stringify(req.body)}`)
    console.log(req.session)
    if(req.session.test == null){
        req.session.test = 1
    } else{
        req.session.test = req.session.test + 1
    }
    res.end(JSON.stringify({done: "done"}))
})

app.post('/api/login', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    let body = await hdb.login(req.body.username, req.body.password)
    console.log(body)
    if(body.type == "OK"){
        console.log("LOGIN OK")
        req.session.login = true
        req.session.username = req.body.username
    }
    res.end(JSON.stringify(body))
})

app.post('/api/register', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    console.log(req.session)
    let body = await hdb.register(req.body.username, req.body.password)
    if(body.type == "OK"){
        req.session.login = true
        req.session.username = req.body.username
    }
    res.end(JSON.stringify(body))
})

app.post('/api/logout', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    req.session.destroy()
    res.end(JSON.stringify({type: "OK"}))
})

app.post('/api/user', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        console.log(req.session)
        res.end(JSON.stringify({type: "relog"}))
        return
    }
    if(req.body.type == "get_user_info"){
        body = {
            type: "OK",
            username: req.body.username,
            ip: await hdb.get_value(req.body.username, "ip")
        }
        res.end(JSON.stringify(body))
    } else {
        res.end(JSON.stringify({lol: "cum"}))
    }
})

app.post('/api/storage', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        console.log(req.session)
        res.end(JSON.stringify({error: "Invalid session ID."}))
        return
    }
    if(req.body.type == "get_files"){
        res.end(JSON.stringify(await hdb.get_value(req.body.username, "files")))
    }

    else if(req.body.type == "remove_file"){
        res.end(JSON.stringify(await hdb.remove_file(req.body.username, req.body.file)))
        await hdb.add_log(req.body.username, `localhost removed file ${req.body.file}`)
    }

    else if(req.body.type == "add_file"){
        if(req.body.file.filename.endsWith(".exe")){
            res.end(JSON.stringify({type: "error", content: "Invalid file name."}))
            return
        }
        let body = await hdb.get_file(req.body.username, req.body.file.filename)
        if(body === null){
            await hdb.add_log(req.body.username, `localhost created file ${req.body.file.filename}`)
        } else{
            await hdb.add_log(req.body.username, `localhost edited file ${req.body.file.filename}`)
        }
        res.end(JSON.stringify(await hdb.add_file(req.body.username, req.body.file)))
    }

    else if(req.body.type == "get_file"){
        res.end(JSON.stringify(await hdb.get_file(req.body.username, req.body.file)))
    }

    else{
        res.end(JSON.stringify({lol: "cum"}))
    }
})

app.post('/api/ip', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        res.end(JSON.stringify({lol: "cum"}))
        return
    }
    if(req.body.type == "get_ip_data"){
        res.end(JSON.stringify(await hdb.get_ip_data(req.body.ip)))
    }
    else{
        res.end(JSON.stringify({lol: "cum"}))
    }
})

app.post('/api/terminal', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        res.end(JSON.stringify({lol: "cum"}))
        return
    }
    if(req.body.type == "command"){
        let cmd = req.body.command.split(" ")
        let body = {}
        if(cmd[0] == "help"){
            body.content = "Help page\nhelp - Display help page\nls - List all files\nconnect <ip> - Connect to an IP\n"
        } else
        if(cmd[0] == "ls"){
            let files = await hdb.get_value(req.body.currentip, "files")
            console.log(files)
            filenames = []
            for(let f in files){
                filenames.push(files[f].filename)
            }
            console.log(filenames)
            body.content = filenames.join("\n")
        } else
        if(cmd[0] == "connect"){
            body.content = `Establishing connection to ${cmd[1]}...\n`
            if(await hdb.get_value(cmd[1], "ip") === cmd[1]){
                let readme = await hdb.get_file(cmd[1], "README")
                body.currentip = cmd[1]
                body.content += "Connection established.\n"
                if(readme != null){
                    body.content += readme.content
                }
            }
        } else
        if(["disconnect", "exit"].indexOf(cmd[0]) != -1){
            if(req.body.currentip == "localhost"){
                body.content = "No operation.\n"
            } else{
                body.content = "Disconnecting...\n"
                body.currentip = "localhost"
            }
        }
        else {
            body.content = "Unknown command.\n"
        }
        res.end(JSON.stringify(body))
    }
    else{
        res.end(JSON.stringify({lol: "cum"}))
    }
})

app.post('/api/logs', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        res.end(JSON.stringify({lol: "cum"}))
        return
    }
    if(req.body.type == "getlogs"){
        res.end(JSON.stringify(await hdb.get_value(req.body.username, "logs")))
    }
    if(req.body.type == "setlogs"){
        res.end(JSON.stringify(await hdb.set_value(req.body.username, "logs", req.body.logs)))
    }
    if(req.body.type == "clearlogs"){
        res.end(JSON.stringify(await hdb.set_value(req.body.username, "logs", [])))
    }
})

var server = app.listen(4444, function () {
    var port = server.address().port
    console.log(`API running on port ${port}`)
})
