var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

module.exports = {
    unixTime: function(){
        return Math.round((new Date()).getTime() / 1000);
    },

    random_number: function(min=0, max=9) { 
        return Math.floor(Math.random() * (max - min) + min);
    },

    generate_ip: function() {
        const ipParts = [];
        for (let i = 0; i < 4; i++) {
          ipParts.push(this.random_number(10, 255));
        }
        return ipParts.join('.');
    },

    random_string: function(length=16) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },
      
    get_user: async function(user){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = { username: user };
        let result = await collection.findOne(query);

        if(result == null){
            query = {ip: user}
            result = await collection.findOne(query)
            if(result == null){
                return null
            }
        }

        await this.check_tasks(user)

        return result
    },

    get_value: async function(user, key){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = { username: user };
        let result = await collection.findOne(query);

        if(result == null){
            query = {ip: user}
            result = await collection.findOne(query)
            if(result == null){
                return null
            }
        }

        return result[key]
    },
   
    set_value: async function(user, key, value){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = { username: user };
        let result = await collection.findOne(query);
        
        if (result == null) {
            query = { ip: user };
            result = await collection.findOne(query);
            if (result == null) {
                return null;
            }
        }

        data = {
            $set:{
                [key]: value
            }
        }

        result = await collection.updateOne(query, data)
        return 0
    },
    
    add_log: async function(user, log){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = { username: user };
        let result = await collection.findOne(query);
        
        if (result == null) {
            query = { ip: user };
            result = await collection.findOne(query);
            if (result == null) {
                return null;
            }
        }

        data = {
            $set:{
                logs: `${log}\n${result.logs}`
            }
        }

        await collection.updateOne(query, data)
        return 0
    },
    
    add_file: async function(user, file){
        console.log("add_file:")
        console.log(file)
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = { username: user };
        let result = await collection.findOne(query);
        
        if (result == null) {
            query = { ip: user };
            result = await collection.findOne(query);
            if (result == null) {
                return null;
            }
        }

        if(["cracker.exe", "hasher.exe"].indexOf(file) != -1){
            return {filename: file, content: "This file cannot be modified."}
        }

        if(file.content == undefined){
            file.content = ""
        }

        var toPush = true
        var files = result.files
        files.forEach(element => {
            if(element.filename == file.filename){
                element.content = file.content
                element.size = file.content.length / 10
                toPush = false
            }
        });
        if(toPush){
            file.size = file.content.length / 10
            files.push(file)
        }
        var data = {
            $set:{
                files: files
            }
        }
        await collection.updateOne(query, data)
        return {type: "OK"}
    },

    get_file: async function(user, file) {
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
      
        let result = await collection.findOne({ username: user });
        if(result == null){
          result = await collection.findOne({ ip: user });
          if(result == null) {
            return null;
          }
        }
      
        if(result.files == undefined) {
          return null;
        }
      
        let body = null;
        result.files.forEach((f) => {
          if (f.filename == file) {
            body = f;
          }
        });
      
        return body;
    },

    remove_file: async function(user, file){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {username: user};
        let result = await collection.findOne(query);
        
        if(result == null){
            query = {ip: user};
            result = await collection.findOne(query);
            if(result == null){
                return null;
            }
        }

        const new_files = result.files.filter(element => element.filename != file);
        
        const data = {$set: {files: new_files}};
        await collection.updateOne(query, data);

        const extention = file.split('.')[file.split('.').length-1];
        if(extention == 'exe'){
            await this.stop_task(user, file, 'ALL');
        }

        return {type: 'OK'};
    },

    rename_file: async function(user, oldName, newName) {
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {username: user};
        let result = await collection.findOne(query);
        
        if(result == null){
            query = {ip: user};
            result = await collection.findOne(query);
            if(result == null){
                return null;
            }
        }
      
        const new_files = result.files.map(file => {
          if (file.filename === oldName) {
            return { ...file, filename: newName };
          }
          return file;
        });
      
        const data = { $set: { files: new_files } };
        await collection.updateOne(query, data);
      
        return { type: 'OK' };
    },

    upgrade_file: async function(user, file) {
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {username: user};
        let result = await collection.findOne(query);
        
        if(result == null){
            query = {ip: user};
            result = await collection.findOne(query);
            if(result == null){
                return null;
            }
        }
      
        const newFiles = result.files.map(element => {
          if (element.filename === file) {
            element.version = element.version ? element.version + 1 : 2;
            element.size = element.version * 2.3;
          }
          return element;
        });
      
        await collection.updateOne(query, { $set: { files: newFiles } });
        return { type: 'OK' };
    },

    login: async function(user, password){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {username: user};
        let result = await collection.findOne(query);
    
        if(result == null){
            let body = {
                type: "ERROR",
                message: "Username or password is incorrect."
            }
            return body
        }

        return {type: "OK", username: user}
    },

    register: async function(username, password){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {username: username};
        let result = await collection.findOne(query);
    
        if(result != null){
            return {type: "ERROR", message: "Username taken."}
        }

        const date = new Date();
        creation_date = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        let data = {
            username: username,
            password: password,
            ip: this.generate_ip(),
            ip_password: this.random_string(24),
            files: [
                {filename: "hasher.exe", size: 2, content:"", version: 1.0},
                {filename: "cracker.exe", size: 2, content: "", version: 1.0}
            ],
            logs: "",
            creation_date: creation_date
        }

        await collection.insertOne(data)
        
        return {type: "OK", username: username}
    },

    get_ip_data: async function(ip){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {ip: ip};
        let result = await collection.findOne(query);
        
        if(result == null){
            return {type: "ERROR", message: "Could not connect to IP"}
        }

        return {
            type: "OK",
            readme: await this.get_file(ip, "README.txt"),
        }
    },

    get_hardware: async function(user){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {username: user};
        let result = await collection.findOne(query);
        
        if(result == null){
            query = {ip: user};
            result = await collection.findOne(query);
            if(result == null){
                return null;
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

        return body
    },

    get_tasks: async function(user){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {username: user};
        let result = await collection.findOne(query);
        
        if(result == null){
            query = {ip: user};
            result = await collection.findOne(query);
            if(result == null){
                return null;
            }
        }

        let tasks = await this.get_value(user, "tasks")
        if(tasks == undefined){
            tasks = {}
        }
        
        return {type: "OK", tasks: tasks}
    },

    start_task: async function(user, origin, activity, ETA=null){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {username: user};
        let result = await collection.findOne(query);
        
        if(result == null){
            query = {ip: user};
            result = await collection.findOne(query);
            if(result == null){
                return null;
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
            return {type: "ERROR", message: "Task already running."}
        }

        originExists = false
        for(let file in files){
            if(files[file].filename == origin){
                originExists = true
            }
        }
        if(!originExists){
            return {type: "ERROR", message: "Task origin does not exist.", origin: origin}
        }

        if(tasks[origin] == undefined){
            tasks[origin] = {origin: origin, activities: [activity]}
        } else{
            let newActivities = tasks[origin].activities
            newActivities.push(activity)
            tasks[origin].activities = newActivities
        }
        
        tasks[origin].ETA = ETA
        if(activity == "Upgrading"){
            let file = await this.get_file(user, origin)
            tasks[origin].ETA = this.unixTime() + (file.version * (15 * 60))
        }

        await this.set_value(user, "tasks", tasks)
        return {type: "OK", tasks: tasks}
    },

    stop_task: async function(user, origin, activity){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {username: user};
        let result = await collection.findOne(query);
        
        if(result == null){
            query = {ip: user};
            result = await collection.findOne(query);
            if(result == null){
                return null;
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

    check_tasks: async function(user){
        const client = await MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db('projecth');
        const collection = db.collection('users');
        let query = {username: user};
        let result = await collection.findOne(query);
        
        if(result == null){
            query = {ip: user};
            result = await collection.findOne(query);
            if(result == null){
                return null;
            }
        }

        let tasks = await this.get_value(user, "tasks")
        if(tasks == undefined){
            tasks = {}
        }

        const unixTime = this.unixTime();
        for (let task in tasks) {
            task = tasks[task]
            if(task.ETA == null || task.ETA > unixTime){
                continue
            }

            for(let activity in task.activities){
                activity = task.activities[activity]
                if(activity == "Upgrading"){
                    await this.stop_task(user, task.origin, activity)
                    await this.upgrade_file(user, task.origin)
                }
                if(activity.startsWith("Cracking")){
                    await this.stop_task(user, task.origin, activity)
                    
                    let ip = activity.split(" ")[1]
                    await this.add_file(user, {filename: `${ip} password.txt`, content: await this.get_value(ip, "ip_password")})
                    let ip_logins = await this.get_value(user, "ip_logins")
                    if(ip_logins === undefined){
                        ip_logins = {}
                    }
                    ip_logins[ip] = {ip: ip, ip_password: await this.get_value(ip, "ip_password")}
                    await this.set_value(user, "ip_logins", ip_logins)
                }
            }
        }

    },

    set_default_files: async function(user, file){
        let hasFile = await this.get_file(user, file)
        if(hasFile == null){
            await this.add_file(user, {filename: file, content: "[EXECUTABLE FILE]", size: 2, version: 1})
            return {type: "OK"}
        } else{
            return {type: "ERROR", message: "File already exists.", debug: hasFile}
        }

    }
}
