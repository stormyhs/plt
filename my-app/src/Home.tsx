import React from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import * as mui from "@mui/material/"
import Funcs from './Funcs'

class File extends React.Component<{filename: string, content: string}, {}>{
  render(){
  return(
      <mui.Card style={{width: "17vw", marginLeft: "10px", marginTop: "10px"}}>
        <mui.CardActionArea>
          <mui.CardContent>
            <mui.Typography gutterBottom variant="h5" component="div">
              {this.props.filename}
            </mui.Typography>
            <mui.Typography variant="body2" color="text.secondary">
              {this.props.content}
            </mui.Typography>
          </mui.CardContent>
        </mui.CardActionArea>
        <mui.CardActions>
          <mui.Button size="small" color="primary">
            Run
          </mui.Button>
          <mui.Button size="small" color="primary">
            Delete
          </mui.Button>
        </mui.CardActions>
      </mui.Card>
  )
  }
}

class Home extends React.Component<{}, {files: []}>{
  constructor(props: any){
    super(props)
    this.state = {files: []}
  }

  async componentDidMount(){
    console.log("le async")
    let r = await Funcs.request('/api/storage', {type: "get_files", username: localStorage.getItem("username")})
    console.log(r)
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
            {/*<File filename="test.txt" content="niggers"/>
            <File filename="test.txt" content="niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers niggers "/>
            <File filename="test.txt.txt.txt.txt.txt" content="niggers"/>
            <File filename="test.txt" content="niggers"/>
            <File filename="test.txt" content="niggers"/>
            <File filename="test.txt.txt.txt.txt.txt.txt.txt.txt.txt.txt.txt.txt.txt.txt.txt.txt" content="niggers"/>
            <File filename="test.txt" content="niggers"/>
            <File filename="test.txt" content="niggers"/>
            <File filename="test.txt" content="niggers"/>
            <File filename="test.txt" content="niggers"/>*/}

            {
            this.state.files != null && this.state.files.length != 0
            ?
            (<>
                {this.state.files.map((file: any) =>{
                    return <File filename={file.filename} content={file.content}/>
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

export default Home;