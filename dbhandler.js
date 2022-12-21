var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

module.exports = {
    unixTime: function(){
        return Math.round((new Date()).getTime() / 1000);
    },
    random_number: function(min=0, max=9) { 
        return Math.floor(Math.random() * (max - min) + min);
    },
    generate_ip: function(){
        let ip = ''
        for(i = 0; i<=3; i++){
            ip += this.random_number(10, 255)
            if(i != 3){
                ip += '.'
            }
        }
        return ip
    },

    get_value: async function(user, key){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                return null
            }
        }
        // client.close()
        return r[key]
    },
    
    set_value: async function(user, key, value){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                // client.close()
                return null
            }
        }
        data = {
            $set:{
                [key]: value
            }
        }
        r = await collection.updateOne(q, data)
        // client.close()
        return 0
    },
    
    add_log: async function(user, log){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                return null
            }
        }
        data = {
            $set:{
                logs: `${log}\n${r.logs}`
            }
        }
        console.log(data)
        await collection.updateOne(q, data)
        // client.close()
    },
    
    add_file: async function(user, file){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                // client.close()
                return null
            }
        }

        if(["cracker.exe", "hasher.exe"].indexOf(file) != -1){
            // client.close()
            return {filename: file, content: "This file cannot be modified."}
        }

        var toPush = true
        var files = r.files
        files.forEach(element => {
            if(element.filename == file.filename){
                element.content = file.content
                element.size = file.size
                toPush = false
            }
        });
        if(toPush){
            files.push(file)
        }
        var data = {
            $set:{
                files: files
            }
        }
        r = await collection.updateOne(q, data)
        // client.close()
        return {type: "OK"}
    },

    get_file: async function(user, file){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                return null
            }
        }
        if(r.files == undefined){
            // client.close()
            return null
        }
        let body = null
        r.files.forEach(function(f){
            if(f.filename == file){
                body = f
            }
        })
        // client.close()
        return body
    },

    remove_file: async function(user, file){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                return null
            }
        }
        let new_files = []
        r.files.forEach(function(element){
            if(element.filename != file){
                new_files.push(element)
            }
        })
        data = {
            $set:{
                files: new_files
            }
        }
        r = await collection.updateOne(q, data)

        let extention = file.split(".")[file.split(".").length-1]
        if(extention == "exe"){
            await this.stop_task(user, file, "ALL")
        }

        // client.close()
        return {type: "OK"}
    },

    rename_file: async function(user, oldName, newName){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                return null
            }
        }
        let new_files = []
        r.files.forEach(function(element){
            if(element.filename == oldName){
                element.filename = newName
            }
            new_files.push(element)
        })
        data = {
            $set:{
                files: new_files
            }
        }
        r = await collection.updateOne(q, data)
        // client.close()
        return {type: "OK"}
    },

    upgrade_file: async function(user, file){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                return null
            }
        }

        let new_files = []
        r.files.forEach(function(element){
            if(element.filename == file){
                if(element.version != undefined){
                    element.version = Number(element.version) + 1
                    element.size = Number(Number(element.version * 2.3).toFixed(0))
                } else{
                    element.version = 2
                    element.size = 5
                }
            }
            new_files.push(element)
        })

        data = {
            $set:{
                files: new_files
            }
        }

        r = await collection.updateOne(q, data)
        // client.close()
        return {type: "OK"}
    },

    login: async function(username, password){
        const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });
        const db = client.db("projecth");
        let collection = db.collection('users');
        let query = {username: username, password: password}
        let r = await collection.findOne(query)
    
        if(r == null){
            let body = {
                type: "ERROR",
                message: "Username or password is incorrect."
            }
            // client.close()
            return body
        }
        // client.close()
        return {type: "OK", username: username}
    },

    register: async function(username, password){
        const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });
        const db = client.db("projecth");
        let collection = db.collection('users');
        let query = {username: username}
        let r = await collection.findOne(query)
        console.log(r)
        if(r != null){
            // client.close()
            return {type: "ERROR", message: "Username taken."}
        }

        const date = new Date();
        creation_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        let data = {
            username: username,
            password: password,
            ip: this.generate_ip(),
            files: [
                {filename: "hasher.exe", size: 2, content:"", version: 1.0},
                {filename: "cracker.exe", size: 2, content: "", version: 1.0}
            ],
            logs: "",
            creation_date: creation_date}

        try{
            await collection.insertOne(data)
        } catch(e){
            console.log(e)
            return {type: "ERROR", message: "Unknown error."}
        } finally{
            // client.close()
        }
        return {type: "OK", username: username}
    },

    get_ip_data: async function(ip){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {ip: ip}
        r = await collection.findOne(q)
        
        if(r == null){
            return {type: "ERROR", message: "Could not connect to IP"}
        }
    
        // client.close()
        return {
            type: "OK",
            readme: await this.get_file(ip, "README.txt")
        }
    },

    get_hardware: async function(user){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                return null
            }
        }

        let hardware = {}
        if(await this.get_value(user, "hardware") == undefined){
            hardware = {disk: "20", maxDisk: "50", cpu: "30", maxCpu: "50"}
            await this.set_value(user, "hardware", hardware)
        } else{
            hardware = await this.get_value(user, "hardware")
        }

        body = {
            type: "OK",
            disk: 0,
            maxDisk: hardware.maxDisk,
            cpu: 0,
            maxCpu: hardware.maxCpu
        }

        // Disk
        let files = await this.get_value(user, "files")
        for(let file in files){
            if(files[file].size != undefined){
                body.disk = body.disk + files[file].size
            }
        }

        // CPU
        tasks = await this.get_value(user, "tasks")
        if(tasks == null){
            tasks = {}
        }
        for(let task in tasks){
            let file = await this.get_file(user, tasks[task].origin)
            for(let activity in tasks[task].activities){
                body.cpu = body.cpu + (file.version * 3)
            }
        }

        // client.close()
        return body
    },

    get_tasks: async function(user){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                return null
            }
        }

        await this.check_upgrade_tasks(user)

        let tasks = await this.get_value(user, "tasks")
        if(tasks == undefined){
            tasks = {}
        }
        
        // client.close()
        return {type: "OK", tasks: tasks}
    },

    start_task: async function(user, origin, activity){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                // client.close()
                return null
            }
        }

        let tasks = await this.get_value(user, "tasks")
        let files = await this.get_value(user, "files")
        if(tasks == undefined){
            tasks = {}
        }

        isRunning = false
        if(tasks[origin] != undefined && tasks[origin].activities.indexOf(activity) != -1){
            isRunning = true
        }
        if(isRunning){
            // client.close()
            return {type: "ERROR", message: "Task already running."}
        }

        originExists = false
        for(let file in files){
            if(files[file].filename == origin){
                originExists = true
            }
        }
        if(!originExists){
            // client.close()
            return {type: "ERROR", message: "Task origin does not exist.", origin: origin}
        }

        if(tasks[origin] == undefined){
            tasks[origin] = {origin: origin, activities: [activity]}
        } else{
            let newActivities = tasks[origin].activities
            newActivities.push(activity)
            tasks[origin].activities = newActivities
        }
        
        ETA = tasks[origin].ETA
        if(activity == "Upgrading"){
            let file = await this.get_file(user, origin)
            tasks[origin].ETA = this.unixTime() + (file.version * (15 * 60))
            // tasks[origin].ETA = this.unixTime() + 10
        }

        await this.set_value(user, "tasks", tasks)
        // client.close()
        return {type: "OK", tasks: tasks}
    },

    stop_task: async function(user, origin, activity){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                // client.close()
                return null
            }
        }

        
        let tasks = await this.get_value(user, "tasks")
        let newTasks = tasks
        
        if(activity == "ALL"){
            try{
                delete tasks[origin]
                await this.set_value(user, "tasks", tasks)
            } catch{}
            return {type: "OK", tasks: tasks}
        }
        
        if(newTasks[origin].activities.indexOf(activity) == -1){
            return {type: "ERROR", message: "Task not running."}
        }

        let newActivities = []
        for(let runningActivity in newTasks[origin].activities){
            if(newTasks[origin].activities[runningActivity] != activity){
                newActivities.push(newTasks[origin].activities[runningActivity])
            }
        }
        newTasks[origin].activities = newActivities
        if(newTasks[origin].activities.indexOf("Upgrading") == -1){
            delete newTasks[origin].ETA
        }
        if(newActivities.length > 0){
            await this.set_value(user, "tasks", newTasks)
        } else{
            delete newTasks[origin]
            await this.set_value(user, "tasks", newTasks)
        }

        await this.set_value(user, "tasks", newTasks)
        // client.close()
        return {type: "OK", newTasks: newTasks}
    },

    check_upgrade_tasks: async function(user){
        let client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                return null
            }
        }

        let tasks = await this.get_value(user, "tasks")
        if(tasks == undefined){
            tasks = {}
        }

        for(let task in tasks){
            if(tasks[task].ETA != null && tasks[task].ETA <= this.unixTime()){
                if(tasks[task].activities.indexOf("Upgrading") != -1){
                    await this.stop_task(user, tasks[task].origin, "Upgrading")
                    await this.upgrade_file(user, tasks[task].origin)
                    await this.start_task(user, {origin: tasks[task].origin, activity: "Running"})
                }
            }
        }

        // client.close()
    },

    set_default_files: async function(user, file){
        let hasFile = await this.get_file(user, file)
        if(hasFile == null){
            await this.add_file(user, {filename: file, content: "[EXECUTABLE FILE]", size: 2, version: 1})
            // client.close()
            return {type: "OK"}
        } else{
            // client.close()
            return {type: "ERROR", message: "File already exists.", debug: hasFile}
        }

    }
}
