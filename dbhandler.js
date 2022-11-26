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
        if(["cracker.exe", "hasher.exe"].indexOf(file) != -1){
            client.close()
            return {filename: file, content: "This file cannot be modified."}
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
            return JSON.stringify(body)
        }
        client.close()
        return JSON.stringify({type: "OK", username: username})
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
        let data = {username: username, password: password, ip: this.generate_ip(), files: [{filename: "hasher.exe", content:"", version: 1.0}, {filename: "cracker.exe", content: "", version: 1.0}]}
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
        return {readme: await this.get_file(ip, "README")}
    }
}
