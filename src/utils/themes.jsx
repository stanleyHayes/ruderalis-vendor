import {createTheme} from "@mui/material";
import {red} from "@mui/material/colors";

const sharedTypography = {
    fontFamily: "'Google Sans', 'Google Sans Text', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: {fontWeight: 700}, h2: {fontWeight: 700}, h3: {fontWeight: 700}, h4: {fontWeight: 700},
    h5: {fontWeight: 600}, h6: {fontWeight: 600},
    subtitle1: {fontWeight: 500}, subtitle2: {fontWeight: 500},
    body2: {fontSize: '0.875rem'},
};

const sharedShape = {borderRadius: 6};

const sharedComponents = (mode) => ({
    MuiCard: {
        defaultProps: {elevation: 0},
        styleOverrides: {root: {
            border: mode === 'dark' ? '1px solid rgba(255,255,255,0.07)' : '1px solid #E2E8F0',
            borderRadius: 10,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}
    },
    MuiCardContent: {styleOverrides: {root: {flex: 1, display: 'flex', flexDirection: 'column'}}},
    MuiButton: {styleOverrides: {root: {textTransform: 'none', fontWeight: 600, borderRadius: 6}}},
    MuiChip: {styleOverrides: {root: {fontWeight: 600, borderRadius: 6}}},
    MuiTableCell: {styleOverrides: {root: {borderColor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#F1F5F9'}}},
    ...(mode === 'dark' ? {MuiPaper: {styleOverrides: {root: {backgroundImage: 'none'}}}} : {}),
    MuiDialog: {styleOverrides: {paper: {borderRadius: 12}}},
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {main: '#166534', light: '#22C55E', dark: '#14532D'},
        secondary: {main: '#22C55E', light: '#4ADE80', dark: '#16A34A'},
        light: {
            secondary: 'rgba(34,197,94,0.07)',
            gray: 'rgba(0,0,0,0.025)',
            green: 'rgba(34,197,94,0.05)'
        },
        action: {active: '#22C55E'},
        background: {paper: '#FFFFFF', default: '#F8FAF9'},
        text: {primary: '#0F172A', secondary: '#64748B'},
        divider: '#E2E8F0',
        success: {main: '#16A34A'},
        warning: {main: '#EAB308'},
        error: {main: '#DC2626'},
        info: {main: '#2563EB'}
    },
    typography: sharedTypography,
    shape: sharedShape,
    components: sharedComponents('light')
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {main: '#22C55E', light: '#4ADE80', dark: '#16A34A'},
        secondary: {main: '#4ADE80', light: '#86EFAC', dark: '#22C55E'},
        light: {
            secondary: 'rgba(34,197,94,0.08)',
            red: red[300],
            gray: 'rgba(255,255,255,0.035)',
            green: 'rgba(34,197,94,0.06)'
        },
        action: {active: '#4ADE80'},
        background: {paper: '#1C1F26', default: '#13151A'},
        text: {primary: '#F1F5F9', secondary: '#94A3B8'},
        divider: 'rgba(255,255,255,0.07)',
        success: {main: '#22C55E'},
        warning: {main: '#EAB308'},
        error: {main: '#EF4444'},
        info: {main: '#3B82F6'}
    },
    typography: sharedTypography,
    shape: sharedShape,
    components: sharedComponents('dark')
});

export const THEMES = {darkTheme, lightTheme};
