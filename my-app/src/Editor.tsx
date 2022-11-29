import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Funcs from './Funcs'
import * as mui from "@mui/material/"
import {styled} from "@mui/material/styles"

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

class Block extends React.Component<{title: string, subtitle?: string}, {}>{
    handleClick(){

    }

    render(){
    return(
        <mui.Box style={{marginTop: "10px"}}
        sx={{
          bgcolor: 'gray',
          boxShadow: 1,
          borderRadius: 2,
          p: 2,
          minWidth: 200,
          "&:hover": {
            minWidth: 199,
            borderLeft: 1,
            borderColor: 'red'
          }
        }}
        >
        {this.props.title}
        {this.props.subtitle ?
        <mui.Box
        sx={{
          bgcolor: 'gray',
          fontSize: 12
        }}
        >
        {this.props.subtitle}
        </mui.Box>
         :
        ""}
        </mui.Box>
    )
    }
}

class Editor extends React.Component<{}, {filename: string, content: string, error: boolean}>{
    constructor(props: any){
        super(props)
        this.state = {filename: "filename.ls", content: "Le code here", error: false}
    }

    async componentDidMount(){
        if(window.location.href.split("?").length > 1){
            let params: any = window.location.href.split("?")[1]
            params = params.split("&")
            let filename = params[0].split("=")[1].replace("%20", " ")
            console.log(filename)
            let r = await Funcs.request('/api/storage', {type: "get_file", file: filename, username: localStorage.getItem("username")})
            console.log(r)
            this.setState({filename: r.filename, content: r.content});
            (document.getElementById("filename") as HTMLInputElement).value = r.filename;
            if(this.state.filename.split(".")[this.state.filename.split(".").length-1] !== "ls"){
                (document.getElementById("content") as HTMLTextAreaElement).value = r.content;
            }
        }
    }

    async handleClick(e: any){
        let filename = (document.getElementById("filename") as HTMLInputElement).value;
        let content = (document.getElementById("content") as HTMLTextAreaElement).value;
        let payload = {type: "add_file", file: {filename: filename, content: content}, username: localStorage.getItem("username")}
        let r = await Funcs.request('/api/storage', payload)
        if(r.type !== "OK"){
            this.setState({error: true})
        }
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
                    <div style={{display: "grid", gridTemplateColumns: "auto auto"}}>
                        <div>
                        <SaveButton variant={this.state.error ? "contained" : "outlined"} color='error' onClick={this.handleClick.bind(this)}>Save</SaveButton>
                        <br/><CssTextField id="filename" style={{marginTop: "20px"}} variant="outlined" label="File name" defaultValue={this.state.filename}></CssTextField>
                        <mui.TextField id="content" style={{marginTop: "20px"}}
                          spellCheck="false"
                          fullWidth
                          label="Code"
                          multiline
                          rows={25}
                          defaultValue={this.state.content}
                        />
                        </div>

                        <div style={{marginLeft: "7vw"}}>
                        <h1>Code Blocks</h1>
                        <Block title="Create File" subtitle="filename, content"/>
                        <Block title="Delete File" subtitle="filename"/>
                        <Block title="Append Log" subtitle="entry"/>
                        <Block title="Set Logs" subtitle="entry"/>
                        </div>
                    </div>
                
                </div>
            </div>
            </mui.Paper>
            </mui.ThemeProvider>
        </div>
	)
	}
}

export default Editor;