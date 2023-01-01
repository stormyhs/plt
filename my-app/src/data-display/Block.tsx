import {useState} from 'react'
import * as mui from "@mui/material/"
import Snackbar from '../feedback/Snackbar'

/**
 * Wraps around text like a box.
 * @param {string} primary Primary text - Big and bright.
 * @param {string} secondary Secondary text - Small and dull.
 * @param {string} tertiary Tertiary text - As secondary. Default `null`
 * @param {string} color Border color. Default `white`.
 * @param {boolean} canCopy Allows copying the title on click. Default `false`.
 */
const Block = ({primary="Title", secondary="Subtitle", tertiary=null, color="cyan", canCopy=false}) => {
    let [notif, showNotif] = useState(false)

    const copy_text = async () => {
        if(canCopy){
            navigator.clipboard.writeText(primary)
            showNotif(true)
        }
    }

    return(
        <>
        <mui.Box
        onClick={copy_text}
        style={{
            marginBottom: "10px",
            userSelect: 'none',
            cursor: canCopy ? "pointer" : "normal"
        }}
        sx={{
        bgcolor: 'background.paper3',
        border: 1,
        borderColor: color,
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
        minWidth: 300,
        }}
        >

            <mui.Box sx={{color: 'text.primary', fontSize: 34, fontWeight: 'medium'}}>{primary}</mui.Box>
            <mui.Box sx={{color: 'text.secondary'}}>{secondary}</mui.Box>
            
            {tertiary?
            <mui.Box sx={{color: 'text.secondary'}}>{tertiary}</mui.Box>
            :""
            }

            {notif?
            <Snackbar message={`Copied ${primary}`} handleClose={() => showNotif(false)}/>
            :""
            }

        </mui.Box>
        </>
    )
}

export default Block;