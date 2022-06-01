import {Box, Button, Divider, Stack, Typography} from "@mui/material";
import {orange, red} from "@mui/material/colors";
import DesktopSidebarLink from "../shared/desktop-sidebar-link";
import {
    AcUnit,
    AcUnitOutlined,
    Analytics,
    AnalyticsOutlined,
    Dashboard,
    DashboardOutlined,
    DeleteForever,
    ExitToApp,
    Face,
    FaceOutlined,
    Groups,
    GroupsOutlined,
    MonetizationOn,
    MonetizationOnOutlined,
    Notifications,
    NotificationsOutlined,
    Paid,
    PaidOutlined,
    Settings,
    SettingsOutlined,
    Shop,
    ShopOutlined,
    ShoppingBag,
    ShoppingBagOutlined
} from "@mui/icons-material";
import {useLocation} from "react-router";
import {Link} from "react-router-dom";
import logo from "./../../assets/images/logo.png";

const DesktopSidebar = () => {

    const {pathname} = useLocation();

    return (
        <Box sx={{height: '100%'}}>
            <Stack
                sx={{height: '100%', py: 2}}
                divider={<Divider variant="fullWidth" light={true}/>}
                direction="column">
                <Stack sx={{px: 2, mb: 4}} spacing={2} direction="row" alignItems="center">
                    <Link to="/" style={{textDecoration: 'none'}}>
                        <img
                            src={logo}
                            style={{width: 40, height: 40, objectFit: 'contain', objectPosition: 'center'}}
                            alt="Ruderalis Logo"
                        />
                    </Link>
                    <Link to="/" style={{textDecoration: 'none'}}>
                        <Typography
                            sx={{color: 'text.primary'}}
                            fontFamily="EuclidCircularB"
                            variant="h4">Ruderalis</Typography>
                    </Link>
                </Stack>

                <Stack direction="column" sx={{mb: 4, mt: 4}} spacing={1}>
                    <DesktopSidebarLink
                        icon={
                            pathname === '/' ?
                                <Dashboard
                                    sx={{
                                        color: 'secondary.main',
                                        borderRadius: '100%',
                                        borderWidth: 0.1,
                                        borderColor: 'secondary.main',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6
                                    }}/> :
                                <DashboardOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/'}
                        label="Dashboard"
                        path="/"
                    />

                    <DesktopSidebarLink
                        icon={
                            pathname === '/products' ?
                                <AcUnit
                                    sx={{
                                        color: 'secondary.main',
                                        borderRadius: '100%',
                                        borderWidth: 0.1,
                                        borderColor: 'secondary.main',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6
                                    }}/> :
                                <AcUnitOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/products'}
                        label="Products"
                        path="/products"
                    />

                    <DesktopSidebarLink
                        icon={
                            pathname === '/orders' ?
                                <ShoppingBag sx={{
                                    color: 'secondary.main',
                                    borderRadius: '100%',
                                    borderWidth: 0.1,
                                    borderColor: 'secondary.main',
                                    borderStyle: 'solid',
                                    fontSize: 18,
                                    padding: 0.6
                                }}/> :
                                <ShoppingBagOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/orders'}
                        label="Orders"
                        path="/orders"
                    />

                    <DesktopSidebarLink
                        icon={
                            pathname === '/shops' ?
                                <Shop
                                    sx={{
                                        color: 'secondary.main',
                                        borderRadius: '100%',
                                        borderWidth: 0.1,
                                        borderColor: 'secondary.main',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6
                                    }}/> :
                                <ShopOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/shops'}
                        label="Shops"
                        path="/shops"
                    />

                    <DesktopSidebarLink
                        icon={
                            pathname === '/customers' ?
                                <Groups
                                    sx={{
                                        color: 'secondary.main',
                                        borderRadius: '100%',
                                        borderWidth: 0.1,
                                        borderColor: 'secondary.main',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6
                                    }}/> :
                                <GroupsOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/customers'}
                        label="Customers"
                        path="/customers"
                    />

                    <DesktopSidebarLink
                        icon={
                            pathname === '/funds' ?
                                <MonetizationOn
                                    sx={{
                                        color: 'secondary.main',
                                        borderRadius: '100%',
                                        borderWidth: 0.1,
                                        borderColor: 'secondary.main',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6
                                    }}/> :
                                <MonetizationOnOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/funds'}
                        label="Funds"
                        path="/funds"
                    />

                    <DesktopSidebarLink
                        icon={
                            pathname === '/reports' ?
                                <Analytics
                                    sx={{
                                        color: 'secondary.main',
                                        borderRadius: '100%',
                                        borderWidth: 0.1,
                                        borderColor: 'secondary.main',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6
                                    }}/> :
                                <AnalyticsOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/reports'}
                        label="Reports"
                        path="/reports"
                    />

                    <DesktopSidebarLink
                        icon={
                            pathname === '/revenue' ?
                                <Paid
                                    sx={{
                                        color: 'secondary.main',
                                        borderRadius: '100%',
                                        borderWidth: 0.1,
                                        borderColor: 'secondary.main',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6
                                    }}/> :
                                <PaidOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/revenue'}
                        label="Revenue"
                        path="/revenue"
                    />
                </Stack>

                <Stack sx={{mt: 3}} direction="column" spacing={1}>
                    <DesktopSidebarLink
                        icon={
                            pathname === '/profile' ?
                                <Face sx={{
                                    color: 'secondary.main',
                                    borderRadius: '100%',
                                    borderWidth: 0.1,
                                    borderColor: 'secondary.main',
                                    borderStyle: 'solid',
                                    fontSize: 18,
                                    padding: 0.6
                                }}/> :
                                <FaceOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/profile'}
                        label="Profile"
                        path="/profile"
                    />

                    <DesktopSidebarLink
                        icon={
                            pathname === '/settings' ?
                                <Settings
                                    sx={{
                                        color: 'secondary.main',
                                        borderRadius: '100%',
                                        borderWidth: 0.1,
                                        borderColor: 'secondary.main',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6
                                    }}/> :
                                <SettingsOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/settings'}
                        label="Settings"
                        path="/settings"
                    />

                    <DesktopSidebarLink
                        icon={
                            pathname === '/notifications' ?
                                <Notifications
                                    sx={{
                                        color: 'secondary.main',
                                        borderRadius: '100%',
                                        borderWidth: 0.1,
                                        borderColor: 'secondary.main',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6
                                    }}/> :
                                <NotificationsOutlined
                                    sx={{
                                        color: 'text.secondary',
                                        borderRadius: '100%',
                                        borderWidth: 0,
                                        borderColor: 'text.secondary',
                                        borderStyle: 'solid',
                                        fontSize: 18,
                                        padding: 0.6,
                                        backgroundColor: 'light.gray'
                                    }}/>
                        }
                        active={pathname === '/notifications'}
                        label="Notifications"
                        path="/notifications"
                    />

                    <Stack
                        sx={{justifyContent: 'flex-start', px: 2}}
                        direction="row" spacing={1.5} justifyContent="space-between" alignItems="center">
                        <ExitToApp
                            sx={{
                                padding: 0.4,
                                borderTopLeftRadius: 36,
                                borderTopRightRadius: 36,
                                borderBottomRightRadius: 0,
                                borderBottomLeftRadius: 36,
                                backgroundColor: orange[100],
                                color: orange[800],
                                fontSize: 20
                            }}/>
                        <Button
                            fullWidth={true}
                            size="large"
                            variant="text"
                            sx={{
                                px: 2,
                                borderRadius: 0,
                                justifyContent: 'flex-start',
                                color: orange[800],
                                textTransform: 'capitalize',
                            }}>
                            Logout
                        </Button>
                    </Stack>

                    <Stack
                        sx={{justifyContent: 'flex-start', px: 2}}
                        direction="row" spacing={1.5} justifyContent="space-between" alignItems="center">
                        <DeleteForever
                            sx={{
                                padding: 0.4,
                                borderTopLeftRadius: 36,
                                borderTopRightRadius: 36,
                                borderBottomRightRadius: 0,
                                borderBottomLeftRadius: 36,
                                color: red[800],
                                backgroundColor: red[100],
                                fontSize: 20
                            }}/>
                        <Button
                            fullWidth={true}
                            size="large"
                            variant="text"
                            sx={{
                                px: 2,
                                borderRadius: 0,
                                justifyContent: 'flex-start',
                                color: red[800],
                                textTransform: 'capitalize',
                            }}>
                            Delete Account
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    )
}

export default DesktopSidebar;