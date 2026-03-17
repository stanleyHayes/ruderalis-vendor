import {createSlice} from "@reduxjs/toolkit";
import {CONSTANTS} from "../../../utils/constants";

const initialState = {
    themeVariant: localStorage.getItem(CONSTANTS.RUDERALIS_VENDOR_THEME_VARIANT)
        ? JSON.parse(localStorage.getItem(CONSTANTS.RUDERALIS_VENDOR_THEME_VARIANT))
        : 'dark',
    drawerOpen: false,
    sidebarCollapsed: localStorage.getItem('RUDERALIS_SIDEBAR_COLLAPSED') === 'true',
    language: 'en',
    activePath: '/'
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        changePath: (state, action) => {
            state.activePath = action.payload;
        },
        changeLanguage: (state, action) => {
            state.language = action.payload;
        },
        closeDrawer: state => {
            state.drawerOpen = false
        },
        openDrawer: state => {
            state.drawerOpen = true
        },
        toggleTheme: state => {
            localStorage.setItem(
                CONSTANTS.RUDERALIS_VENDOR_THEME_VARIANT,
                state.themeVariant === 'dark' ? JSON.stringify('light') : JSON.stringify('dark')
            )
            state.themeVariant = state.themeVariant === 'dark' ? 'light' : 'dark';
        },
        toggleSidebar: state => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
            localStorage.setItem('RUDERALIS_SIDEBAR_COLLAPSED', String(!state.sidebarCollapsed));
        },
        collapseSidebar: state => {
            state.sidebarCollapsed = true;
            localStorage.setItem('RUDERALIS_SIDEBAR_COLLAPSED', 'true');
        },
        expandSidebar: state => {
            state.sidebarCollapsed = false;
            localStorage.setItem('RUDERALIS_SIDEBAR_COLLAPSED', 'false');
        }
    }
});

export const {changePath, changeLanguage, closeDrawer, openDrawer, toggleTheme, toggleSidebar, collapseSidebar, expandSidebar} = uiSlice.actions;
export const selectUI = state => state.ui;
export default uiSlice.reducer;
