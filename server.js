var database = require('./dbhandler');

var cors = require('cors')
var express = require('express');
var cookieParser = require('cookie-parser');
const session = require('express-session');

var app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

function checkArgs(req, args){
    let missing = []
    for(let arg in args){
        if(req[args[arg]] === undefined){
            missing.push(args[arg])
        }
    }
    
    let argStatus = {}
    if(missing.length > 0){
        argStatus.type = "ERROR"
        argStatus.message = "Missing data."
        argStatus.missing = missing
    } else{
        argStatus.type = "OK"
    }

    return argStatus
}

function generateToken(length=32) {
  let token = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    token += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return token
}


function unixTime(){
    return Math.round((new Date()).getTime() / 1000);
}

async function RequestValidator(req, res, next){
    if(!req.body.username){
        return res.end(JSON.stringify({type: "relog", message: "Client did not provide a username"}))
    }
    
    let token = await database.get_value(req.body.username, "token")
    if(!token || !token.token){
        return res.end(JSON.stringify({type: "relog", message: "Not logged in"}))
    }

    if(unixTime() > token.expire){
        return res.end(JSON.stringify({type: "relog", message: "Token has expired"}))
    }

    if(req.body.token != token.token){
        return res.end(JSON.stringify({type: "relog", message: "Incorrect token"}))
    }

    next()
}

class Context{
    constructor(req){
        this.req = req
        console.log(`Request: ${JSON.stringify(req.body)}`)
    }

    async init(){
        return await this.build_context()
    }

    async build_context(){
        let ctx = {
            username: this.req.body.username,
            actor: await database.get_user(this.req.body.username)
        }
        
        if(this.req.body.acting_as !== undefined){
            // TODO: validation
            ctx.acting_as = await database.get_user(this.req.body.acting_as)
        } else{
            ctx.acting_as = await database.get_user(this.req.body.username)
        }

        ctx.log_actor = ctx.acting_as.ip
        if(ctx.actor.ip == ctx.acting_as.ip){
            ctx.log_actor = "localhost"
        }

        if(this.req.body.target !== undefined){
            ctx.target = await database.get_user(this.req.body.target)
        }

        return ctx
    }
}

app.post('/api/news', async (req, res) =>{
    console.log(`Request: ${JSON.stringify(req.body)}`)
    res.end(JSON.stringify(
        {
        "news": ["The rewrite has begun.", "Google's UI has been stolen."],
        "status": [{severity: "info", message: "Account merge is in progress."}]
        }))
})

app.post('/api/login', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    
    let argStatus = checkArgs(req.body, ['username', 'password'])
    if(argStatus.type != "OK"){
        res.end(JSON.stringify(argStatus))
    }

    let body = await database.login(req.body.username, req.body.password)

    if(body.type == "OK"){
        let authToken = {
            token: generateToken(),
            expire: unixTime() + (60 * 60 * 24 * 7)
        }
        await database.set_value(req.body.username, "token", authToken)
        body.token = authToken.token
    }

    res.end(JSON.stringify(body))
})

app.post('/api/register', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)

    let argStatus = checkArgs(req.body, ['username', 'password'])
    if(argStatus.type != "OK"){
        res.end(JSON.stringify(argStatus))
    }

    let body = await database.register(req.body.username, req.body.password)
    if(body.type == "OK"){
        let authToken = {
            token: generateToken(),
            expire: unixTime() + (60 * 60 * 24 * 7)
        }
        await database.set_value(req.body.username, "token", token)
        body.token = authToken
    }
    res.end(JSON.stringify(body))
})

app.post('/api/logout', RequestValidator, async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    await database.set_value(req.body.username, "token", {})
    res.end(JSON.stringify({type: "OK"}))
})

app.post('/v2/user', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(req.body.type == "get_user_info"){
        body = {
            type: "OK",
            ip: ctx.actor.ip,
            username: ctx.actor.username,
            creation_date: ctx.actor.creation_date
        }
        res.end(JSON.stringify(body))
    } else {
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/v2/storage', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(req.body.type == "get_files"){
        res.end(JSON.stringify(await database.get_value(ctx.acting_as.username, "files")))
    }

    else if(req.body.type == "remove_file"){
        let argStatus = checkArgs(req.body, ['file'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        res.end(JSON.stringify(await database.remove_file(ctx.acting_as.username, req.body.file)))

        await database.add_log(ctx.acting_as.username, `${ctx.log_actor} removed file ${req.body.file}`)
    }

    else if(req.body.type == "rename_file"){
        let argStatus = checkArgs(req.body, ['old', 'new'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        res.end(JSON.stringify(await database.rename_file(ctx.acting_as.username, req.body.old, req.body.new)))
        await database.add_log(ctx.acting_as.username, `${ctx.log_actor} renamed file ${req.body.old} to ${req.body.new}`)
        
    }

    else if(req.body.type == "add_file"){
        let argStatus = checkArgs(req.body, ['file'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        let file = {
            filename: req.body.file.filename,
            content: req.body.file.content,
        }
        let extention = req.body.file.filename.split(".")[req.body.file.filename.split(".").length - 1]

        if(extention == ""){
            res.end(JSON.stringify({type: "error", message: "Filename has no extention."}))
            return
        }

        if(extention == "exe" || req.body.file.filename == ""){
            res.end(JSON.stringify({type: "error", message: "Invalid file name."}))
            return
        }
        
        if(ctx.acting_as.hardware.disk + file.size > ctx.acting_as.hardware.maxDisk){
            res.end(JSON.stringify({type: "error", message: "Not enough disk space."}))
            return
        }

        let body = ctx.acting_as.files.find((el) => el.filename === req.body.file.filename);
        if(body === null){
            await database.add_log(ctx.acting_as.username, `${ctx.log_actor} created file ${req.body.file.filename}`)
        } else{
            await database.add_log(ctx.acting_as.username, `${ctx.log_actor} edited file ${req.body.file.filename}`)
        }
        res.end(JSON.stringify(await database.add_file(ctx.acting_as.username, file)))
    }

    else if(req.body.type == "get_file"){
        res.end(JSON.stringify(await database.get_file(ctx.acting_as.username, req.body.file)))
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/v2/hardware', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(req.body.type == "get_hardware"){
        res.end(JSON.stringify(await database.get_hardware(ctx.acting_as.username)))
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/v2/ip', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(req.body.type == "get_own_ip_data"){
        res.end(JSON.stringify({type: "OK", ip: ctx.acting_as.ip}))
        return
    }

    if(req.body.type == "get_ip_data"){
        let argStatus = checkArgs(req.body, ['scan_ip'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        res.end(JSON.stringify(await database.get_ip_data(req.body.scan_ip)))
    }

    if(req.body.type == "crack_password"){
        let argStatus = checkArgs(req.body, ['target'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }
        
        let cracker = ctx.acting_as.files.find((el) => el.filename === "cracker.exe");
        let hasher = ctx.target.files.find((el) => el.filename === "hasher.exe");
        
        console.log(`Actor: ${ctx.actor.username}`)
        console.log(`Acting as: ${ctx.acting_as.username}`)
        console.log(`Target: ${ctx.target.username}`)

        if(hasher == null){
            hasher = {version: 0}
        }
        if(cracker == null){
            res.end(JSON.stringify({type: "ERROR", message: "cracker.exe not found"}))
            return
        }

        if(cracker.version <= hasher.version){
            for(let task in ctx.target.tasks){
                task = ctx.target.tasks[task]
                if(task.activities.indexOf("Running") != -1){
                    res.end(JSON.stringify({type: "ERROR", message: "cracker.exe is not powerful enough"}))
                    return
                }
            }
        }

        let tasks = await database.get_tasks(ctx.acting_as.username)
        tasks = tasks['tasks']
        if("cracker.exe" in tasks) {
            const activity = tasks["cracker.exe"].activities.find((activity) => activity.startsWith("Cracking"));
            if (activity) {
                res.end(JSON.stringify({type: "ERROR", message: "cracker.exe is already cracking a hash"}));
                return;
            }
        }

        if(ctx.acting_as.hardware.cpu + (cracker.version * 2) > ctx.acting_as.maxCpu){
            res.end(JSON.stringify({type: "ERROR", message: "Not enough CPU power."}))
            return
        }
        
        // let ETA = unixTime() + 60 + (60 * (cracker.version - hasher.version))
        let ETA = unixTime() + 15
        await database.add_log(ctx.acting_as.ip, `${ctx.log_actor} started cracking ${req.body.target}`)
        res.end(JSON.stringify(await database.start_task(ctx.acting_as.username, "cracker.exe", `Cracking ${req.body.target}`, ETA)))
    }

    if(req.body.type == "login"){
        let argStatus = checkArgs(req.body, ['target', 'password'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        if(ctx.target.ip_password == req.body.password){
            res.end(JSON.stringify({type: "OK"}))
            return
        } else{
            res.end(JSON.stringify({type: "ERROR", message: "Incorrect password."}))
            return
        }
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/v2/logs', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(req.body.type == "get_logs"){
        res.end(JSON.stringify(await database.get_value(ctx.acting_as.username, "logs")))
    }
    if(req.body.type == "set_logs"){
        let argStatus = checkArgs(req.body, ['logs'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }
        await database.set_value(ctx.acting_as.username, "logs", req.body.logs)
        res.end(JSON.stringify({type: "OK", message: "Logs set."}))
    }
    if(req.body.type == "clear_logs"){
        await database.set_value(ctx.acting_as.username, "logs", [])
        res.end(JSON.stringify({type: "OK", message: "Logs cleared."}))
    }
})

app.post('/v2/defaults', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(req.body.type == "get_cracker"){
        res.end(JSON.stringify(await database.set_default_files(ctx.acting_as.username, "cracker.exe")))
        return
    }

    if(req.body.type == "get_hasher"){
        res.end(JSON.stringify(await database.set_default_files(ctx.acting_as.username, "hasher.exe")))
        return
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }

})

app.post('/v2/system', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(req.body.type == "get_tasks"){
        res.end(JSON.stringify(await database.get_tasks(ctx.acting_as.username, "tasks")))
        return
    }

    if(req.body.type == "start_task"){
        let argStatus = checkArgs(req.body, ['activity', 'origin'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        if(req.body.activity == "Running"){
            logStr = "ran task"
        } else if(req.body.activity == "Upgrading"){
            logStr = "started upgrading"
        }

        let extention = req.body.origin.split(".")[req.body.origin.split(".").length - 1]
        if(extention != "exe"){
            res.end(JSON.stringify({type: "ERROR", message: "Only EXE files can start tasks."}))
            return            
        }

        if(req.body.origin == "cracker.exe" && req.body.activity != "Upgrading"){
            res.end(JSON.stringify({type: "ERROR", message: "This file cannot be manually started."}))
            return            
        }

        if(['Upgrading', 'Running'].indexOf(req.body.activity) == -1){
            res.end(JSON.stringify({type: "ERROR", message: "Invalid task activity."}))
            return
        }

        let file = ctx.acting_as.files.find((el) => el.filename === req.body.origin);
        try{
            if(ctx.acting_as.hardware.cpu + (file.version * 2) > ctx.acting_as.hardware.maxCpu){
                res.end(JSON.stringify({type: "ERROR", message: "Not enough CPU power."}))
                return
            }
            if(req.body.activity == "Upgrading"){
                if(ctx.acting_as.hardware.disk + (file.version * 2) > ctx.acting_as.hardware.maxDisk){
                    res.end(JSON.stringify({type: "ERROR", message: "Not enough disk space."}))
                    return
                }
            }
        } catch{
            res.end(JSON.stringify({type: "ERROR", message: "Unknown error."}))
            return
        }

        await database.add_log(ctx.acting_as.username, `${ctx.log_actor} ${logStr} ${req.body.origin}`)

        res.end(JSON.stringify(await database.start_task(ctx.acting_as.username, req.body.origin, req.body.activity)))
        return
    }

    if(req.body.type == "stop_task"){
        let argStatus = checkArgs(req.body, ['activity', 'origin'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        if(req.body.activity == "Running" || req.body.activity == "ALL"){
            logStr = "stopped task"
        } else if(ctx.activity == "Upgrading"){
            logStr = "stopped upgrading"
        }

        if(['Upgrading', 'Running', 'ALL'].indexOf(req.body.activity) == -1){
            res.end(JSON.stringify({type: "ERROR", message: "Invalid task activity."}))
            return
        }

        await database.add_log(ctx.acting_as.username, `${ctx.log_actor} ${logStr} ${req.body.origin}`)

        res.end(JSON.stringify(await database.stop_task(ctx.acting_as.username, req.body.origin, req.body.activity)))
        return
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }

})

app.post('/v2/network', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()
    
    if(req.body.type == "get_ip_logins"){
        res.end(JSON.stringify({type: "OK", ip_logins: ctx.acting_as.ip_logins ? ctx.acting_as.ip_logins : []}))
        return
    }
})

var server = app.listen(4444, function () {
    var port = server.address().port
    console.log(`API running on port ${port}`)
})
