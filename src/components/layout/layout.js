import {Box, SwipeableDrawer} from "@mui/material";
import {closeDrawer, openDrawer, selectUI} from "../../redux/features/ui/ui-slice";
import {useDispatch, useSelector} from "react-redux";
import MobileDrawerContent from "../drawers/mobile-drawer-content";
import DesktopSidebar from "../drawers/desktop-sidebar";

const Layout = ({children}) => {
    const dispatch = useDispatch();
    const {drawerOpen} = useSelector(selectUI);

    return (
        <Box sx={{display: 'flex', maxWidth: '100vw', backgroundColor: 'background.default', minHeight: '100vh'}}>
            <Box
                sx={{
                    display: {xs: 'none', lg: 'block'},
                    flexBasis: {xs: '0%', md: '30%', lg: '20%', xl: '15%'},
                    maxHeight: '100vh',
                    overflow: 'hidden',
                    backgroundColor: 'background.paper',
                    height: '100vh',
                    borderTopRightRadius: 32,
                    borderBottomRightRadius: 32
                }}>
                <DesktopSidebar/>
            </Box>
            <Box
                sx={{
                    display: {xs: 'block', lg: 'block'},
                    flexBasis: {xs: '100%', md: '70%', lg: '80%', xl: '85%'},
                    maxHeight: '100vh',
                    overflow: 'hidden',
                    backgroundColor: 'background.default',
                    minHeight: '100%',
                    maxWidth: '100%'
                }}>
                {children}
            </Box>

            <SwipeableDrawer
                onOpen={() => dispatch(openDrawer())}
                open={drawerOpen}
                onClose={() => dispatch(closeDrawer())}>
                <MobileDrawerContent/>
            </SwipeableDrawer>
        </Box>
    )
}

export default Layout;