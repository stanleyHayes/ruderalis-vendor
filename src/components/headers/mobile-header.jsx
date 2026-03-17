import {AppBar, Avatar, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import {Menu as MenuIcon, DarkModeRounded, LightModeRounded} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {openDrawer, selectUI, toggleTheme} from "../../redux/features/ui/ui-slice";
import {selectAuth} from "../../redux/features/auth/auth-slice";
import {Link} from "react-router-dom";
import logo from "./../../assets/images/logo.png";
import NotificationsDropdown from "../shared/notifications-dropdown";

const MobileHeader = () => {
    const dispatch = useDispatch();
    const {themeVariant} = useSelector(selectUI);
    const {user} = useSelector(selectAuth);

    return (
        <AppBar
            elevation={0}
            color="transparent"
            position="sticky"
            sx={{
                display: {xs: 'block', lg: 'none'},
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                backdropFilter: 'blur(12px)'
            }}>
            <Toolbar sx={{px: {xs: 1.5, sm: 2}, minHeight: {xs: 56}}}>
                <IconButton
                    onClick={() => dispatch(openDrawer())}
                    edge="start"
                    size="small"
                    sx={{mr: 1}}>
                    <MenuIcon sx={{color: 'text.primary', fontSize: 22}}/>
                </IconButton>

                <Link to="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flex: 1}}>
                    <img src={logo} style={{width: 28, height: 28, objectFit: 'contain'}} alt="Ruderalis Logo"/>
                    <Typography sx={{color: 'text.primary', fontWeight: 700, letterSpacing: '-0.02em'}} variant="subtitle1">
                        Ruderalis
                    </Typography>
                </Link>

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton onClick={() => dispatch(toggleTheme())} size="small">
                        {themeVariant === 'dark' ?
                            <LightModeRounded sx={{color: 'text.secondary', fontSize: 20}}/> :
                            <DarkModeRounded sx={{color: 'text.secondary', fontSize: 20}}/>
                        }
                    </IconButton>
                    <NotificationsDropdown/>
                    <IconButton component={Link} to="/profile" size="small" sx={{ml: 0.5}}>
                        <Avatar sx={{width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.75rem', fontWeight: 600}}>
                            {user?.companyName?.[0] || 'R'}
                        </Avatar>
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default MobileHeader;
