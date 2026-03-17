import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {Link} from "react-router-dom";
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
    Container,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    Switch,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import {
    ArrowBack,
    StorefrontRounded,
    EditRounded,
    PhoneRounded,
    EmailRounded,
    DescriptionRounded,
    AccessTimeRounded,
    BadgeRounded,
    SaveRounded,
    AddRounded,
    DeleteRounded,
    LocalShippingRounded,
    PaymentRounded,
    SettingsRounded,
    InventoryRounded,
    LocationOnRounded,
    AttachMoneyRounded,
    CheckCircleRounded,
    SpaRounded,
    StarRounded,
} from "@mui/icons-material";
import Layout from "../../components/layout/layout";
import {getShop, updateShop, selectShops, clearShop} from "../../redux/features/shops/shops-slice";
import {getProducts, selectProducts} from "../../redux/features/products/products-slice";
import {DetailSkeleton} from "../../components/shared/page-skeleton";

const PROVIDERS = [
    {value: 'mtn', label: 'MTN Mobile Money', color: '#FFCC00'},
    {value: 'vodafone', label: 'Vodafone Cash', color: '#E60000'},
    {value: 'airtelTigo', label: 'AirtelTigo Money', color: '#E40046'},
];

const fmtGHS = (v) => `GH₵ ${(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

const SectionHeader = ({icon: Icon, title, subtitle, color = '#10B981', action}) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2.5}}>
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{width: 36, height: 36, borderRadius: 1.5, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon sx={{fontSize: 18, color}}/>
            </Box>
            <Box>
                <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary'}}>{title}</Typography>
                {subtitle && <Typography sx={{fontSize: '0.72rem', color: 'text.secondary'}}>{subtitle}</Typography>}
            </Box>
        </Stack>
        {action}
    </Stack>
);

const ShopManagePage = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {shop, loading: shopLoading} = useSelector(selectShops);
    const {products} = useSelector(selectProducts);
    const [tab, setTab] = useState(0);
    const [destinations, setDestinations] = useState([]);
    const [saveMsg, setSaveMsg] = useState('');

    useEffect(() => {
        dispatch(getShop(id));
        dispatch(getProducts());
        return () => dispatch(clearShop());
    }, [dispatch, id]);

    useEffect(() => {
        if (shop?.destinations) setDestinations(shop.destinations);
    }, [shop]);

    const shopProducts = products.filter(p => p.shop?._id === id);

    // Shop Details Form
    const detailsFormik = useFormik({
        initialValues: {
            name: shop?.name || '',
            description: shop?.description || '',
            phone: shop?.contact?.phone || '',
            email: shop?.contact?.email || '',
            openTime: shop?.operatingHours?.open || '09:00',
            closeTime: shop?.operatingHours?.close || '21:00',
            license: shop?.license || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            description: Yup.string().required('Required'),
            phone: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
        }),
        onSubmit: async (values) => {
            await dispatch(updateShop({
                id, data: {
                    name: values.name,
                    description: values.description,
                    contact: {phone: values.phone, email: values.email},
                    operatingHours: {open: values.openTime, close: values.closeTime},
                    license: values.license,
                }
            }));
            setSaveMsg('Shop details saved');
            setTimeout(() => setSaveMsg(''), 3000);
        },
    });

    // Payment Form
    const paymentFormik = useFormik({
        initialValues: {
            provider: shop?.paymentDetails?.provider || 'mtn',
            number: shop?.paymentDetails?.number || '',
            accountName: shop?.paymentDetails?.accountName || '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            provider: Yup.string().required('Required'),
            number: Yup.string().required('Required'),
            accountName: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            await dispatch(updateShop({id, data: {paymentDetails: values}}));
            setSaveMsg('Payment details saved');
            setTimeout(() => setSaveMsg(''), 3000);
        },
    });

    // Destination handlers
    const addDestination = () => setDestinations([...destinations, {name: '', price: {amount: 0, currency: 'GHS'}}]);
    const removeDestination = (index) => setDestinations(destinations.filter((_, i) => i !== index));
    const updateDestination = (index, field, value) => {
        const updated = [...destinations];
        if (field === 'name') updated[index] = {...updated[index], name: value};
        else updated[index] = {...updated[index], price: {...updated[index].price, amount: parseFloat(value) || 0}};
        setDestinations(updated);
    };
    const saveDestinations = async () => {
        await dispatch(updateShop({id, data: {destinations}}));
        setSaveMsg('Shipping rates saved');
        setTimeout(() => setSaveMsg(''), 3000);
    };

    const fp = (formik, name) => ({
        fullWidth: true, size: 'small', name,
        value: formik.values[name],
        onChange: formik.handleChange, onBlur: formik.handleBlur,
        error: formik.touched[name] && Boolean(formik.errors[name]),
        helperText: formik.touched[name] && formik.errors[name],
    });

    if (shopLoading && !shop) {
        return <Layout><Container maxWidth="lg"><DetailSkeleton/></Container></Layout>;
    }

    if (!shop) {
        return (
            <Layout><Container maxWidth="lg">
                <Stack alignItems="center" spacing={2} sx={{py: 10}}>
                    <StorefrontRounded sx={{fontSize: 48, color: 'text.secondary', opacity: 0.3}}/>
                    <Typography sx={{color: 'text.secondary'}}>Shop not found</Typography>
                    <Button onClick={() => navigate('/shops')} variant="outlined" size="small">Back to Shops</Button>
                </Stack>
            </Container></Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="lg">
                <Stack spacing={2.5}>
                    {/* Back */}
                    <Button startIcon={<ArrowBack sx={{fontSize: 16}}/>} onClick={() => navigate(`/shops/${id}`)}
                        sx={{alignSelf: 'flex-start', color: 'text.secondary', '&:hover': {color: 'primary.main', bgcolor: 'transparent'}}}>
                        Back to Shop
                    </Button>

                    {/* Header */}
                    <Card sx={{border: 'none', overflow: 'hidden', background: 'linear-gradient(135deg, #064E3B 0%, #059669 50%, #10B981 100%)', color: '#fff'}}>
                        <Box sx={{position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                        <CardContent sx={{p: 3, position: 'relative'}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{width: 50, height: 50, bgcolor: 'rgba(255,255,255,0.15)', fontWeight: 800, fontSize: '1.3rem'}}>
                                        {shop.name?.[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.3rem'}}>{shop.name}</Typography>
                                        <Typography sx={{fontSize: '0.82rem', opacity: 0.8}}>Manage your dispensary settings</Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <Box sx={{textAlign: 'center'}}>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.1rem'}}>{shop.totalProducts || 0}</Typography>
                                        <Typography sx={{fontSize: '0.65rem', opacity: 0.7}}>Products</Typography>
                                    </Box>
                                    <Box sx={{textAlign: 'center'}}>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.1rem'}}>{shop.totalOrders || 0}</Typography>
                                        <Typography sx={{fontSize: '0.65rem', opacity: 0.7}}>Orders</Typography>
                                    </Box>
                                    <Box sx={{textAlign: 'center'}}>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.1rem'}}>{fmtGHS(shop.revenue)}</Typography>
                                        <Typography sx={{fontSize: '0.65rem', opacity: 0.7}}>Revenue</Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    {saveMsg && <Alert severity="success" sx={{borderRadius: 1}}>{saveMsg}</Alert>}

                    {/* Tabs */}
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
                        minHeight: 40,
                        '& .MuiTab-root': {minHeight: 40, fontWeight: 600, fontSize: '0.82rem', textTransform: 'none', px: 2},
                        '& .Mui-selected': {color: '#059669'},
                        '& .MuiTabs-indicator': {backgroundColor: '#059669', height: 2},
                    }}>
                        <Tab icon={<EditRounded sx={{fontSize: 16}}/>} iconPosition="start" label="Details"/>
                        <Tab icon={<PaymentRounded sx={{fontSize: 16}}/>} iconPosition="start" label="Payment"/>
                        <Tab icon={<LocalShippingRounded sx={{fontSize: 16}}/>} iconPosition="start" label="Shipping"/>
                        <Tab icon={<InventoryRounded sx={{fontSize: 16}}/>} iconPosition="start" label="Products"/>
                    </Tabs>

                    {/* ========== DETAILS TAB ========== */}
                    {tab === 0 && (
                        <Grid container spacing={2.5} component="form" onSubmit={detailsFormik.handleSubmit}>
                            <Grid size={{xs: 12, md: 7}}>
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <SectionHeader icon={StorefrontRounded} title="Shop Information" subtitle="Basic details about your dispensary"/>
                                        <Stack spacing={2}>
                                            <TextField label="Shop Name" {...fp(detailsFormik, 'name')}
                                                slotProps={{input: {startAdornment: <InputAdornment position="start"><StorefrontRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                            <TextField label="Description" multiline rows={3} {...fp(detailsFormik, 'description')}
                                                slotProps={{input: {startAdornment: <InputAdornment position="start"><DescriptionRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                            <Grid container spacing={2}>
                                                <Grid size={{xs: 12, sm: 6}}>
                                                    <TextField label="Phone" {...fp(detailsFormik, 'phone')}
                                                        slotProps={{input: {startAdornment: <InputAdornment position="start"><PhoneRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                                </Grid>
                                                <Grid size={{xs: 12, sm: 6}}>
                                                    <TextField label="Email" {...fp(detailsFormik, 'email')}
                                                        slotProps={{input: {startAdornment: <InputAdornment position="start"><EmailRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                                </Grid>
                                            </Grid>
                                            <TextField label="License Number" {...fp(detailsFormik, 'license')}
                                                slotProps={{input: {startAdornment: <InputAdornment position="start"><BadgeRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{xs: 12, md: 5}}>
                                <Stack spacing={2.5}>
                                    <Card>
                                        <CardContent sx={{p: 3}}>
                                            <SectionHeader icon={AccessTimeRounded} title="Operating Hours" subtitle="When your shop is open" color="#3B82F6"/>
                                            <Grid container spacing={2}>
                                                <Grid size={{xs: 6}}>
                                                    <TextField label="Opens" type="time" {...fp(detailsFormik, 'openTime')} slotProps={{inputLabel: {shrink: true}}}/>
                                                </Grid>
                                                <Grid size={{xs: 6}}>
                                                    <TextField label="Closes" type="time" {...fp(detailsFormik, 'closeTime')} slotProps={{inputLabel: {shrink: true}}}/>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                    <Card sx={{background: 'rgba(16,185,129,0.04)'}}>
                                        <CardContent sx={{p: 3}}>
                                            <SectionHeader icon={StarRounded} title="Shop Rating" color="#F59E0B"/>
                                            <Stack direction="row" spacing={3} alignItems="center">
                                                <Box sx={{textAlign: 'center'}}>
                                                    <Typography sx={{fontWeight: 800, fontSize: '2rem', color: '#F59E0B'}}>{shop.rating?.average || 0}</Typography>
                                                    <Typography sx={{fontSize: '0.72rem', color: 'text.secondary'}}>{shop.rating?.count || 0} reviews</Typography>
                                                </Box>
                                                <Stack spacing={0.5} sx={{flex: 1}}>
                                                    {[5,4,3,2,1].map(star => {
                                                        const count = shop.rating?.details?.[star] || 0;
                                                        const total = shop.rating?.count || 1;
                                                        const pct = (count / total) * 100;
                                                        return (
                                                            <Stack key={star} direction="row" spacing={1} alignItems="center">
                                                                <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', width: 10}}>{star}</Typography>
                                                                <Box sx={{flex: 1, height: 4, borderRadius: 2, bgcolor: 'action.hover', overflow: 'hidden'}}>
                                                                    <Box sx={{height: '100%', width: `${pct}%`, bgcolor: '#F59E0B', borderRadius: 2}}/>
                                                                </Box>
                                                                <Typography sx={{fontSize: '0.62rem', color: 'text.secondary', width: 20}}>{count}</Typography>
                                                            </Stack>
                                                        );
                                                    })}
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Grid>
                            <Grid size={{xs: 12}}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button type="submit" variant="contained" startIcon={<SaveRounded/>} sx={{px: 4}}>Save Details</Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}

                    {/* ========== PAYMENT TAB ========== */}
                    {tab === 1 && (
                        <Grid container spacing={2.5} component="form" onSubmit={paymentFormik.handleSubmit}>
                            <Grid size={{xs: 12, md: 7}}>
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <SectionHeader icon={PaymentRounded} title="Payment Configuration" subtitle="Set up how you receive payments" color="#8B5CF6"/>
                                        <Stack spacing={2.5}>
                                            <Box>
                                                <Typography sx={{fontSize: '0.78rem', fontWeight: 600, color: 'text.secondary', mb: 1}}>Mobile Money Provider</Typography>
                                                <Stack direction="row" spacing={1.5}>
                                                    {PROVIDERS.map(p => (
                                                        <Card
                                                            key={p.value}
                                                            onClick={() => paymentFormik.setFieldValue('provider', p.value)}
                                                            sx={{
                                                                flex: 1, cursor: 'pointer',
                                                                borderColor: paymentFormik.values.provider === p.value ? `${p.color}80` : 'divider',
                                                                background: paymentFormik.values.provider === p.value ? `${p.color}08` : 'transparent',
                                                                transition: 'all 0.2s', '&:hover': {borderColor: `${p.color}60`}
                                                            }}>
                                                            <CardContent sx={{p: 2, textAlign: 'center', '&:last-child': {pb: 2}}}>
                                                                <Box sx={{width: 12, height: 12, borderRadius: '50%', bgcolor: p.color, mx: 'auto', mb: 1}}/>
                                                                <Typography sx={{fontWeight: 700, fontSize: '0.78rem', color: 'text.primary'}}>{p.label}</Typography>
                                                                {paymentFormik.values.provider === p.value && (
                                                                    <CheckCircleRounded sx={{fontSize: 16, color: p.color, mt: 0.5}}/>
                                                                )}
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </Stack>
                                            </Box>
                                            <TextField label="Mobile Money Number" placeholder="0551234567" {...fp(paymentFormik, 'number')}
                                                slotProps={{input: {startAdornment: <InputAdornment position="start"><PhoneRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                            <TextField label="Account Name" placeholder="Name on mobile money account" {...fp(paymentFormik, 'accountName')}
                                                slotProps={{input: {startAdornment: <InputAdornment position="start"><StorefrontRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{xs: 12, md: 5}}>
                                <Card sx={{background: 'rgba(139,92,246,0.04)'}}>
                                    <CardContent sx={{p: 3}}>
                                        <SectionHeader icon={PaymentRounded} title="How it works" color="#8B5CF6"/>
                                        <Stack spacing={2}>
                                            {[
                                                {step: '1', text: 'Customer places an order and pays via mobile money'},
                                                {step: '2', text: 'Payment is verified and held securely'},
                                                {step: '3', text: 'You fulfill the order and update the status'},
                                                {step: '4', text: 'Funds are released to your mobile money account'},
                                            ].map(item => (
                                                <Stack key={item.step} direction="row" spacing={1.5} alignItems="flex-start">
                                                    <Avatar sx={{width: 24, height: 24, bgcolor: '#8B5CF615', color: '#8B5CF6', fontSize: '0.7rem', fontWeight: 800}}>
                                                        {item.step}
                                                    </Avatar>
                                                    <Typography sx={{fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.5}}>{item.text}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{xs: 12}}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button type="submit" variant="contained" startIcon={<SaveRounded/>} sx={{px: 4}}>Save Payment Details</Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}

                    {/* ========== SHIPPING TAB ========== */}
                    {tab === 2 && (
                        <Stack spacing={2.5}>
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <SectionHeader
                                        icon={LocalShippingRounded}
                                        title="Delivery Destinations"
                                        subtitle="Configure where you deliver and at what price"
                                        color="#0891B2"
                                        action={
                                            <Button startIcon={<AddRounded/>} onClick={addDestination} size="small"
                                                sx={{fontSize: '0.78rem'}}>
                                                Add Zone
                                            </Button>
                                        }
                                    />

                                    {destinations.length === 0 ? (
                                        <Box sx={{py: 6, textAlign: 'center'}}>
                                            <LocalShippingRounded sx={{fontSize: 40, color: 'text.secondary', opacity: 0.2, mb: 1}}/>
                                            <Typography sx={{color: 'text.secondary', fontSize: '0.85rem', mb: 2}}>No delivery zones configured</Typography>
                                            <Button startIcon={<AddRounded/>} onClick={addDestination} variant="outlined" size="small">
                                                Add your first delivery zone
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Stack spacing={1.5}>
                                            {destinations.map((dest, i) => (
                                                <Stack key={i} direction="row" spacing={2} alignItems="center"
                                                    sx={{p: 2, borderRadius: 1.5, bgcolor: 'action.hover', '&:hover': {bgcolor: 'rgba(8,145,178,0.04)'}}}>
                                                    <Box sx={{width: 28, height: 28, borderRadius: 1, bgcolor: '#0891B212', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                        <LocationOnRounded sx={{fontSize: 16, color: '#0891B2'}}/>
                                                    </Box>
                                                    <TextField
                                                        size="small" placeholder="e.g. Accra - East Legon"
                                                        value={dest.name} onChange={(e) => updateDestination(i, 'name', e.target.value)}
                                                        sx={{flex: 1}}
                                                    />
                                                    <TextField
                                                        size="small" type="number" placeholder="0.00"
                                                        value={dest.price?.amount || ''}
                                                        onChange={(e) => updateDestination(i, 'price', e.target.value)}
                                                        sx={{width: 140}}
                                                        slotProps={{input: {startAdornment: <InputAdornment position="start"><Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>GH₵</Typography></InputAdornment>}}}
                                                    />
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
                                <>
                                    <Card>
                                        <CardContent sx={{p: 3}}>
                                            <SectionHeader icon={LocationOnRounded} title="Shipping Summary" color="#059669"/>
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{fontWeight: 600, fontSize: '0.72rem', color: 'text.secondary', textTransform: 'uppercase'}}>Destination</TableCell>
                                                            <TableCell align="right" sx={{fontWeight: 600, fontSize: '0.72rem', color: 'text.secondary', textTransform: 'uppercase'}}>Delivery Fee</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {destinations.map((d, i) => (
                                                            <TableRow key={i} sx={{'&:last-child td': {border: 0}}}>
                                                                <TableCell sx={{fontWeight: 500, fontSize: '0.85rem'}}>{d.name || '(unnamed)'}</TableCell>
                                                                <TableCell align="right" sx={{fontWeight: 700, fontSize: '0.85rem', color: '#059669'}}>
                                                                    {d.price?.amount === 0 ? 'Free' : fmtGHS(d.price?.amount)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                    <Stack direction="row" justifyContent="flex-end">
                                        <Button variant="contained" startIcon={<SaveRounded/>} onClick={saveDestinations} sx={{px: 4}}>
                                            Save Shipping Rates
                                        </Button>
                                    </Stack>
                                </>
                            )}
                        </Stack>
                    )}

                    {/* ========== PRODUCTS TAB ========== */}
                    {tab === 3 && (
                        <Stack spacing={2.5}>
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <SectionHeader
                                        icon={InventoryRounded}
                                        title={`Products (${shopProducts.length})`}
                                        subtitle="Products listed in this shop"
                                        color="#10B981"
                                        action={
                                            <Button component={Link} to="/products/new" startIcon={<AddRounded/>} size="small" variant="contained"
                                                sx={{fontSize: '0.78rem'}}>
                                                Add Product
                                            </Button>
                                        }
                                    />

                                    {shopProducts.length === 0 ? (
                                        <Box sx={{py: 6, textAlign: 'center'}}>
                                            <SpaRounded sx={{fontSize: 40, color: 'text.secondary', opacity: 0.2, mb: 1}}/>
                                            <Typography sx={{color: 'text.secondary', fontSize: '0.85rem', mb: 2}}>No products in this shop yet</Typography>
                                            <Button component={Link} to="/products/new" startIcon={<AddRounded/>} variant="outlined" size="small">
                                                Add your first product
                                            </Button>
                                        </Box>
                                    ) : (
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        {['Product', 'Variant', 'Price', 'Stock', 'Status'].map(h => (
                                                            <TableCell key={h} sx={{fontWeight: 600, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em'}}>
                                                                {h}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {shopProducts.map(p => (
                                                        <TableRow key={p._id} hover sx={{cursor: 'pointer', '&:last-child td': {border: 0}}}
                                                            onClick={() => navigate(`/products/${p._id}`)}>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                                    <Avatar sx={{width: 32, height: 32, borderRadius: 1, bgcolor: '#10B98112', color: '#10B981', fontSize: '0.72rem', fontWeight: 700}}>
                                                                        {p.name?.[0]}
                                                                    </Avatar>
                                                                    <Typography sx={{fontWeight: 600, fontSize: '0.85rem'}}>{p.name}</Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip label={p.variant} size="small" sx={{height: 22, fontSize: '0.68rem', fontWeight: 600, textTransform: 'capitalize'}}/>
                                                            </TableCell>
                                                            <TableCell sx={{fontWeight: 700, fontSize: '0.85rem'}}>{fmtGHS(p.price?.amount)}</TableCell>
                                                            <TableCell sx={{fontSize: '0.85rem'}}>{p.stock?.quantity ?? 0}</TableCell>
                                                            <TableCell>
                                                                <Box sx={{
                                                                    display: 'inline-block', px: 1, py: 0.3, borderRadius: 1,
                                                                    fontSize: '0.68rem', fontWeight: 700, textTransform: 'capitalize',
                                                                    bgcolor: p.status === 'active' ? '#D1FAE5' : '#FEF3C7',
                                                                    color: p.status === 'active' ? '#065F46' : '#92400E',
                                                                }}>{p.status}</Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </Stack>
                    )}
                </Stack>
            </Container>
        </Layout>
    );
};

export default ShopManagePage;
