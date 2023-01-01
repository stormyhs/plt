import React from 'react'
import * as mui from "@mui/material/"

type SwitchType = {
    title: string,
    subtitle?: string | null,
    onCheck: Function,
}

/**
 * Sends a notification on the screen.
 * @param {string} title The switch card title.
 * @param {string} subtitle (opt) The switch card subtitle.
 * @param {function} onCheck What onCheck will call.
 */
const OurSwitch: React.FC<SwitchType> = (props) => {

    return(
    <div>
        <mui.Card style= {{border:"white solid 1px"}}>   
        <mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>

        <mui.ListItem style={{display: "flex",justifyContent:'space-between'}}>
        <mui.Typography variant="h6" gutterBottom>{props.title}</mui.Typography>
        <mui.Switch
            
            onChange={props.onCheck.bind(this)}
            inputProps={{ 'aria-label': 'controlled' }}
            color="primary"
            
        />
        </mui.ListItem>

        <mui.Typography style={{marginTop:"-12px",marginLeft:"8px"}} variant="body1" gutterBottom>{props.subtitle}</mui.Typography>

        </mui.List>
        </mui.Card>     
    </div>
    )
}

export default OurSwitch;