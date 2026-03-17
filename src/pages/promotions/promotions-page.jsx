import {useEffect, useState} from "react";
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
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    InputAdornment,
    MenuItem,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import {
    CampaignRounded,
    AddRounded,
    StorefrontRounded,
    LocalFloristRounded,
    AttachMoneyRounded,
    CalendarMonthRounded,
    StarRounded,
    AccessTimeRounded,
    CheckCircleRounded,
    HourglassEmptyRounded,
} from "@mui/icons-material";
import Layout from "../../components/layout/layout";
import {getProducts, selectProducts} from "../../redux/features/products/products-slice";
import {getShops, selectShops} from "../../redux/features/shops/shops-slice";
import {PROMOTIONS_API} from "../../api/promotions";

const fmtGHS = (v) => `GH₵ ${(Number(v) || 0).toFixed(2)}`;

const STATUS_STYLES = {
    pending: {bg: '#FEF3C7', text: '#92400E'},
    active: {bg: '#D1FAE5', text: '#065F46'},
    expired: {bg: '#F3F4F6', text: '#6B7280'},
};

const PromotionsPage = () => {
    const dispatch = useDispatch();
    const {products} = useSelector(selectProducts);
    const {shops} = useSelector(selectShops);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tab, setTab] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        dispatch(getProducts());
        dispatch(getShops());
        fetchPromotions();
    }, [dispatch]);

    const fetchPromotions = async () => {
        setLoading(true);
        try {
            const {data} = await PROMOTIONS_API.getAll();
            setPromotions(data.data || data || []);
        } catch (e) {
            setPromotions([]);
        }
        setLoading(false);
    };

    const formik = useFormik({
        initialValues: {
            variant: 'product',
            itemId: '',
            rank: 1,
            priceAmount: '',
            durationAmount: 7,
            durationUnit: 'day',
        },
        validationSchema: Yup.object({
            itemId: Yup.string().required('Select an item to promote'),
            priceAmount: Yup.number().required('Price is required').positive('Must be positive'),
            rank: Yup.number().required('Rank is required').min(1).max(100),
        }),
        onSubmit: async (values, {resetForm}) => {
            setError('');
            setMessage('');
            const startDate = new Date().toISOString();
            const endDate = new Date(Date.now() + values.durationAmount * (values.durationUnit === 'day' ? 86400000 : values.durationUnit === 'month' ? 2592000000 : 31536000000)).toISOString();

            const payload = {
                variant: values.variant,
                item: values.variant === 'product' ? {product: values.itemId} : {shop: values.itemId},
                rank: values.rank,
                price: {amount: parseFloat(values.priceAmount), currency: 'GHS'},
                startDate,
                endDate,
                duration: {amount: values.durationAmount, unit: values.durationUnit},
            };

            try {
                await PROMOTIONS_API.create(payload);
                setMessage('Promotion request submitted! Payment will be processed via mobile money.');
                resetForm();
                setDialogOpen(false);
                fetchPromotions();
            } catch (e) {
                setError(e.response?.data?.message || 'Failed to create promotion');
            }
        },
    });

    const promoList = Array.isArray(promotions) ? promotions : [];
    const filtered = tab === 0 ? promoList : promoList.filter(p => {
        if (tab === 1) return p.status === 'active';
        if (tab === 2) return p.status === 'pending';
        return p.status === 'expired';
    });

    return (
        <Layout>
            <Container maxWidth="xl">
                <Stack spacing={2.5}>
                    {/* Header */}
                    <Card sx={{border: 'none', overflow: 'hidden', background: 'linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%)', color: '#fff'}}>
                        <Box sx={{position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                        <CardContent sx={{p: 3, position: 'relative'}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{width: 46, height: 46, bgcolor: 'rgba(255,255,255,0.15)'}}>
                                        <CampaignRounded sx={{fontSize: 24}}/>
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.3rem'}}>Promotions</Typography>
                                        <Typography sx={{fontSize: '0.82rem', opacity: 0.8}}>Boost your products and shops with paid promotions</Typography>
                                    </Box>
                                </Stack>
                                <Button onClick={() => setDialogOpen(true)} startIcon={<AddRounded/>} variant="contained"
                                    sx={{bgcolor: 'rgba(255,255,255,0.2)', '&:hover': {bgcolor: 'rgba(255,255,255,0.3)'}}}>
                                    New Promotion
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    {message && <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>}
                    {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

                    {/* Stats */}
                    <Stack direction="row" spacing={2} sx={{flexWrap: 'wrap', gap: 2}}>
                        {[
                            {label: 'Total', value: promoList.length, color: '#F59E0B'},
                            {label: 'Active', value: promoList.filter(p => p.status === 'active').length, color: '#10B981'},
                            {label: 'Pending', value: promoList.filter(p => p.status === 'pending').length, color: '#F59E0B'},
                            {label: 'Expired', value: promoList.filter(p => p.status === 'expired').length, color: '#6B7280'},
                        ].map(s => (
                            <Card key={s.label} sx={{flex: 1, minWidth: 0, border: 'none', background: `${s.color}08`}}>
                                <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                                    <Typography sx={{fontSize: '1.1rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.2}}>{s.value}</Typography>
                                    <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', fontWeight: 500}}>{s.label}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>

                    {/* Tabs */}
                    <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{
                        minHeight: 36,
                        '& .MuiTab-root': {minHeight: 36, fontWeight: 600, fontSize: '0.82rem', textTransform: 'none'},
                        '& .Mui-selected': {color: '#B45309'},
                        '& .MuiTabs-indicator': {backgroundColor: '#B45309'},
                    }}>
                        <Tab label="All"/>
                        <Tab label="Active"/>
                        <Tab label="Pending"/>
                        <Tab label="Expired"/>
                    </Tabs>

                    {/* Promotions List */}
                    {filtered.length === 0 ? (
                        <Box sx={{textAlign: 'center', py: 10}}>
                            <CampaignRounded sx={{fontSize: 48, color: 'text.secondary', opacity: 0.15, mb: 1}}/>
                            <Typography sx={{fontWeight: 700, color: 'text.primary', mb: 1}}>No promotions yet</Typography>
                            <Typography sx={{color: 'text.secondary', fontSize: '0.85rem', mb: 2}}>Create a promotion to boost visibility of your products or shops</Typography>
                            <Button onClick={() => setDialogOpen(true)} variant="outlined" startIcon={<AddRounded/>} sx={{borderColor: '#B45309', color: '#B45309'}}>Create Promotion</Button>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {filtered.map((promo, i) => {
                                const style = STATUS_STYLES[promo.status] || STATUS_STYLES.pending;
                                const itemName = promo.variant === 'product'
                                    ? promo.item?.product?.name || 'Product'
                                    : promo.item?.shop?.name || 'Shop';
                                return (
                                    <Grid key={promo._id || i} size={{xs: 12, sm: 6, lg: 4}}>
                                        <Card>
                                            <CardContent sx={{p: 2.5}}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{mb: 2}}>
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Box sx={{width: 36, height: 36, borderRadius: 1.5, bgcolor: promo.variant === 'product' ? '#10B98112' : '#3B82F612', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                            {promo.variant === 'product' ? <LocalFloristRounded sx={{fontSize: 18, color: '#10B981'}}/> : <StorefrontRounded sx={{fontSize: 18, color: '#3B82F6'}}/>}
                                                        </Box>
                                                        <Box>
                                                            <Typography sx={{fontWeight: 700, fontSize: '0.88rem', color: 'text.primary'}}>{itemName}</Typography>
                                                            <Typography sx={{fontSize: '0.7rem', color: 'text.secondary', textTransform: 'capitalize'}}>{promo.variant} promotion</Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Box sx={{px: 1, py: 0.3, borderRadius: 1, fontSize: '0.65rem', fontWeight: 700, bgcolor: style.bg, color: style.text, textTransform: 'capitalize'}}>
                                                        {promo.status}
                                                    </Box>
                                                </Stack>
                                                <Divider sx={{mb: 1.5}}/>
                                                <Stack spacing={1}>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>Price Paid</Typography>
                                                        <Typography sx={{fontSize: '0.78rem', fontWeight: 700, color: 'text.primary'}}>{fmtGHS(promo.price?.amount)}</Typography>
                                                    </Stack>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>Rank</Typography>
                                                        <Typography sx={{fontSize: '0.78rem', fontWeight: 700, color: '#F59E0B'}}>#{promo.rank}</Typography>
                                                    </Stack>
                                                    <Stack direction="row" justifyContent="space-between">
                                                        <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>Duration</Typography>
                                                        <Typography sx={{fontSize: '0.78rem', fontWeight: 600, color: 'text.primary'}}>{promo.duration?.amount} {promo.duration?.unit}(s)</Typography>
                                                    </Stack>
                                                    {promo.startDate && (
                                                        <Stack direction="row" justifyContent="space-between">
                                                            <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>Period</Typography>
                                                            <Typography sx={{fontSize: '0.72rem', color: 'text.secondary'}}>
                                                                {new Date(promo.startDate).toLocaleDateString()} — {new Date(promo.endDate).toLocaleDateString()}
                                                            </Typography>
                                                        </Stack>
                                                    )}
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}

                    {/* Create Promotion Dialog */}
                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{sx: {borderRadius: 2}}}>
                        <DialogTitle sx={{fontWeight: 700}}>Create Promotion</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2.5} sx={{pt: 1}}>
                                {/* Type Selection */}
                                <Box>
                                    <Typography sx={{fontSize: '0.78rem', fontWeight: 600, color: 'text.secondary', mb: 1}}>What do you want to promote?</Typography>
                                    <Stack direction="row" spacing={1.5}>
                                        {[
                                            {value: 'product', label: 'Product', icon: LocalFloristRounded, color: '#10B981'},
                                            {value: 'shop', label: 'Shop', icon: StorefrontRounded, color: '#3B82F6'},
                                        ].map(opt => (
                                            <Card key={opt.value} onClick={() => formik.setFieldValue('variant', opt.value)}
                                                sx={{flex: 1, cursor: 'pointer', borderColor: formik.values.variant === opt.value ? `${opt.color}80` : 'divider', background: formik.values.variant === opt.value ? `${opt.color}08` : 'transparent', transition: 'all 0.2s'}}>
                                                <CardContent sx={{p: 2, textAlign: 'center', '&:last-child': {pb: 2}}}>
                                                    <opt.icon sx={{fontSize: 24, color: opt.color, mb: 0.5}}/>
                                                    <Typography sx={{fontWeight: 700, fontSize: '0.82rem'}}>{opt.label}</Typography>
                                                    {formik.values.variant === opt.value && <CheckCircleRounded sx={{fontSize: 16, color: opt.color, mt: 0.3}}/>}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Stack>
                                </Box>

                                {/* Item Selection */}
                                <FormControl fullWidth size="small">
                                    <Typography sx={{fontSize: '0.78rem', fontWeight: 600, color: 'text.secondary', mb: 0.5}}>
                                        Select {formik.values.variant === 'product' ? 'Product' : 'Shop'}
                                    </Typography>
                                    <Select value={formik.values.itemId} onChange={(e) => formik.setFieldValue('itemId', e.target.value)} displayEmpty>
                                        <MenuItem value="" disabled>Choose...</MenuItem>
                                        {formik.values.variant === 'product'
                                            ? (products || []).map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)
                                            : (shops || []).map(s => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)
                                        }
                                    </Select>
                                    {formik.touched.itemId && formik.errors.itemId && <Typography sx={{fontSize: '0.72rem', color: '#EF4444', mt: 0.5}}>{formik.errors.itemId}</Typography>}
                                </FormControl>

                                {/* Rank */}
                                <TextField size="small" fullWidth label="Promotion Rank" type="number" placeholder="1-100 (higher = more visible)"
                                    name="rank" value={formik.values.rank} onChange={formik.handleChange}
                                    slotProps={{input: {startAdornment: <InputAdornment position="start"><StarRounded sx={{fontSize: 18, color: '#F59E0B'}}/></InputAdornment>}}}/>

                                {/* Price */}
                                <TextField size="small" fullWidth label="Promotion Price (GHS)" type="number" placeholder="Amount to pay"
                                    name="priceAmount" value={formik.values.priceAmount} onChange={formik.handleChange}
                                    error={formik.touched.priceAmount && Boolean(formik.errors.priceAmount)}
                                    helperText={formik.touched.priceAmount && formik.errors.priceAmount}
                                    slotProps={{input: {startAdornment: <InputAdornment position="start"><Typography sx={{fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary'}}>GH₵</Typography></InputAdornment>}}}/>

                                {/* Duration */}
                                <Stack direction="row" spacing={2}>
                                    <TextField size="small" fullWidth label="Duration" type="number" name="durationAmount"
                                        value={formik.values.durationAmount} onChange={formik.handleChange}
                                        slotProps={{input: {startAdornment: <InputAdornment position="start"><AccessTimeRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>}}}/>
                                    <FormControl size="small" sx={{minWidth: 120}}>
                                        <Select value={formik.values.durationUnit} onChange={(e) => formik.setFieldValue('durationUnit', e.target.value)}>
                                            <MenuItem value="day">Days</MenuItem>
                                            <MenuItem value="month">Months</MenuItem>
                                            <MenuItem value="year">Years</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Stack>

                                <Alert severity="info" sx={{fontSize: '0.78rem'}}>
                                    Payment will be processed via your configured mobile money account. The promotion will be activated after payment confirmation.
                                </Alert>
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{px: 3, pb: 2}}>
                            <Button onClick={() => setDialogOpen(false)} sx={{color: 'text.secondary'}}>Cancel</Button>
                            <Button onClick={formik.handleSubmit} variant="contained" startIcon={<CampaignRounded/>}
                                sx={{bgcolor: '#B45309', '&:hover': {bgcolor: '#92400E'}}}>
                                Submit & Pay
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Stack>
            </Container>
        </Layout>
    );
};

export default PromotionsPage;
