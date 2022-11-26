import React from 'react'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import * as mui from "@mui/material/"

class File extends React.Component{
  render(){
  return(
      <mui.Card style={{height: "fitContent", marginLeft: "10px", marginTop: "10px"}}>
        <mui.CardActionArea>
          <mui.CardContent>
            <mui.Typography gutterBottom variant="h5" component="div">
              README.txt
            </mui.Typography>
            <mui.Typography variant="body2" color="text.secondary">
              Mr. Lizard is offering you browser cookies. Mr. Lizard is offering you browser cookies. Mr. Lizard is offering you browser cookies. Mr. Lizard is offering you browser cookies. Mr. Lizard is offering you browser cookies. 
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

class Home extends React.Component{

    render(){
        return(
            <div>
            <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
            <mui.Paper elevation={0}>
            
            <Topbar />
            <div style={{display: "flex"}}>
            <Sidebar />

            <div style={{display: "grid", flex: "10%", gridTemplateRows: "auto auto auto auto auto", gridTemplateColumns: "auto auto auto auto auto"}}>
            <File/>
            <File/>
            <File/>
            <File/>
            <File/>
            <File/>
            <File/>
            <File/>
            <File/>
            </div>

            </div>
            </mui.Paper>
            </mui.ThemeProvider>
            </div>
        )
    }
}

export default Home;