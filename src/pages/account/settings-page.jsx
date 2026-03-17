import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    InputAdornment,
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import {
    BusinessRounded,
    EmailRounded,
    PhoneRounded,
    LocationOnRounded,
    LocationCityRounded,
    MapRounded,
    PinRounded,
    NotificationsRounded,
    LockRounded,
    SaveRounded,
    SettingsRounded,
    TuneRounded,
    ShieldRounded,
    VisibilityRounded,
    VisibilityOffRounded,
    CheckCircleRounded,
    MailRounded,
    SmsRounded,
    CampaignRounded,
    LocalShippingRounded,
    CardGiftcardRounded,
    PaymentRounded,
    AddRounded,
    DeleteRounded,
    StorefrontRounded,
    AccountBalanceWalletRounded,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Layout from "../../components/layout/layout";
import {updateProfile, selectAuth, clearMessage, clearError} from "../../redux/features/auth/auth-slice";

const NOTIF_ITEMS = [
    {key: 'email', label: 'Email Notifications', desc: 'Receive order confirmations, receipts, and account updates via email', icon: MailRounded, color: '#3B82F6'},
    {key: 'sms', label: 'SMS Alerts', desc: 'Get text messages for urgent order updates and delivery notifications', icon: SmsRounded, color: '#10B981'},
    {key: 'push', label: 'Push Notifications', desc: 'Receive real-time browser notifications for new orders and messages', icon: CampaignRounded, color: '#8B5CF6'},
    {key: 'orderUpdates', label: 'Order Status Changes', desc: 'Be notified when orders are placed, delivering, completed, or cancelled', icon: LocalShippingRounded, color: '#F59E0B'},
    {key: 'promotions', label: 'Promotions & News', desc: 'Stay updated with deals, new features, and platform announcements', icon: CardGiftcardRounded, color: '#EC4899'},
];

const SettingsPage = () => {
    const dispatch = useDispatch();
    const {user, loading, message, error} = useSelector(selectAuth);
    const [tab, setTab] = useState(0);
    const [showPassword, setShowPassword] = useState({current: false, new: false, confirm: false});
    const [notifications, setNotifications] = useState({
        email: user?.notifications?.email ?? true,
        sms: user?.notifications?.sms ?? true,
        push: user?.notifications?.push ?? true,
        orderUpdates: user?.notifications?.orderUpdates ?? true,
        promotions: user?.notifications?.promotions ?? false,
    });

    const initial = user?.companyName?.charAt(0) || user?.fullName?.charAt(0) || 'R';
    const enabledCount = Object.values(notifications).filter(Boolean).length;

    // Payment state
    const [paymentMethods, setPaymentMethods] = useState(
        user?.paymentMethods || user?.paymentDetails
            ? [user.paymentDetails || {provider: 'mtn', number: '', accountName: ''}]
            : [{provider: 'mtn', number: '', accountName: ''}]
    );
    const addPaymentMethod = () => setPaymentMethods([...paymentMethods, {provider: 'mtn', number: '', accountName: ''}]);
    const removePaymentMethod = (i) => setPaymentMethods(paymentMethods.filter((_, idx) => idx !== i));
    const updatePaymentMethod = (i, field, value) => {
        const updated = [...paymentMethods];
        updated[i] = {...updated[i], [field]: value};
        setPaymentMethods(updated);
    };
    const savePaymentMethods = () => {
        dispatch(clearError());
        dispatch(clearMessage());
        dispatch(updateProfile({paymentDetails: paymentMethods[0], paymentMethods}));
    };

    // Shipping state
    const [destinations, setDestinations] = useState(user?.destinations || []);
    const addDestination = () => setDestinations([...destinations, {name: '', price: {amount: 0, currency: 'GHS'}}]);
    const removeDestination = (i) => setDestinations(destinations.filter((_, idx) => idx !== i));
    const updateDestination = (i, field, value) => {
        const updated = [...destinations];
        if (field === 'name') updated[i] = {...updated[i], name: value};
        else updated[i] = {...updated[i], price: {...updated[i].price, amount: parseFloat(value) || 0}};
        setDestinations(updated);
    };
    const saveDestinations = () => {
        dispatch(clearError());
        dispatch(clearMessage());
        dispatch(updateProfile({destinations}));
    };

    const PROVIDERS = [
        {value: 'mtn', label: 'MTN MoMo', color: '#FFCC00'},
        {value: 'vodafone', label: 'Vodafone Cash', color: '#E60000'},
        {value: 'airtelTigo', label: 'AirtelTigo', color: '#E40046'},
    ];

    const profileFormik = useFormik({
        initialValues: {
            companyName: user?.companyName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            street: user?.address?.street || "",
            city: user?.address?.city || "",
            region: user?.address?.region || "",
            country: user?.address?.country || "Ghana",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            companyName: Yup.string().required("Required"),
            email: Yup.string().email("Invalid email").required("Required"),
            phone: Yup.string().required("Required"),
        }),
        onSubmit: (values) => {
            dispatch(clearError());
            dispatch(clearMessage());
            dispatch(updateProfile({
                companyName: values.companyName, name: values.companyName,
                email: values.email, phone: values.phone,
                address: {street: values.street, city: values.city, region: values.region, country: values.country},
            }));
        },
    });

    const securityFormik = useFormik({
        initialValues: {currentPassword: "", newPassword: "", confirmPassword: ""},
        validationSchema: Yup.object({
            currentPassword: Yup.string().required("Required"),
            newPassword: Yup.string().min(8, "Min 8 characters").required("Required"),
            confirmPassword: Yup.string().oneOf([Yup.ref("newPassword")], "Passwords must match").required("Required"),
        }),
        onSubmit: () => {
            dispatch(clearError());
            dispatch(clearMessage());
            dispatch(updateProfile({passwordUpdated: true}));
            securityFormik.resetForm();
        },
    });

    const handleSaveNotifications = () => {
        dispatch(clearError());
        dispatch(clearMessage());
        dispatch(updateProfile({notifications}));
    };

    const handleToggle = (key) => setNotifications(prev => ({...prev, [key]: !prev[key]}));

    const fp = (formik, name) => ({
        fullWidth: true, size: "small", name,
        value: formik.values[name],
        onChange: formik.handleChange, onBlur: formik.handleBlur,
        error: formik.touched[name] && Boolean(formik.errors[name]),
        helperText: formik.touched[name] && formik.errors[name],
    });

    const adorn = (Icon) => ({
        slotProps: {input: {startAdornment: <InputAdornment position="start"><Icon sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}
    });

    const passAdorn = (key) => ({
        slotProps: {input: {
            startAdornment: <InputAdornment position="start"><LockRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>,
            endAdornment: <InputAdornment position="end">
                <Box onClick={() => setShowPassword(p => ({...p, [key]: !p[key]}))} sx={{cursor: 'pointer', display: 'flex'}}>
                    {showPassword[key] ? <VisibilityOffRounded sx={{fontSize: 18, color: 'text.secondary'}}/> : <VisibilityRounded sx={{fontSize: 18, color: 'text.secondary'}}/>}
                </Box>
            </InputAdornment>
        }}
    });

    return (
        <Layout>
            <Container maxWidth="lg">
                <Stack spacing={2.5}>
                    {/* Header */}
                    <Card sx={{border: 'none', overflow: 'hidden', background: 'linear-gradient(135deg, #064E3B 0%, #059669 50%, #10B981 100%)', color: '#fff'}}>
                        <Box sx={{position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                        <Box sx={{position: 'absolute', bottom: -25, left: '30%', width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.04)'}}/>
                        <CardContent sx={{p: 3, position: 'relative'}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{width: 50, height: 50, bgcolor: 'rgba(255,255,255,0.15)', fontWeight: 800, fontSize: '1.3rem', backdropFilter: 'blur(10px)'}}>
                                        {initial}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em'}}>Settings</Typography>
                                        <Typography sx={{fontSize: '0.82rem', opacity: 0.8}}>Manage your account, notifications, and security</Typography>
                                    </Box>
                                </Stack>
                                <Chip
                                    icon={<CheckCircleRounded sx={{fontSize: 14, color: '#fff !important'}}/>}
                                    label={`${enabledCount}/5 alerts active`}
                                    size="small"
                                    sx={{bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: '0.72rem', backdropFilter: 'blur(10px)'}}
                                />
                            </Stack>
                        </CardContent>
                    </Card>

                    {message && <Alert severity="success" onClose={() => dispatch(clearMessage())}>{message}</Alert>}
                    {error && <Alert severity="error" onClose={() => dispatch(clearError())}>{error}</Alert>}

                    {/* Tabs */}
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        sx={{
                            minHeight: 40,
                            '& .MuiTab-root': {minHeight: 40, fontWeight: 600, fontSize: '0.85rem', textTransform: 'none', px: 2},
                            '& .Mui-selected': {color: '#059669'},
                            '& .MuiTabs-indicator': {backgroundColor: '#059669', height: 2},
                        }}>
                        <Tab icon={<TuneRounded sx={{fontSize: 18}}/>} iconPosition="start" label="General"/>
                        <Tab icon={<PaymentRounded sx={{fontSize: 18}}/>} iconPosition="start" label="Payment"/>
                        <Tab icon={<LocalShippingRounded sx={{fontSize: 18}}/>} iconPosition="start" label="Shipping"/>
                        <Tab icon={<NotificationsRounded sx={{fontSize: 18}}/>} iconPosition="start" label="Notifications"/>
                        <Tab icon={<ShieldRounded sx={{fontSize: 18}}/>} iconPosition="start" label="Security"/>
                    </Tabs>

                    {/* General Tab */}
                    {tab === 0 && (
                        <Grid container spacing={2.5} component="form" onSubmit={profileFormik.handleSubmit}>
                            <Grid size={{xs: 12, md: 6}}>
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 2.5}}>
                                            <Box sx={{width: 34, height: 34, borderRadius: 1.5, background: '#10B98115', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <BusinessRounded sx={{fontSize: 18, color: '#10B981'}}/>
                                            </Box>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary'}}>Business Details</Typography>
                                        </Stack>
                                        <Stack spacing={2}>
                                            <TextField label="Company Name" {...fp(profileFormik, 'companyName')} {...adorn(BusinessRounded)}/>
                                            <TextField label="Email Address" type="email" {...fp(profileFormik, 'email')} {...adorn(EmailRounded)}/>
                                            <TextField label="Phone Number" {...fp(profileFormik, 'phone')} {...adorn(PhoneRounded)}/>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 2.5}}>
                                            <Box sx={{width: 34, height: 34, borderRadius: 1.5, background: '#3B82F615', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <LocationOnRounded sx={{fontSize: 18, color: '#3B82F6'}}/>
                                            </Box>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary'}}>Business Address</Typography>
                                        </Stack>
                                        <Stack spacing={2}>
                                            <TextField label="Street Address" {...fp(profileFormik, 'street')} {...adorn(LocationOnRounded)}/>
                                            <TextField label="City" {...fp(profileFormik, 'city')} {...adorn(LocationCityRounded)}/>
                                            <Stack direction="row" spacing={2}>
                                                <TextField label="Region" {...fp(profileFormik, 'region')} {...adorn(MapRounded)}/>
                                                <TextField label="Country" {...fp(profileFormik, 'country')} {...adorn(PinRounded)}/>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{xs: 12}}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button
                                        type="submit" variant="contained" disabled={loading}
                                        startIcon={loading ? <CircularProgress size={16} sx={{color: '#fff'}}/> : <SaveRounded/>}
                                        sx={{px: 4, py: 1}}>
                                        Save Changes
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}

                    {/* Payment Tab */}
                    {tab === 1 && (
                        <Stack spacing={2.5}>
                            {paymentMethods.map((pm, i) => {
                                const activeProvider = PROVIDERS.find(p => p.value === pm.provider);
                                return (
                                    <Card key={i}>
                                        <Box sx={{height: 4, background: activeProvider ? `linear-gradient(90deg, ${activeProvider.color}, ${activeProvider.color}60)` : 'transparent'}}/>
                                        <CardContent sx={{p: 3}}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2.5}}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Box sx={{width: 36, height: 36, borderRadius: 1.5, background: activeProvider ? `${activeProvider.color}12` : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                        <AccountBalanceWalletRounded sx={{fontSize: 18, color: activeProvider?.color || '#6B7280'}}/>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary'}}>
                                                            Payment Method {paymentMethods.length > 1 ? `#${i + 1}` : ''}
                                                        </Typography>
                                                        {i === 0 && <Typography sx={{fontSize: '0.65rem', color: 'secondary.main', fontWeight: 600}}>Primary method</Typography>}
                                                    </Box>
                                                </Stack>
                                                {paymentMethods.length > 1 && (
                                                    <IconButton size="small" onClick={() => removePaymentMethod(i)} sx={{color: 'text.secondary', '&:hover': {color: '#EF4444'}}}>
                                                        <DeleteRounded sx={{fontSize: 16}}/>
                                                    </IconButton>
                                                )}
                                            </Stack>

                                            <Typography sx={{fontSize: '0.72rem', fontWeight: 600, color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em'}}>Provider</Typography>
                                            <Grid container spacing={1.5} sx={{mb: 2.5}}>
                                                {PROVIDERS.map(p => {
                                                    const selected = pm.provider === p.value;
                                                    return (
                                                        <Grid key={p.value} size={{xs: 4}}>
                                                            <Box
                                                                onClick={() => updatePaymentMethod(i, 'provider', p.value)}
                                                                sx={{
                                                                    cursor: 'pointer', p: 2, borderRadius: 2, textAlign: 'center',
                                                                    border: '2px solid', borderColor: selected ? p.color : 'divider',
                                                                    background: selected ? `${p.color}08` : 'transparent',
                                                                    transition: 'all 0.15s',
                                                                    '&:hover': {borderColor: `${p.color}80`},
                                                                    position: 'relative',
                                                                }}>
                                                                {selected && <CheckCircleRounded sx={{position: 'absolute', top: 6, right: 6, fontSize: 14, color: p.color}}/>}
                                                                <Box sx={{width: 12, height: 12, borderRadius: '50%', bgcolor: p.color, mx: 'auto', mb: 0.8}}/>
                                                                <Typography sx={{fontWeight: 700, fontSize: '0.78rem', color: 'text.primary'}}>{p.label}</Typography>
                                                            </Box>
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>

                                            <Grid container spacing={2}>
                                                <Grid size={{xs: 12, sm: 6}}>
                                                    <TextField size="small" fullWidth label="Mobile Money Number" placeholder="0551234567"
                                                        value={pm.number} onChange={(e) => updatePaymentMethod(i, 'number', e.target.value)}
                                                        slotProps={{input: {startAdornment: <InputAdornment position="start"><PhoneRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                                </Grid>
                                                <Grid size={{xs: 12, sm: 6}}>
                                                    <TextField size="small" fullWidth label="Account Name" placeholder="Name on mobile money account"
                                                        value={pm.accountName} onChange={(e) => updatePaymentMethod(i, 'accountName', e.target.value)}
                                                        slotProps={{input: {startAdornment: <InputAdornment position="start"><StorefrontRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                            <Button onClick={addPaymentMethod} startIcon={<AddRounded/>} variant="outlined" fullWidth
                                sx={{py: 1.5, borderStyle: 'dashed', fontSize: '0.85rem'}}>
                                Add Another Payment Method
                            </Button>
                            <Stack direction="row" justifyContent="flex-end">
                                <Button variant="contained" onClick={savePaymentMethods} disabled={loading} startIcon={<SaveRounded/>} sx={{px: 4, py: 1}}>Save Payment Methods</Button>
                            </Stack>
                        </Stack>
                    )}

                    {/* Shipping Tab */}
                    {tab === 2 && (
                        <Stack spacing={2.5}>
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2.5}}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Box sx={{width: 34, height: 34, borderRadius: 1.5, background: '#0891B215', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <LocalShippingRounded sx={{fontSize: 18, color: '#0891B2'}}/>
                                            </Box>
                                            <Box>
                                                <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary'}}>Delivery Zones & Rates</Typography>
                                                <Typography sx={{fontSize: '0.72rem', color: 'text.secondary'}}>Set up where you deliver and the delivery fee for each zone</Typography>
                                            </Box>
                                        </Stack>
                                        <Button startIcon={<AddRounded/>} onClick={addDestination} size="small" sx={{fontSize: '0.78rem'}}>Add Zone</Button>
                                    </Stack>

                                    {destinations.length === 0 ? (
                                        <Box sx={{py: 6, textAlign: 'center'}}>
                                            <LocalShippingRounded sx={{fontSize: 40, color: 'text.secondary', opacity: 0.2, mb: 1}}/>
                                            <Typography sx={{color: 'text.secondary', fontSize: '0.85rem', mb: 2}}>No delivery zones configured yet</Typography>
                                            <Button startIcon={<AddRounded/>} onClick={addDestination} variant="outlined" size="small">Add your first delivery zone</Button>
                                        </Box>
                                    ) : (
                                        <Stack spacing={1.5}>
                                            {destinations.map((dest, i) => (
                                                <Stack key={i} direction="row" spacing={2} alignItems="center"
                                                    sx={{p: 2, borderRadius: 1.5, bgcolor: 'action.hover', '&:hover': {bgcolor: 'rgba(8,145,178,0.04)'}}}>
                                                    <Box sx={{width: 28, height: 28, borderRadius: 1, bgcolor: '#0891B212', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                                                        <LocationOnRounded sx={{fontSize: 16, color: '#0891B2'}}/>
                                                    </Box>
                                                    <TextField size="small" placeholder="e.g. Accra - East Legon" value={dest.name}
                                                        onChange={(e) => updateDestination(i, 'name', e.target.value)} sx={{flex: 1}}/>
                                                    <TextField size="small" type="number" placeholder="0.00" value={dest.price?.amount || ''}
                                                        onChange={(e) => updateDestination(i, 'price', e.target.value)} sx={{width: 140}}
                                                        slotProps={{input: {startAdornment: <InputAdornment position="start"><Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>GH₵</Typography></InputAdornment>}}}/>
                                                    <IconButton size="small" onClick={() => removeDestination(i)} sx={{color: '#EF4444'}}>
                                                        <DeleteRounded sx={{fontSize: 18}}/>
                                                    </IconButton>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    )}
                                </CardContent>
                            </Card>

                            {destinations.length > 0 && (
                                <Card sx={{background: 'rgba(8,145,178,0.03)'}}>
                                    <CardContent sx={{p: 3}}>
                                        <Typography sx={{fontWeight: 700, fontSize: '0.85rem', color: 'text.primary', mb: 1.5}}>Summary</Typography>
                                        <Stack spacing={1}>
                                            {destinations.filter(d => d.name).map((d, i) => (
                                                <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{py: 0.5}}>
                                                    <Typography sx={{fontSize: '0.82rem', color: 'text.primary'}}>{d.name}</Typography>
                                                    <Typography sx={{fontSize: '0.82rem', fontWeight: 700, color: '#059669'}}>
                                                        {d.price?.amount === 0 ? 'Free' : `GH₵ ${(d.price?.amount || 0).toFixed(2)}`}
                                                    </Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}

                            <Stack direction="row" justifyContent="flex-end">
                                <Button variant="contained" onClick={saveDestinations} disabled={loading} startIcon={<SaveRounded/>} sx={{px: 4, py: 1}}>Save Shipping Rates</Button>
                            </Stack>
                        </Stack>
                    )}

                    {/* Notifications Tab */}
                    {tab === 3 && (
                        <Stack spacing={2}>
                            <Grid container spacing={2}>
                                {NOTIF_ITEMS.map(item => {
                                    const Icon = item.icon;
                                    const checked = notifications[item.key];
                                    return (
                                        <Grid key={item.key} size={{xs: 12, sm: 6}}>
                                            <Card
                                                onClick={() => handleToggle(item.key)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderColor: checked ? `${item.color}40` : 'divider',
                                                    background: checked ? `${item.color}06` : 'transparent',
                                                    transition: 'all 0.2s',
                                                    '&:hover': {borderColor: `${item.color}60`}
                                                }}>
                                                <CardContent sx={{p: 2.5}}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{flex: 1}}>
                                                            <Box sx={{
                                                                width: 38, height: 38, borderRadius: 1.5,
                                                                background: checked ? `${item.color}15` : 'action.hover',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                transition: 'all 0.2s', flexShrink: 0
                                                            }}>
                                                                <Icon sx={{fontSize: 20, color: checked ? item.color : 'text.secondary', transition: 'color 0.2s'}}/>
                                                            </Box>
                                                            <Box sx={{flex: 1, minWidth: 0}}>
                                                                <Typography sx={{fontWeight: 700, fontSize: '0.88rem', color: 'text.primary', mb: 0.3}}>
                                                                    {item.label}
                                                                </Typography>
                                                                <Typography sx={{fontSize: '0.72rem', color: 'text.secondary', lineHeight: 1.4}}>
                                                                    {item.desc}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                        <Switch
                                                            checked={checked}
                                                            size="small"
                                                            sx={{
                                                                mt: -0.5,
                                                                '& .MuiSwitch-switchBase.Mui-checked': {color: item.color},
                                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {backgroundColor: item.color}
                                                            }}
                                                        />
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                            <Stack direction="row" justifyContent="flex-end">
                                <Button variant="contained" onClick={handleSaveNotifications} disabled={loading} startIcon={<SaveRounded/>} sx={{px: 4, py: 1}}>
                                    Save Preferences
                                </Button>
                            </Stack>
                        </Stack>
                    )}

                    {/* Security Tab */}
                    {tab === 4 && (
                        <Grid container spacing={2.5} component="form" onSubmit={securityFormik.handleSubmit}>
                            <Grid size={{xs: 12, md: 7}}>
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 2.5}}>
                                            <Box sx={{width: 34, height: 34, borderRadius: 1.5, background: '#EF444415', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <LockRounded sx={{fontSize: 18, color: '#EF4444'}}/>
                                            </Box>
                                            <Box>
                                                <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary'}}>Change Password</Typography>
                                                <Typography sx={{fontSize: '0.72rem', color: 'text.secondary'}}>Update your password to keep your account secure</Typography>
                                            </Box>
                                        </Stack>
                                        <Stack spacing={2}>
                                            <TextField
                                                label="Current Password"
                                                type={showPassword.current ? 'text' : 'password'}
                                                {...fp(securityFormik, 'currentPassword')}
                                                {...passAdorn('current')}
                                            />
                                            <Divider sx={{opacity: 0.5}}/>
                                            <TextField
                                                label="New Password"
                                                type={showPassword.new ? 'text' : 'password'}
                                                {...fp(securityFormik, 'newPassword')}
                                                {...passAdorn('new')}
                                            />
                                            <TextField
                                                label="Confirm New Password"
                                                type={showPassword.confirm ? 'text' : 'password'}
                                                {...fp(securityFormik, 'confirmPassword')}
                                                {...passAdorn('confirm')}
                                            />
                                        </Stack>
                                        <Box sx={{mt: 3, display: 'flex', justifyContent: 'flex-end'}}>
                                            <Button type="submit" variant="contained" color="error" disabled={loading} startIcon={<ShieldRounded/>} sx={{px: 4, py: 1}}>
                                                Update Password
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{xs: 12, md: 5}}>
                                <Card sx={{background: 'rgba(239,68,68,0.03)'}}>
                                    <CardContent sx={{p: 3}}>
                                        <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary', mb: 2}}>Password Requirements</Typography>
                                        <Stack spacing={1.5}>
                                            {[
                                                'At least 8 characters long',
                                                'Contains uppercase and lowercase letters',
                                                'Includes at least one number',
                                                'Has at least one special character',
                                            ].map((req, i) => (
                                                <Stack key={i} direction="row" spacing={1} alignItems="center">
                                                    <CheckCircleRounded sx={{fontSize: 16, color: 'text.secondary', opacity: 0.4}}/>
                                                    <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>{req}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                        <Divider sx={{my: 2}}/>
                                        <Typography sx={{fontSize: '0.72rem', color: 'text.secondary', lineHeight: 1.5}}>
                                            For security, you'll be asked to re-login after changing your password. Make sure to save your new password in a safe place.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </Stack>
            </Container>
        </Layout>
    );
};

export default SettingsPage;
