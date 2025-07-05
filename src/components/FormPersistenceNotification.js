import React, { useState, useEffect } from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestoreIcon from '@mui/icons-material/Restore';

const FormPersistenceNotification = ({ show, onClose }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (show) {
            setOpen(true);
            // Auto-hide after 8 seconds
            const timer = setTimeout(() => {
                setOpen(false);
                setTimeout(onClose, 300); // Wait for animation to complete
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    const handleClose = () => {
        setOpen(false);
        setTimeout(onClose, 300);
    };

    return (
        <Collapse in={open}>
            <Alert
                icon={<RestoreIcon fontSize="inherit" />}
                severity="info"
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                sx={{
                    mb: 2,
                    backgroundColor: 'rgba(33, 150, 243, 0.15)',
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    '& .MuiAlert-icon': {
                        color: '#2196f3',
                    },
                }}
            >
                <strong>Form data restored!</strong> We've restored your previous entries to save you time.
            </Alert>
        </Collapse>
    );
};

export default FormPersistenceNotification;