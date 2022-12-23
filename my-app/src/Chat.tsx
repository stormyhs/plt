import * as mui from "@mui/material/";
import * as React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';


class Chat extends React.Component<{}, { messages: string[] }> {
  state = {
    messages: [],
  };

  handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    // Get the message from the input field
    const message = (event.target as HTMLInputElement).value;

    // Add the message to the list of messages in the component's state
    this.setState((state) => ({
      messages: [...state.messages, message],
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
                    {this.state.messages.map((message) => (
                      <mui.ListItem>
                        {/* Display the message and avatar */}
                        <mui.ListItemAvatar>
                          <mui.Avatar src="/favicon.ico"/>
                        </mui.ListItemAvatar>
                        <mui.ListItemText primary={message} />
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