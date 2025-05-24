import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

interface LoadingOverlayProps {
    current: number;
    total: number;
}

/**
 * A loading overlay with progress indicator
 */
export default function LoadingOverlay({ current, total }: LoadingOverlayProps) {
    const progressPercentage = (current / total) * 100;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1300,
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: 2,
                }}
            >
                <CircularProgress
                    variant="determinate"
                    size={120}
                    value={progressPercentage}
                />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'black', fontSize: 20 }}
                    >{`${Math.round(progressPercentage)}%`}</Typography>
                </Box>
            </Box>
        </Box>
    );
}
