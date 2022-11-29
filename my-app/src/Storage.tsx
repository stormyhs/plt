import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import * as mui from "@mui/material/"
import Funcs from './Funcs'
import { Link } from "react-router-dom";


class File extends React.Component<{filename: string, content: string}, {}>{

  async delete(){
    console.log("Delete on " + this.props.filename);
    let r = await Funcs.request('/api/storage', {type: 'remove_file', file: this.props.filename, username: localStorage.getItem("username")})
    console.log(r)
    if(r.type === "OK"){
      (document.getElementById(this.props.filename) as HTMLElement).remove();
    }
  }

  render(){
  return(
      <mui.Card id={this.props.filename} style={{width: "17vw", marginLeft: "10px", marginTop: "10px"}}>
        <Link to={"/editor?filename=" + this.props.filename}>
        <mui.CardActionArea>
          <mui.CardContent>
            <mui.Typography gutterBottom variant="h5" component="div">
              {this.props.filename}
            </mui.Typography>
            <mui.Typography variant="body2" color="text.secondary">
              {/*{this.props.content}*/}
              {"2 MB - RUNNING"}
            </mui.Typography>
          </mui.CardContent>
        </mui.CardActionArea>
        </Link>
        <mui.CardActions>
        {this.props.filename.split(".")[this.props.filename.split(".").length - 1] === "ls"
        ?
          <mui.Button size="small" color="primary">
            Compile
          </mui.Button>
        :
        ""}
        {this.props.filename.split(".")[this.props.filename.split(".").length - 1] === "exe"
        ?
          <mui.Button size="small" color="primary">
            Run
          </mui.Button>
        :
        ""}
          <mui.Button size="small" color="primary"
          onClick={this.delete.bind(this)}>
            Delete
          </mui.Button>
        </mui.CardActions>
      </mui.Card>
  )
  }
}

class Storage extends React.Component<{}, {files: any}>{
  constructor(props: any){
    super(props)
    this.state = {files: []}
  }

  async componentDidMount(){
    let r = await Funcs.request('/api/storage', {type: "get_files", username: localStorage.getItem("username")})
    this.setState({files: r})
  }

	render(){
	return(
		<div>
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
        <mui.Paper elevation={0}>
        
        <Topbar />
        <div style={{display: "flex"}}>
        <Sidebar />
        
        <div style={{display: "grid", alignContent: "flex-start", gridTemplateColumns: "auto auto auto auto auto"}}>
	        {
	        this.state.files != null && this.state.files.length !== 0
	        ?
	        (<>
	            {this.state.files.map((file: any) =>{
	                return  <><File filename={file.filename} content={file.content}/></>
	            })}
	        </>)
	        :
	        ""
	        }
        </div>

        </div>
        </mui.Paper>
        </mui.ThemeProvider>
		</div>
	)
	}
}

export default Storage;