import {Box, IconButton, SwipeableDrawer, Tooltip} from "@mui/material";
import {closeDrawer, openDrawer, selectUI, toggleSidebar} from "../../redux/features/ui/ui-slice";
import {useDispatch, useSelector} from "react-redux";
import MobileDrawerContent from "../drawers/mobile-drawer-content";
import DesktopSidebar from "../drawers/desktop-sidebar";
import MobileHeader from "../headers/mobile-header";
import {ChevronLeftRounded, ChevronRightRounded} from "@mui/icons-material";

const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 72;

const Layout = ({children}) => {
    const dispatch = useDispatch();
    const {drawerOpen, sidebarCollapsed} = useSelector(selectUI);
    const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

    return (
        <Box sx={{display: 'flex', maxWidth: '100vw', backgroundColor: 'background.default', minHeight: '100vh'}}>
            {/* Desktop Sidebar */}
            <Box
                sx={{
                    display: {xs: 'none', lg: 'flex'},
                    flexDirection: 'column',
                    width: sidebarWidth,
                    minWidth: sidebarWidth,
                    maxHeight: '100vh',
                    overflow: 'hidden',
                    backgroundColor: 'background.paper',
                    height: '100vh',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    transition: 'width 0.2s ease, min-width 0.2s ease',
                    position: 'relative',
                }}>
                <DesktopSidebar collapsed={sidebarCollapsed}/>

                {/* Collapse Toggle */}
                <Tooltip title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
                    <IconButton
                        onClick={() => dispatch(toggleSidebar())}
                        size="small"
                        sx={{
                            position: 'absolute',
                            bottom: 12,
                            right: sidebarCollapsed ? '50%' : 8,
                            transform: sidebarCollapsed ? 'translateX(50%)' : 'none',
                            width: 28, height: 28,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            color: 'text.secondary',
                            zIndex: 10,
                            '&:hover': {bgcolor: 'action.hover', color: 'primary.main'},
                        }}>
                        {sidebarCollapsed ? <ChevronRightRounded sx={{fontSize: 16}}/> : <ChevronLeftRounded sx={{fontSize: 16}}/>}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    maxHeight: '100vh',
                    backgroundColor: 'background.default',
                    minHeight: '100vh',
                    overflow: 'hidden',
                    transition: 'margin-left 0.2s ease',
                }}>
                <MobileHeader/>
                <Box sx={{flex: 1, overflow: 'auto', py: 3}}>
                    {children}
                </Box>
            </Box>

            {/* Mobile Drawer */}
            <SwipeableDrawer
                onOpen={() => dispatch(openDrawer())}
                open={drawerOpen}
                onClose={() => dispatch(closeDrawer())}
                PaperProps={{sx: {backgroundColor: 'background.paper', borderRadius: 0}}}>
                <MobileDrawerContent/>
            </SwipeableDrawer>
        </Box>
    )
}

export default Layout;
