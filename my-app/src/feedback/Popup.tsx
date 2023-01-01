import React, {useState, useEffect} from 'react'
import * as mui from "@mui/material/"

type PopupType = {
    title: string,
    subtitle?: string | null,
    handleClose: () => void
}

/**
 * Sends a notification on the screen.
 * @param {string} title The popup title.
 * @param {string} subtitle (opt) The popup subtitle.
 * @param {function} handleClose What onClose will call.
 */
const Popup: React.FC<PopupType> = (props) => {
    const [open, setOpen] = useState(true)

    return(
    <div>
	  <mui.Dialog onClose={props.handleClose} open={open}>
		<div style={{marginLeft: "20px", marginRight: "20px"}}>
		<mui.DialogTitle>
		  <mui.Typography variant="h5">
			{props.title}
		  </mui.Typography>
		</mui.DialogTitle>
        {props.subtitle?
		<mui.DialogContent>
		  <mui.Typography variant="h6">
			{props.subtitle}
		  </mui.Typography>
		</mui.DialogContent>
        :""}
		</div>
	  </mui.Dialog>
    </div>
    )
}

export default Popup;