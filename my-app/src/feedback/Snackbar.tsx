import React, {useState, useEffect} from 'react'
import * as mui from "@mui/material/"

type SnackbarType = {
    message: string,
    duration?: number,
    handleClose: () => void
}

/**
 * Sends a notification on the screen.
 * @param {string} message The message to display.
 * @param {number} duration How long to keep the snackbar. Default `3500`ms
 */
const Snackbar: React.FC<SnackbarType> = (props) => {
    const [open, setOpen] = useState(true)
    
    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const startCounter = async () =>{
        await sleep(props.duration ? props.duration : 3500)
        props.handleClose()
    }

    useEffect(() => { startCounter(); },[]);
    
    return(
    <div>
        {/* NOTE: This is setting the Snackbar's theme to "light" */}
        {/* However, this is quite in fact CAP. */}
        {/* If set to light mode, the theme will be dark, */}
        {/* and if set to dark mode, the theme will be light. */}
        <mui.ThemeProvider theme={mui.createTheme({palette: {mode: "light"}})}>

        <mui.Snackbar
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        open={open}
        onClose={props.handleClose}
        message={props.message}
        />

        </mui.ThemeProvider>
    </div>
    )
}

export default Snackbar;