import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"
import {styled} from "@mui/material/styles"
import Funcs from './Funcs'

let SaveButton = styled(mui.Button)({
    color: "white",
    borderColor: "white",
    '&:active':{
        borderColor: "cyan"
    },
    '&:hover':{
        borderColor: "cyan"
    }
})

class Logs extends React.Component{
    async componentDidMount(){
        let logs = (document.getElementById("logs") as HTMLTextAreaElement);
        let payload = {type: "getlogs", username: localStorage.getItem("username")}
        let r = await Funcs.request('/api/logs', payload)
        logs.value = r        
    }

    async saveLogs(){
        let logs = (document.getElementById("logs") as HTMLTextAreaElement).value;
        let payload = {type: "setlogs", logs: logs, username: localStorage.getItem("username")}
        await Funcs.request('/api/logs', payload)
    }

    async clearLogs(){
        let logs = (document.getElementById("logs") as HTMLTextAreaElement);
        let payload = {type: "clearlogs", username: localStorage.getItem("username")}
        await Funcs.request('/api/logs', payload)
        logs.value = "*"
    }

	render(){
	return(
        <div>
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
        <mui.Paper elevation={0}>
        
        <Topbar />
        <div style={{display: "flex"}}>
        <Sidebar />

        <div style={{marginLeft: "10px", marginTop: "15px"}}>
            <SaveButton variant="outlined" onClick={this.saveLogs.bind(this)}>Save</SaveButton>
            <SaveButton style={{marginLeft: "10px"}} variant="outlined" onClick={this.clearLogs.bind(this)}>Clear</SaveButton>
            <br/>
            <mui.TextField id="logs" style={{marginTop: "20px", width: "80vw"}}
              spellCheck="false"
              fullWidth
              label="System Logs"
              multiline
              rows={25}
              defaultValue="*"
            />
        </div>

        </div>
        </mui.Paper>
        </mui.ThemeProvider>
        </div>
	)
	}
}

export default Logs;