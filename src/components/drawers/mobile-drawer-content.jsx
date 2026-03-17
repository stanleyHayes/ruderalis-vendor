import {Avatar, Box, Divider, Stack, Typography} from "@mui/material";
import {orange} from "@mui/material/colors";
import SidebarLink from "../shared/sidebar-link";
import {
    GridViewRounded,
    LocalFlorist,
    LocalShipping,
    Storefront,
    PeopleAlt,
    AccountBalanceWallet,
    BarChart,
    TrendingUp,
    MailRounded,
    PersonRounded,
    SettingsRounded,
    NotificationsRounded,
    LogoutRounded,
    DarkModeRounded,
    LightModeRounded,
    LocalCafe,
    PaymentRounded,
    LocalShippingRounded,
    BuildRounded,
    CampaignRounded,
    GavelRounded
} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router";
import {Link} from "react-router-dom";
import logo from "./../../assets/images/logo.png";
import {useDispatch, useSelector} from "react-redux";
import {closeDrawer, selectUI, toggleTheme} from "../../redux/features/ui/ui-slice";
import {logout, selectAuth} from "../../redux/features/auth/auth-slice";

const NavIcon = ({Icon, active, color}) => (
    <Box sx={{
        width: 32, height: 32,
        borderRadius: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? `${color}18` : 'transparent',
        transition: 'all 0.15s ease'
    }}>
        <Icon sx={{fontSize: 18, color: active ? color : 'text.secondary'}}/>
    </Box>
);

const SectionLabel = ({children}) => (
    <Typography
        variant="caption"
        sx={{
            px: 3, pt: 2, pb: 0.8,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '0.62rem',
            opacity: 0.7
        }}>
        {children}
    </Typography>
);

const MobileDrawerContent = () => {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {themeVariant} = useSelector(selectUI);
    const {user} = useSelector(selectAuth);

    const handleLogout = () => {
        dispatch(closeDrawer());
        dispatch(logout());
        navigate('/auth/login');
    };

    const overviewNav = [
        {path: '/', label: 'Dashboard', icon: GridViewRounded, color: '#4CAF50', match: pathname === '/'},
    ];

    const catalogNav = [
        {path: '/products', label: 'Products', icon: LocalFlorist, color: '#66BB6A', match: pathname.startsWith('/products')},
        {path: '/shops', label: 'Dispensaries', icon: Storefront, color: '#26A69A', match: pathname.startsWith('/shops')},
        {path: '/edibles', label: 'Edibles', icon: LocalCafe, color: '#8D6E63', match: pathname === '/edibles'},
        {path: '/accessories', label: 'Accessories', icon: BuildRounded, color: '#4F46E5', match: pathname === '/accessories'},
    ];

    const marketingNav = [
        {path: '/promotions', label: 'Promotions', icon: CampaignRounded, color: '#F59E0B', match: pathname === '/promotions'},
    ];

    const salesNav = [
        {path: '/orders', label: 'Orders', icon: LocalShipping, color: '#42A5F5', match: pathname.startsWith('/orders')},
        {path: '/customers', label: 'Customers', icon: PeopleAlt, color: '#AB47BC', match: pathname.startsWith('/customers')},
        {path: '/messages', label: 'Messages', icon: MailRounded, color: '#EC407A', match: pathname === '/messages'},
        {path: '/disputes', label: 'Disputes', icon: GavelRounded, color: '#F97316', match: pathname.startsWith('/disputes')},
    ];

    const financeNav = [
        {path: '/funds', label: 'Funds', icon: AccountBalanceWallet, color: '#FFA726', match: pathname.startsWith('/funds')},
        {path: '/revenue', label: 'Revenue', icon: TrendingUp, color: '#26C6DA', match: pathname === '/revenue'},
        {path: '/reports', label: 'Reports', icon: BarChart, color: '#7E57C2', match: pathname === '/reports'},
    ];

    const configNav = [
        {path: '/payment-setup', label: 'Payments', icon: PaymentRounded, color: '#8B5CF6', match: pathname === '/payment-setup'},
        {path: '/shipping-setup', label: 'Shipping', icon: LocalShippingRounded, color: '#0891B2', match: pathname === '/shipping-setup'},
    ];

    const accountNav = [
        {path: '/profile', label: 'Profile', icon: PersonRounded, color: '#78909C', match: pathname === '/profile'},
        {path: '/settings', label: 'Settings', icon: SettingsRounded, color: '#78909C', match: pathname === '/settings'},
    ];

    const renderNavGroup = (items) => (
        <Stack direction="column" spacing={0.2}>
            {items.map(item => (
                <SidebarLink
                    key={item.path}
                    icon={<NavIcon Icon={item.icon} active={item.match} color={item.color}/>}
                    active={item.match}
                    label={item.label}
                    path={item.path}
                />
            ))}
        </Stack>
    );

    return (
        <Box sx={{width: {xs: '80vw', sm: '300px'}, height: '100%', display: 'flex', flexDirection: 'column'}}>
            <Stack sx={{px: 2.5, pt: 2.5, pb: 2}} direction="row" alignItems="center" spacing={1.5}>
                <Link to="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center'}}>
                    <img src={logo} style={{width: 34, height: 34, objectFit: 'contain'}} alt="Ruderalis Logo"/>
                </Link>
                <Link to="/" style={{textDecoration: 'none'}}>
                    <Typography sx={{color: 'text.primary', fontWeight: 700, letterSpacing: '-0.02em'}} variant="h6">
                        Ruderalis
                    </Typography>
                </Link>
            </Stack>

            <Divider sx={{mx: 2, opacity: 0.4}}/>

            <Box sx={{flex: 1, overflow: 'auto', pb: 1}}>
                <SectionLabel>Overview</SectionLabel>
                {renderNavGroup(overviewNav)}

                <SectionLabel>Catalog</SectionLabel>
                {renderNavGroup(catalogNav)}

                <SectionLabel>Sales & Customers</SectionLabel>
                {renderNavGroup(salesNav)}

                <SectionLabel>Marketing</SectionLabel>
                {renderNavGroup(marketingNav)}

                <SectionLabel>Finance</SectionLabel>
                {renderNavGroup(financeNav)}

                <SectionLabel>Configuration</SectionLabel>
                {renderNavGroup(configNav)}

                <SectionLabel>Account</SectionLabel>
                {renderNavGroup(accountNav)}
            </Box>

            <Box sx={{px: 1.5, pb: 1}}>
                <Divider sx={{mb: 1, opacity: 0.4}}/>
                <Stack
                    onClick={() => dispatch(toggleTheme())}
                    direction="row" spacing={1.5} alignItems="center"
                    sx={{px: 2, py: 0.8, borderRadius: 2, cursor: 'pointer', '&:hover': {backgroundColor: 'light.gray'}}}>
                    {themeVariant === 'dark' ?
                        <LightModeRounded sx={{fontSize: 18, color: '#FFA726'}}/> :
                        <DarkModeRounded sx={{fontSize: 18, color: '#5C6BC0'}}/>
                    }
                    <Typography variant="body2" sx={{color: 'text.secondary', fontSize: '0.82rem'}}>
                        {themeVariant === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </Typography>
                </Stack>
                <Stack
                    onClick={handleLogout}
                    direction="row" spacing={1.5} alignItems="center"
                    sx={{px: 2, py: 0.8, borderRadius: 2, cursor: 'pointer', '&:hover': {backgroundColor: 'rgba(239,83,80,0.06)'}}}>
                    <LogoutRounded sx={{fontSize: 18, color: orange[700]}}/>
                    <Typography variant="body2" sx={{color: orange[700], fontSize: '0.82rem', fontWeight: 500}}>
                        Logout
                    </Typography>
                </Stack>
            </Box>

            <Box sx={{px: 1.5, pb: 2}}>
                <Stack
                    component={Link} to="/profile"
                    direction="row" spacing={1.5} alignItems="center"
                    sx={{px: 2, py: 1.5, borderRadius: 2, backgroundColor: 'light.green', textDecoration: 'none', '&:hover': {opacity: 0.85}}}>
                    <Avatar sx={{width: 34, height: 34, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 600}}>
                        {user?.companyName?.[0] || 'R'}
                    </Avatar>
                    <Box sx={{flex: 1, overflow: 'hidden'}}>
                        <Typography variant="body2" sx={{color: 'text.primary', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            {user?.companyName || 'Cannabis Ventures'}
                        </Typography>
                        <Typography variant="caption" sx={{color: 'text.secondary', fontSize: '0.68rem'}}>
                            Vendor Account
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Box>
    )
}

export default MobileDrawerContent;
