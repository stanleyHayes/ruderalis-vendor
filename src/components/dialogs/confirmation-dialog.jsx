import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

const ConfirmationDialog = ({open, handleClose, handleConfirm, title, description}) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{color: 'text.primary'}}>
                {title || 'Confirm Action'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{color: 'text.secondary'}}>
                    {description || 'Are you sure you want to proceed? This action cannot be undone.'}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{px: 3, pb: 2}}>
                <Button
                    onClick={handleClose}
                    sx={{
                        textTransform: 'capitalize',
                        color: 'text.secondary',
                        borderRadius: 2
                    }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    sx={{
                        textTransform: 'capitalize',
                        borderRadius: 2
                    }}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog;
