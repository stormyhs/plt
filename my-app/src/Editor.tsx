import React from 'react'
import * as mui from "@mui/material/"
import {styled} from "@mui/material/styles"

import Sidebar from './ui-components/Sidebar'
import MachinesBar from './ui-components/MachinesBar'
import Funcs from './Funcs'
import Snackbar from './feedback/Snackbar';

const CssTextField = styled(mui.TextField)({
textAlign: "center",
'& label':{
    color: 'white'
},
'& label.Mui-focused': {
    color: 'white',
},
});

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

class Editor extends React.Component<{}, {filename: string, content: string, error: boolean, sendSnackbar: boolean, message: string}>{
    constructor(props: any){
        super(props)
        this.state = {filename: "filename.ls", content: "Le code here", error: false, sendSnackbar: false, message: ""}
    }

    async componentDidMount(){
        if(window.location.href.split("?").length > 1){
            (document.getElementById("filename") as HTMLInputElement).setAttribute("disabled", "true");
            let params: any = window.location.href.split("?")[1]
            params = params.split("&")
            let filename = params[0].split("=")[1].replace("%20", " ")

            let r = await Funcs.request('/v2/storage', {type: "get_file", file: filename, username: localStorage.getItem("username")})
            this.setState({filename: r.filename, content: r.content});
            (document.getElementById("filename") as HTMLInputElement).value = r.filename;
            (document.getElementById("content") as HTMLTextAreaElement).value = r.content;
        }
    }

    async handleSave(e: any){
        let filename = (document.getElementById("filename") as HTMLInputElement).value;
        let content = (document.getElementById("content") as HTMLTextAreaElement).value;
        
        let payload = {type: "add_file", file: {filename: filename, content: content}, username: localStorage.getItem("username")}    
        let r = await Funcs.request('/v2/storage', payload)
        if(r.type == "OK"){
            this.setState({sendSnackbar: true, message: "File saved."})
        } else{
            this.setState({sendSnackbar: true, message: `ERROR: ${r.message}`})
        }
    }

	render(){
	return(
        <div>
            <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
            <mui.Paper elevation={0}>
            
            {this.state.sendSnackbar?
            <Snackbar
            message={this.state.message}
            handleClose={() => this.setState({sendSnackbar: false})}
            />
            :""}
            
            <div style={{display: "flex"}}>
            <MachinesBar />
            <Sidebar />

                <div style={{marginLeft: "20px", marginTop: "15px"}}>
                    <div style={{marginTop: "20px"}}>
                    <CssTextField
                        id="filename"
                        size="small"
                        variant="outlined"
                        label="File name"
                        defaultValue={this.state.filename}>
                    </CssTextField>
                    <SaveButton
                        style={{marginLeft: "10px"}}
                        variant={this.state.error ? "contained" : "outlined"}
                        color='error'
                        onClick={this.handleSave.bind(this)}>
                        Save
                    </SaveButton>
                    </div>
                    
                    <mui.TextField id="content" style={{marginTop: "20px", width: "50vw"}}
                      fullWidth
                      multiline
                      spellCheck="false"
                      label="Code"
                      rows={25}
                      defaultValue={this.state.content}
                    />
                </div>
                
            </div>
            </mui.Paper>
            </mui.ThemeProvider>
        </div>
	)
	}
}

export default Editor;