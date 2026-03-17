import Layout from "../../components/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {getShop, updateShop, selectShops, clearShop} from "../../redux/features/shops/shops-slice";
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import {
    ArrowBack,
    BusinessRounded,
    DescriptionRounded,
    PhoneRounded,
    EmailRounded,
    BadgeRounded,
    AddRounded,
    DeleteRounded,
} from "@mui/icons-material";
import {InputAdornment} from "@mui/material";

const PROVIDERS = [
    {label: 'MTN', value: 'mtn'},
    {label: 'Vodafone', value: 'vodafone'},
    {label: 'AirtelTigo', value: 'airtelTigo'},
];

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    open: Yup.string().required('Opening time is required'),
    close: Yup.string().required('Closing time is required'),
    license: Yup.string().required('License number is required'),
    paymentProvider: Yup.string().required('Payment provider is required'),
    paymentNumber: Yup.string().required('Mobile number is required'),
    paymentAccountName: Yup.string().required('Account name is required'),
});

const sectionTitle = (text) => (
    <Typography
        variant="overline"
        sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            color: 'text.secondary',
            letterSpacing: 1.2
        }}
    >
        {text}
    </Typography>
);

const UpdateShopPage = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {shop, loading} = useSelector(selectShops);
    const [destinations, setDestinations] = useState([{name: '', price: ''}]);

    useEffect(() => {
        dispatch(getShop(id));
        return () => dispatch(clearShop());
    }, [dispatch, id]);

    useEffect(() => {
        if (shop?.destinations?.length > 0) {
            setDestinations(shop.destinations.map(d => ({name: d.name, price: d.price?.amount?.toString() || ''})));
        }
    }, [shop]);

    const addDestination = () => setDestinations(prev => [...prev, {name: '', price: ''}]);
    const removeDestination = (index) => setDestinations(prev => prev.filter((_, i) => i !== index));
    const updateDestination = (index, field, value) => {
        setDestinations(prev => prev.map((d, i) => i === index ? {...d, [field]: value} : d));
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: shop?.name || '',
            description: shop?.description || '',
            phone: shop?.contact?.phone || '',
            email: shop?.contact?.email || '',
            open: shop?.operatingHours?.open || '09:00',
            close: shop?.operatingHours?.close || '21:00',
            license: shop?.license || '',
            paymentProvider: shop?.paymentDetails?.provider || '',
            paymentNumber: shop?.paymentDetails?.number || '',
            paymentAccountName: shop?.paymentDetails?.accountName || '',
        },
        validationSchema,
        onSubmit: (values) => {
            const data = {
                name: values.name,
                description: values.description,
                contact: {
                    phone: values.phone,
                    email: values.email,
                },
                operatingHours: {
                    open: values.open,
                    close: values.close
                },
                license: values.license,
                destinations: destinations.filter(d => d.name).map(d => ({
                    name: d.name,
                    price: {amount: parseFloat(d.price) || 0, currency: 'GHS'}
                })),
                paymentDetails: {
                    provider: values.paymentProvider,
                    number: values.paymentNumber,
                    accountName: values.paymentAccountName,
                }
            };
            dispatch(updateShop({id: shop._id, data})).unwrap().then(() => navigate(`/shops/${shop._id}`));
        }
    });

    const fieldProps = (name) => ({
        fullWidth: true,
        variant: 'outlined',
        name,
        value: formik.values[name],
        onChange: formik.handleChange,
        onBlur: formik.handleBlur,
        error: formik.touched[name] && Boolean(formik.errors[name]),
        helperText: formik.touched[name] && formik.errors[name],
        sx: {
            '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
                fontFamily: 'Inter, sans-serif'
            },
            '& .MuiInputLabel-root': {
                fontFamily: 'Inter, sans-serif'
            }
        }
    });

    if (loading && !shop) {
        return (
            <Layout>
                <Box sx={{overflow: 'auto', maxHeight: '100vh', py: 4}}>
                    <Container maxWidth="md">
                        <LinearProgress sx={{borderRadius: 1}}/>
                    </Container>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box sx={{overflow: 'auto', maxHeight: '100vh', py: 4}}>
                <Container maxWidth="md">
                    <Button
                        startIcon={<ArrowBack/>}
                        onClick={() => navigate(`/shops/${id}`)}
                        sx={{
                            mb: 3,
                            textTransform: 'none',
                            fontFamily: 'Inter, sans-serif',
                            color: 'text.secondary',
                            '&:hover': {color: 'text.primary'}
                        }}
                    >
                        Back to Shop
                    </Button>

                    <Typography
                        variant="h4"
                        sx={{fontFamily: 'Inter, sans-serif', fontWeight: 700, color: 'text.primary', mb: 3}}
                    >
                        Update Shop
                    </Typography>

                    {loading && <LinearProgress sx={{mb: 2, borderRadius: 1}}/>}

                    <Card
                        elevation={0}
                        sx={{border: 1, borderColor: 'divider', borderRadius: '6px'}}
                    >
                        <CardContent sx={{p: 4}}>
                            <form onSubmit={formik.handleSubmit}>
                                {/* General Info */}
                                <Box sx={{mb: 3}}>
                                    {sectionTitle('General Information')}
                                    <Divider sx={{mt: 1, mb: 2.5}}/>
                                    <Grid container spacing={2.5}>
                                        <Grid size={{xs: 12}}>
                                            <TextField label="Shop Name" {...fieldProps('name')} slotProps={{input: {startAdornment: (<InputAdornment position="start"><BusinessRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}/>
                                        </Grid>
                                        <Grid size={{xs: 12}}>
                                            <TextField label="Description" multiline rows={3} {...fieldProps('description')} slotProps={{input: {startAdornment: (<InputAdornment position="start"><DescriptionRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}/>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Contact */}
                                <Box sx={{mb: 3}}>
                                    {sectionTitle('Contact')}
                                    <Divider sx={{mt: 1, mb: 2.5}}/>
                                    <Grid container spacing={2.5}>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            <TextField label="Phone" {...fieldProps('phone')} slotProps={{input: {startAdornment: (<InputAdornment position="start"><PhoneRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}/>
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 6}}>
                                            <TextField label="Email" type="email" {...fieldProps('email')} slotProps={{input: {startAdornment: (<InputAdornment position="start"><EmailRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}/>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Destinations */}
                                <Box sx={{mb: 3}}>
                                    {sectionTitle('Delivery Destinations')}
                                    <Divider sx={{mt: 1, mb: 2.5}}/>
                                    {destinations.map((dest, i) => (
                                        <Grid container spacing={2} key={i} sx={{mb: 1.5}}>
                                            <Grid size={{xs: 12, sm: 6}}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    label="Destination Name"
                                                    value={dest.name}
                                                    onChange={(e) => updateDestination(i, 'name', e.target.value)}
                                                    placeholder="e.g. Accra - East Legon"
                                                    sx={{'& .MuiOutlinedInput-root': {borderRadius: '4px', fontFamily: 'Inter, sans-serif'}}}
                                                />
                                            </Grid>
                                            <Grid size={{xs: 12, sm: 4}}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    label="Delivery Price (GHS)"
                                                    type="number"
                                                    value={dest.price}
                                                    onChange={(e) => updateDestination(i, 'price', e.target.value)}
                                                    sx={{'& .MuiOutlinedInput-root': {borderRadius: '4px', fontFamily: 'Inter, sans-serif'}}}
                                                />
                                            </Grid>
                                            <Grid size={{xs: 12, sm: 2}} sx={{display: 'flex', alignItems: 'center'}}>
                                                {destinations.length > 1 && (
                                                    <IconButton onClick={() => removeDestination(i)} color="error" size="small">
                                                        <DeleteRounded/>
                                                    </IconButton>
                                                )}
                                            </Grid>
                                        </Grid>
                                    ))}
                                    <Button
                                        startIcon={<AddRounded/>}
                                        onClick={addDestination}
                                        sx={{
                                            textTransform: 'none',
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 600,
                                            color: '#0D6B3F',
                                            mt: 1
                                        }}
                                    >
                                        Add Destination
                                    </Button>
                                </Box>

                                {/* Payment Details */}
                                <Box sx={{mb: 3}}>
                                    {sectionTitle('Payment Details')}
                                    <Divider sx={{mt: 1, mb: 2.5}}/>
                                    <Grid container spacing={2.5}>
                                        <Grid size={{xs: 12, sm: 4}}>
                                            <TextField
                                                select
                                                label="Provider"
                                                {...fieldProps('paymentProvider')}
                                            >
                                                {PROVIDERS.map(p => (
                                                    <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 4}}>
                                            <TextField label="Mobile Number" {...fieldProps('paymentNumber')}/>
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 4}}>
                                            <TextField label="Account Name" {...fieldProps('paymentAccountName')}/>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Operations */}
                                <Box sx={{mb: 3}}>
                                    {sectionTitle('Operations')}
                                    <Divider sx={{mt: 1, mb: 2.5}}/>
                                    <Grid container spacing={2.5}>
                                        <Grid size={{xs: 12, sm: 4}}>
                                            <TextField
                                                label="Opening Time"
                                                type="time"
                                                slotProps={{inputLabel: {shrink: true}}}
                                                {...fieldProps('open')}
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 4}}>
                                            <TextField
                                                label="Closing Time"
                                                type="time"
                                                slotProps={{inputLabel: {shrink: true}}}
                                                {...fieldProps('close')}
                                            />
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 4}}>
                                            <TextField label="License Number" {...fieldProps('license')} slotProps={{input: {startAdornment: (<InputAdornment position="start"><BadgeRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}/>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {/* Actions */}
                                <Divider sx={{mb: 3}}/>
                                <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate(`/shops/${id}`)}
                                        sx={{
                                            textTransform: 'none',
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 600,
                                            borderRadius: '4px',
                                            px: 3
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        sx={{
                                            textTransform: 'none',
                                            fontFamily: 'Inter, sans-serif',
                                            fontWeight: 600,
                                            borderRadius: '4px',
                                            px: 3,
                                            backgroundColor: '#0D6B3F',
                                            '&:hover': {backgroundColor: '#0a5832'}
                                        }}
                                    >
                                        Update Shop
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Layout>
    );
};

export default UpdateShopPage;
