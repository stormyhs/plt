class Funcs{
    request = (async (endpoint: string, data: any) => {
        if(!data.username){
            data.username = localStorage.getItem("username")
        }
        data.token = localStorage.getItem("token")

        if(data.acting_as == null && localStorage.getItem("acting_as") != null){
            data.acting_as = localStorage.getItem("acting_as")
        }

        let r = await fetch(`http://localhost:4444${endpoint}`, {
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
            method: "POST",
            credentials: "include"
        })

        let p = JSON.parse(await r.text())

        try{
            if(p.type == "relog"){
                window.location.assign('/logout')
            }
        } catch{}

        return p
    })

    getURLArgs = () =>{
        if(window.location.href.split("?").length < 2){
            return {}
        }

        let URLArgs = window.location.href.split("?")[1].split("&")
        let args: any = {}
        for(let arg in URLArgs){
            let pair = URLArgs[arg].split("=")
            args[pair[0]] = pair[1]
        }

        return args
    }
}

const funcs = new Funcs()

export default funcs