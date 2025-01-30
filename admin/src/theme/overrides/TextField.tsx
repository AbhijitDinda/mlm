// ----------------------------------------------------------------------

import { alpha, Theme } from "@mui/material";

export default function TextField(theme:Theme) {
    const isLight = theme.palette.mode === 'light';
    return {
        MuiFormControl: {
            styleOverrides: {
                root: {
                    "& .MuiFormLabel-root": {
                        color: theme.palette.primary.main,
                    },
                    "& fieldset": {
                        borderColor: `${alpha(theme.palette.primary.main, 0.2)} !important`,
                    },
                    "& .MuiInputBase-root": {
                        background: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                    }
                }
            },
        },
    };
}
