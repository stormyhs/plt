import * as mui from "@mui/material/";
import { kMaxLength } from "buffer";
import * as React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';


class Chat extends React.Component<{}, { messages: any, username: string|null}> {
  constructor(props: any){
    super(props)
    this.state = {
      messages: [],
      username: localStorage.getItem("username"),
    };
  }

  handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  
    // Get the message from the input field
    const text = (event.target as HTMLInputElement).value;
  
    // Add the message to the list of messages in the component's state
    this.setState((state) => ({
      messages: [...state.messages, {username:localStorage.getItem("username"), text:text}],
    }));
  
    // Clear the input field
    (event.target as HTMLInputElement).value = '';
  };
  
  handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.handleSubmit(event);
    }
  };
  
  render() {
    return (
      <div>
        <mui.ThemeProvider theme={mui.createTheme({ palette: { mode: 'dark' } })}>
          <mui.Paper elevation={0}>
            <Topbar />
            <div style={{ display: 'flex' }}>
              <Sidebar />
              <mui.Stack direction="column" spacing={2}>
                <div>
                  {/* Use a mui.List component to display the messages */}
                  <mui.List>
                    {this.state.messages.map((message: any) => (
                        <mui.ListItem style={{maxWidth: '50%', wordBreak: "break-all"}}>
                          {/* Display the message and avatar */}
                          <mui.ListItemAvatar>
                            <mui.Avatar src="/favicon.ico"/>
                          </mui.ListItemAvatar>
                          <mui.ListItemText primary={message.username} secondary={message.text} />
                        </mui.ListItem>
                    ))}
                  </mui.List>
                </div>
                <mui.Stack direction="row" spacing={2}>
                  <div style={{ position: 'fixed', bottom: 50, left: 200, right: 0, display: 'flex', alignItems: 'center' }}>
                    {/* Use a mui.TextField component for the input box */}
                      <mui.TextField
                      id="writingBox"
                      spellCheck={false}
                      label="Write something..."
                      multiline
                      rows={2}
                      defaultValue=""
                      style={{ width: '50%' }}
                      onKeyDown={this.handleKeyPress}
                      />
                    {/* Add a submit button */} 
                  </div>
                </mui.Stack>
              </mui.Stack>
            </div>
          </mui.Paper>
        </mui.ThemeProvider>
      </div>
    );
  }
}

export default Chat;