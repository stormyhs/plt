import React from 'react';
import * as mui from "@mui/material/";
import Sidebar from './Sidebar';
import Topbar from './Topbar';

class Chat extends React.Component{
    render(){
    return (
    <div>
    <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "dark"}})}>
    <mui.Paper elevation={0}>
    
    <Topbar />
        <div style={{display: "flex"}}>
        <Sidebar />
            <div>
                
            </div>
        </div>
    </mui.Paper>
	</mui.ThemeProvider>
    </div>
    );
    }
}

export default Chat;