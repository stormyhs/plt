var database = require('./dbhandler');

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

function unixTime(){
    return Math.round((new Date()).getTime() / 1000);
}

function RequestValidator(req, res, next){
    console.log(`req.session.login: ${req.session.login}`)
    console.log(`req.session.username: ${req.session.username}`)
    if(req.session.login != true || req.session.username != req.body.username){
        return res.end(JSON.stringify({type: "relog", message: "You are not logged in"}))
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
        let ctx = {...this.req.body}
        
        ctx.username = this.req.body.username
        ctx.ip = await database.get_value(this.req.body.username, "ip")

        if(this.req.body.foreignip !== undefined){
            ctx.foreignip = this.req.body.foreignip
            ctx.log_actor = `${ctx.ip}`
        } else{
            ctx.log_actor = `localhost`
        }

        ctx = await this.build_users(ctx)
        return ctx
    }

    async build_users(ctx){
        ctx.actor = await database.get_user(ctx.username)
        ctx.target = ctx.actor
        ctx.target_ip = ctx.actor.ip
        if(ctx.foreignip){
            ctx.target = await database.get_user(ctx.foreignip)
            ctx.target_ip = ctx.target.ip
        }
        return ctx
    }
}

app.post('/v2/test', RequestValidator, async function (req, res){
    let ctx = await new Context(req).init()
    let cracker = ctx.actor.files.find((el) => el.filename === "cracker.exe");
    console.log(cracker)
    res.end(JSON.stringify(ctx))
})

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
        req.session.login = true
        req.session.username = req.body.username
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

app.post('/v2/user', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(ctx.type == "get_user_info"){
        body = {
            type: "OK",
            ip: await database.get_value(ctx.username, "ip"),
            username: await database.get_value(ctx.username, "username"),
            creation_date: await database.get_value(ctx.username, "creation_date")
        }
        res.end(JSON.stringify(body))
    } else {
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/v2/storage', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(ctx.type == "get_files"){
        res.end(JSON.stringify(await database.get_value(ctx.target_ip, "files")))
    }

    else if(ctx.type == "remove_file"){
        let argStatus = checkArgs(ctx, ['file'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        res.end(JSON.stringify(await database.remove_file(ctx.target_ip, ctx.file)))

        await database.add_log(ctx.target_ip, `${ctx.log_actor} removed file ${ctx.file}`)
    }

    else if(ctx.type == "rename_file"){
        let argStatus = checkArgs(ctx, ['old', 'new'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        res.end(JSON.stringify(await database.rename_file(ctx.target_ip, ctx.old, ctx.new)))
        await database.add_log(ctx.target_ip, `${ctx.log_actor} renamed file ${ctx.old} to ${ctx.new}`)
        
    }

    else if(ctx.type == "add_file"){
        let argStatus = checkArgs(ctx, ['file'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        let file = {
            filename: ctx.file.filename,
            content: ctx.file.content,
            size: ctx.file.content.length / 10
        }
        let extention = ctx.file.filename.split(".")[ctx.file.filename.split(".").length - 1]

        if(extention == ""){
            res.end(JSON.stringify({type: "error", message: "Filename has no extention."}))
            return
        }

        if(extention == "exe" || ctx.file.filename == ""){
            res.end(JSON.stringify({type: "error", message: "Invalid file name."}))
            return
        }
        
        if(ctx.target.hardware.disk + file.size > ctx.target.hardware.maxDisk){
            res.end(JSON.stringify({type: "error", message: "Not enough disk space."}))
            return
        }

        let body = ctx.target.files.find((el) => el.filename === ctx.file.filename);
        if(body === null){
            await database.add_log(ctx.target_ip, `${ctx.log_actor} created file ${ctx.file.filename}`)
        } else{
            await database.add_log(ctx.target_ip, `${ctx.log_actor} edited file ${ctx.file.filename}`)
        }
        res.end(JSON.stringify(await database.add_file(ctx.target_ip, file)))
    }

    else if(ctx.type == "get_file"){
        res.end(JSON.stringify(await database.get_file(ctx.target_ip, ctx.file)))
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/v2/hardware', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(ctx.type == "get_hardware"){
        res.end(JSON.stringify(await database.get_hardware(ctx.target_ip)))
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/v2/ip', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(ctx.type == "get_ip_data"){
        let argStatus = checkArgs(req.body, ['scan_ip'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        res.end(JSON.stringify(await database.get_ip_data(ctx.scan_ip)))
    }

    if(req.body.type == "crack_password"){
        let argStatus = checkArgs(ctx, ['crack_ip'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }
        
        let cracker = ctx.actor.files.find((el) => el.filename === "cracker.exe");
        let hasher = ctx.target.files.find((el) => el.filename === "hasher.exe");

        if(hasher == null){
            hasher = {version: 0}
        }
        if(cracker == null){
            res.end(JSON.stringify({type: "ERROR", message: "cracker.exe not found"}))
            return
        }
        if(cracker.version <= hasher.version){
            res.end(JSON.stringify({type: "ERROR", message: "cracker.exe is not powerful enough"}))
            return
        }

        let tasks = await database.get_tasks(ctx.username)
        tasks = tasks['tasks']
        if("cracker.exe" in tasks) {
            const activity = tasks["cracker.exe"].activities.find((activity) => activity.startsWith("Cracking"));
            if (activity) {
                res.end(JSON.stringify({type: "ERROR", message: "cracker.exe is already cracking a hash"}));
                return;
            }
        }

        if(ctx.target.hardware.cpu + (cracker.version * 2) > ctx.target.hardware.maxCpu){
            res.end(JSON.stringify({type: "ERROR", message: "Not enough CPU power."}))
            return
        }
        
        let ETA = unixTime() + 60 + (60 * (cracker.version - hasher.version))
        await database.add_log(ctx.ip, `${ctx.log_actor} started cracking ${ctx.crack_ip}`)
        res.end(JSON.stringify(await database.start_task(ctx.target_ip, "cracker.exe", `Cracking ${ctx.crack_ip}`, ETA)))
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/v2/logs', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(ctx.type == "get_logs"){
        res.end(JSON.stringify(await database.get_value(ctx.target_ip, "logs")))
    }
    if(ctx.type == "set_logs"){
        let argStatus = checkArgs(ctx, ['logs'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }
        res.end(JSON.stringify(await database.set_value(ctx.target_ip, "logs", ctx.logs)))
    }
    if(ctx.type == "clear_logs"){
        res.end(JSON.stringify(await database.set_value(ctx.target_ip, "logs", [])))
    }
})

app.post('/v2/defaults', async function(req, res){
    let ctx = await new Context(req).init()

    if(ctx.type == "get_cracker"){
        res.end(JSON.stringify(await database.set_default_files(ctx.target_ip, "cracker.exe")))
        return
    }

    if(ctx.type == "get_hasher"){
        res.end(JSON.stringify(await database.set_default_files(ctx.target_ip, "hasher.exe")))
        return
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }

})

app.post('/v2/system', RequestValidator, async function(req, res){
    let ctx = await new Context(req).init()

    if(ctx.type == "get_tasks"){
        res.end(JSON.stringify(await database.get_tasks(ctx.target_ip, "tasks")))
        return
    }

    if(ctx.type == "start_task"){
        let argStatus = checkArgs(ctx, ['activity', 'origin'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        if(ctx.activity == "Running"){
            logStr = "ran task"
        } else if(ctx.activity == "Upgrading"){
            logStr = "started upgrading"
        }

        let extention = ctx.origin.split(".")[ctx.origin.split(".").length - 1]
        if(extention != "exe"){
            res.end(JSON.stringify({type: "ERROR", message: "Only EXE files can start tasks."}))
            return            
        }

        if(ctx.origin == "cracker.exe" && ctx.activity != "Upgrading"){
            res.end(JSON.stringify({type: "ERROR", message: "This file cannot be manually started."}))
            return            
        }

        if(['Upgrading', 'Running'].indexOf(ctx.activity) == -1){
            res.end(JSON.stringify({type: "ERROR", message: "Invalid task activity."}))
            return
        }

        let file = ctx.target.files.find((el) => el.filename === ctx.origin);
        try{
            if(ctx.target.hardware.cpu + (file.version * 2) > ctx.target.hardware.maxCpu){
                res.end(JSON.stringify({type: "ERROR", message: "Not enough CPU power."}))
                return
            }
            if(ctx.activity == "Upgrading"){
                if(ctx.target.hardware.disk + (file.version * 2) > ctx.target.hardware.maxDisk){
                    res.end(JSON.stringify({type: "ERROR", message: "Not enough disk space."}))
                    return
                }
            }
        } catch{
            res.end(JSON.stringify({type: "ERROR", message: "Unknown error."}))
            return
        }

        await database.add_log(ctx.target_ip, `${ctx.log_actor} ${logStr} ${ctx.origin}`)

        res.end(JSON.stringify(await database.start_task(ctx.target_ip, ctx.origin, ctx.activity)))
        return
    }

    if(ctx.type == "stop_task"){
        let argStatus = checkArgs(ctx, ['activity', 'origin'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        if(ctx.activity == "Running" || ctx.activity == "ALL"){
            logStr = "stopped task"
        } else if(ctx.activity == "Upgrading"){
            logStr = "stopped upgrading"
        }

        if(['Upgrading', 'Running', 'ALL'].indexOf(ctx.activity) == -1){
            res.end(JSON.stringify({type: "ERROR", message: "Invalid task activity."}))
            return
        }

        await database.add_log(ctx.target, `${ctx.log_actor} ${logStr} ${ctx.origin}`)

        res.end(JSON.stringify(await database.stop_task(ctx.target_ip, ctx.origin, ctx.activity)))
        return
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }

})

var server = app.listen(4444, function () {
    var port = server.address().port
    console.log(`API running on port ${port}`)
})
