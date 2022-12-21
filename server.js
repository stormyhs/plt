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

app.post('/api/user', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        res.end(JSON.stringify({type: "relog"}))
        return
    }

    let target = req.body.username
    if(req.body.foreignip != null){
        target = req.body.foreignip
    }

    if(req.body.type == "get_user_info"){
        body = {
            type: "OK",
            ip: await database.get_value(target, "ip"),
            username: target,
            creation_date: await database.get_value(target, "creation_date")
        }
        res.end(JSON.stringify(body))
    } else {
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/api/storage', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        console.log(req.session)
        res.end(JSON.stringify({type: "relog"}))
        return
    }

    let target = req.body.username
    if(req.body.foreignip != null){
        target = req.body.foreignip
    }
    let ctx = {
        username: req.body.username,
        ip: await database.get_value(req.body.username, "ip"),
        target: target,
    }

    if(req.body.type == "get_files"){
        res.end(JSON.stringify(await database.get_value(target, "files")))
    }

    else if(req.body.type == "remove_file"){
        let argStatus = checkArgs(req.body, ['file'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        res.end(JSON.stringify(await database.remove_file(target, req.body.file)))

        if(target == req.body.username){
            await database.add_log(target, `localhost removed file ${req.body.file}`)
        } else{
            await database.add_log(target, `${ctx.ip} removed file ${req.body.file}`)
        }
    }

    else if(req.body.type == "rename_file"){
        let argStatus = checkArgs(req.body, ['old', 'new'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        res.end(JSON.stringify(await database.rename_file(target, req.body.old, req.body.new)))
        if(target == req.body.username){
            await database.add_log(target, `localhost renamed file ${req.body.old} to ${req.body.new}`)
        } else{
            await database.add_log(target, `${ctx.ip} renamed file ${req.body.old} to ${req.body.new}`)
        }
        
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
            size: req.body.file.content.length / 10
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
        
        let body = await database.get_file(target, req.body.file.filename)
        if(body === null){
            await database.add_log(target, `localhost created file ${req.body.file.filename}`)
            let hardware = await database.get_hardware(target)
            if(hardware.disk + file.size > hardware.maxDisk){
                res.end(JSON.stringify({type: "error", message: "Not enough disk space."}))
                return
            }
        } else{
            if(target == req.body.username){
                await database.add_log(target, `localhost edited file ${req.body.file.filename}`)
            } else{
                await database.add_log(target, `${ctx.ip} edited file ${req.body.file.filename}`)
            }
            
        }
        res.end(JSON.stringify(await database.add_file(target, file)))
    }

    else if(req.body.type == "get_file"){
        res.end(JSON.stringify(await database.get_file(target, req.body.file)))
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/api/hardware', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        console.log(req.session)
        res.end(JSON.stringify({type: "relog"}))
        return
    }

    let target = req.body.username
    if(req.body.foreignip != null){
        target = req.body.foreignip
    }

    if(req.body.type == "get_hardware"){
        res.end(JSON.stringify(await database.get_hardware(target)))
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/api/ip', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        res.end(JSON.stringify({type: "relog"}))
        return
    }

    let target = req.body.username
    if(req.body.foreignip != null){
        target = req.body.foreignip
    }

    if(req.body.type == "get_ip_data"){
        let argStatus = checkArgs(req.body, ['ip'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }
        
        let ip = await database.get_value(target, "ip")
        console.log(ip)
        if([ip, "localhost", "127.0.0.1"].indexOf(req.body.ip) != -1){
            res.end(JSON.stringify(await database.get_ip_data(ip)))
            return
        }

        res.end(JSON.stringify(await database.get_ip_data(req.body.ip)))
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }
})

app.post('/api/logs', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        res.end(JSON.stringify({type: "relog"}))
        return
    }

    let target = req.body.username
    if(req.body.foreignip != null){
        target = req.body.foreignip
    }

    if(req.body.type == "get_logs"){
        res.end(JSON.stringify(await database.get_value(target, "logs")))
    }
    if(req.body.type == "set_logs"){
        let argStatus = checkArgs(req.body, ['logs'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }
        res.end(JSON.stringify(await database.set_value(target, "logs", req.body.logs)))
    }
    if(req.body.type == "clear_logs"){
        res.end(JSON.stringify(await database.set_value(target, "logs", [])))
    }
})

app.post('/api/defaults', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        res.end(JSON.stringify({type: "relog"}))
        return
    }

    let target = req.body.username
    if(req.body.foreignip != null){
        target = req.body.foreignip
    }

    if(req.body.type == "get_cracker"){
        res.end(JSON.stringify(await database.set_default_files(target, "cracker.exe")))
        return
    }

    if(req.body.type == "get_hasher"){
        res.end(JSON.stringify(await database.set_default_files(target, "hasher.exe")))
        return
    }

    else{
        res.end(JSON.stringify({type: "ERROR", message: "Unknown call type."}))
    }

})

app.post('/api/system', async function(req, res){
    console.log(`Request: ${JSON.stringify(req.body)}`)
    if(req.session.login != true || req.session.username != req.body.username){
        res.end(JSON.stringify({type: "relog"}))
        return
    }

    let target = req.body.username
    if(req.body.foreignip != null){
        target = req.body.foreignip
    }
    let ctx = {
        username: req.body.username,
        ip: await database.get_value(req.body.username, "ip"),
        target: target,
    }

    let logStr = ""

    if(req.body.type == "get_tasks"){
        res.end(JSON.stringify(await database.get_tasks(target, "tasks")))
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

        let hardware = await database.get_hardware(target)
        let file = await database.get_file(target, req.body.origin)

        try{
            if(hardware.cpu + (file.version * 2) > hardware.maxCpu){
                res.end(JSON.stringify({type: "ERROR", message: "Not enough CPU power."}))
                return
            }
            if(req.body.activity == "Upgrading"){
                if(hardware.disk + (file.version * 2) > hardware.maxDisk){
                    res.end(JSON.stringify({type: "ERROR", message: "Not enough disk space."}))
                    return
                }
            }
        } catch{
            res.end(JSON.stringify({type: "ERROR", message: "Unknown error."}))
            return
        }

        if(target == req.body.username){
            await database.add_log(target, `localhost ${logStr} ${req.body.origin}`)
        } else{
            await database.add_log(target, `${ctx.ip} ${logStr} ${req.body.origin}`)
        }

        res.end(JSON.stringify(await database.start_task(target, req.body.origin, req.body.activity)))
        return
    }

    if(req.body.type == "stop_task"){
        let argStatus = checkArgs(req.body, ['activity', 'origin'])
        if(argStatus.type != "OK"){
            res.end(JSON.stringify(argStatus))
            return
        }

        if(req.body.activity == "Running"){
            logStr = "stopped task"
        } else if(req.body.activity == "Upgrading"){
            logStr = "stopped upgrading"
        }

        if(['Upgrading', 'Running'].indexOf(req.body.activity) == -1){
            res.end(JSON.stringify({type: "ERROR", message: "Invalid task activity."}))
            return
        }

        if(target == req.body.username){
            await database.add_log(target, `localhost ${logStr} ${req.body.origin}`)
        } else{
            await database.add_log(target, `${ctx.ip} ${logStr} ${req.body.origin}`)
        }

        res.end(JSON.stringify(await database.stop_task(target, req.body.origin, req.body.activity)))
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
