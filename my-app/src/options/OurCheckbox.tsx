import React from 'react'
import * as mui from "@mui/material/"

type CheckboxType = {
    title: string,
    subtitle?: string | null,
    labels: string[] ,
    onCheck: Function,
}

/**
 * Sends a notification on the screen.
 * @param {string} title The checkbox card title.
 * @param {string} subtitle (opt) The checkbox card subtitle.
 * @param {string[]} labels The labels of the different checkboxes you want to have
 * @param {function} onCheck What onCheck will call.
 */
const OurCheckbox: React.FC<CheckboxType> = (props) => {

    return(
    <div>
        <mui.Card style= {{border:"white solid 1px"}}>   
        <mui.List sx={{ width: '100%' , bgcolor: 'background.paper' }}>
        
            <mui.ListItem style={{display: "flex",justifyContent:'space-between'}}>
                <mui.Typography variant="h6" gutterBottom>{props.title}</mui.Typography>
            </mui.ListItem>

            <mui.ListItem style={{display: "flex"}}>
                <mui.FormGroup style={{display: "grid", gridTemplateColumns:"auto auto",alignContent: "flex-start"}}>
                
                {
                    props.labels != null && props.labels.length !== 0
                    ?
                    (<>
                        {props.labels.map((label: any) =>{
                            return  <div style={{marginLeft:'20px'}}><mui.FormControlLabel control={<mui.Checkbox />} label={label} onChange={props.onCheck.bind(this)}/></div>
                        })}
                    </>)
                    :
                    ""
                }

                </mui.FormGroup>
            </mui.ListItem>
            <mui.Typography style={{marginTop:"8px",marginLeft:"8px"}} variant="body1" gutterBottom>{props.subtitle}</mui.Typography>

        </mui.List>
        </mui.Card>   
    </div>
    )
}

export default OurCheckbox;