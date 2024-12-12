import React from 'react';
import Button from '@mui/material/Button';

const CoreButton = ({ variant, color, onClick, children, customPadding,  ...props }) => {
    return (
        <Button
            variant={variant}
            color={color}
            onClick={onClick}
            {...props}
            style={{ padding: customPadding? customPadding : '10px 20px' }}
        >
            {children}
        </Button>
    );
};

export default CoreButton;