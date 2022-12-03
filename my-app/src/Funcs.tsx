class Funcs{
    request = (async (endpoint: string, data: any) => {
        // if(data.type != "login" && data.type != "register"){
            // data.username = localStorage.getItem("username")
        // }
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
}

const funcs = new Funcs()

export default funcs