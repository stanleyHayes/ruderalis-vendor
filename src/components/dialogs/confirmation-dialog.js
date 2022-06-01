import {Dialog, DialogContent} from "@mui/material";

const ConfirmationDialog = ({open, handleClose}) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>

            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationDialog;