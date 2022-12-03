var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
module.exports = {
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
        var client = await MongoClient.connect(url, { useNewUrlParser: true })
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
        client.close()
        return r[key]
    },
    
    set_value: async function(user, key, value){
        var client = await MongoClient.connect(url, { useNewUrlParser: true })
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
                [key]: value
            }
        }
        r = await collection.updateOne(q, data)
        client.close()
        return 0
    },
    
    add_log: async function(user, log){
        var client = await MongoClient.connect(url, { useNewUrlParser: true })
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
        client.close()
    },
    
    add_file: async function(user, file){
        var client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {username: user}
        r = await collection.findOne(q)
        if(r == null){
            q = {ip: user}
            r = await collection.findOne(q)
            if(r == null){
                client.close()
                return null
            }
        }

        if(["cracker.exe", "hasher.exe"].indexOf(file) != -1){
            client.close()
            return {filename: file, content: "This file cannot be modified."}
        }

        var toPush = true
        var files = r.files
        files.forEach(element => {
            if(element.filename == file.filename){
                element.content = file.content
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
        client.close()
        return {type: "OK"}
    },

    get_file: async function(user, file){
        var client = await MongoClient.connect(url, { useNewUrlParser: true })
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
            client.close()
            return null
        }
        let body = null
        r.files.forEach(function(f){
            if(f.filename == file){
                body = {
                    filename: f.filename,
                    content: f.content
                }
            }
        })
        client.close()
        return body
    },

    remove_file: async function(user, file){
        var client = await MongoClient.connect(url, { useNewUrlParser: true })
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
        client.close()
        return {type: "OK"}
    },

    rename_file: async function(user, oldName, newName){
        var client = await MongoClient.connect(url, { useNewUrlParser: true })
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
        client.close()
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
            client.close()
            return body
        }
        client.close()
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
            client.close()
            return {type: "ERROR", message: "Username taken."}
        }

        const date = new Date();
        creation_date = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        let data = {username: username, password: password, ip: this.generate_ip(), files: [{filename: "hasher.exe", content:"", version: 1.0}, {filename: "cracker.exe", content: "", version: 1.0}], logs: "", creation_date: creation_date}

        try{
            await collection.insertOne(data)
        } catch(e){
            console.log(e)
            return {type: "ERROR", message: "Unknown error."}
        } finally{
            client.close()
        }
        return {type: "OK", username: username}
    },

    get_ip_data: async function(ip){
        var client = await MongoClient.connect(url, { useNewUrlParser: true })
        db = client.db("projecth");
        collection = db.collection("users");
        q = {ip: ip}
        r = await collection.findOne(q)
        
        if(r == null){
            return {type: "ERROR", message: "Could not connect to IP"}
        }
    
        return {
            type: "OK",
            readme: await this.get_file(ip, "README.txt")
        }
    },

    get_hardware: async function(user){
        var client = await MongoClient.connect(url, { useNewUrlParser: true })
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
            console.log(hardware)
        } else{
            hardware = await this.get_value(user, "hardware")
            console.log(hardware)
        }

        let files = await this.get_value(user, "files")
        let usedSpace = 0
        console.log(files)
        for(let file in files){
            if(files[file].size != undefined){
                usedSpace = usedSpace + files[file].size
            }
        }

        body = {
            type: "OK",
            disk: usedSpace,
            maxDisk: hardware.maxDisk,
            cpu: hardware.cpu,
            maxCpu: hardware.maxCpu
        }

        console.log(body)

        client.close()
        return body
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
