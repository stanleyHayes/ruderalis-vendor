import Layout from "../../components/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router";
import {getShop, deleteShop, selectShops, clearShop} from "../../redux/features/shops/shops-slice";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import {
    ArrowBack,
    Delete,
    Edit,
    AttachMoney,
    Inventory,
    ShoppingCart,
    Phone,
    Email,
    LocationOn,
    AccessTime,
    Badge,
    CalendarMonth
} from "@mui/icons-material";
import {DetailSkeleton} from "../../components/shared/page-skeleton";

const ShopDetailPage = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {shop, loading} = useSelector(selectShops);

    useEffect(() => {
        dispatch(getShop(id));
        return () => dispatch(clearShop());
    }, [dispatch, id]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this shop?')) {
            dispatch(deleteShop(shop._id)).then(() => navigate('/shops'));
        }
    };

    if (loading && !shop) {
        return (
            <Layout>
                <Box sx={{overflow: 'auto', maxHeight: '100vh', py: 4}}>
                    <Container maxWidth="lg">
                        <DetailSkeleton/>
                    </Container>
                </Box>
            </Layout>
        );
    }

    if (!shop) {
        return (
            <Layout>
                <Box sx={{overflow: 'auto', maxHeight: '100vh', py: 4}}>
                    <Container maxWidth="lg">
                        <Typography sx={{color: 'text.secondary', fontFamily: 'Inter, sans-serif'}}>Shop not found</Typography>
                    </Container>
                </Box>
            </Layout>
        );
    }

    const InfoRow = ({icon, label, value}) => (
        <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 2, py: 1.5}}>
            <Box sx={{color: 'text.disabled', mt: 0.25}}>{icon}</Box>
            <Box sx={{flex: 1}}>
                <Typography variant="caption" sx={{color: 'text.secondary', fontFamily: 'Inter, sans-serif'}}>
                    {label}
                </Typography>
                <Typography variant="body2" sx={{fontFamily: 'Inter, sans-serif', fontWeight: 500, color: 'text.primary'}}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Layout>
            <Box sx={{overflow: 'auto', maxHeight: '100vh', py: 4}}>
                <Container maxWidth="lg">
                    {/* Back Button */}
                    <Button
                        startIcon={<ArrowBack/>}
                        onClick={() => navigate('/shops')}
                        sx={{
                            mb: 3,
                            textTransform: 'none',
                            fontFamily: 'Inter, sans-serif',
                            color: 'text.secondary',
                            '&:hover': {color: 'text.primary'}
                        }}
                    >
                        Back to Dispensaries
                    </Button>

                    {/* Header Card */}
                    <Card
                        elevation={0}
                        sx={{
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: '6px',
                            mb: 3,
                            overflow: 'hidden'
                        }}
                    >
                        {/* Gradient Header */}
                        <Box
                            sx={{
                                background: 'linear-gradient(135deg, #0D6B3F 0%, #10B981 100%)',
                                py: 4,
                                px: 4,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                                flexWrap: 'wrap'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 72,
                                    height: 72,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    fontSize: '2rem',
                                    fontFamily: 'Inter, sans-serif',
                                    fontWeight: 700,
                                    backdropFilter: 'blur(8px)'
                                }}
                            >
                                {shop.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                            <Box sx={{flex: 1, minWidth: 200}}>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'}}>
                                    <Typography
                                        variant="h4"
                                        sx={{fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff'}}
                                    >
                                        {shop.name}
                                    </Typography>
                                    {/* Status Badge */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.75,
                                            bgcolor: 'rgba(255,255,255,0.15)',
                                            backdropFilter: 'blur(8px)',
                                            borderRadius: '20px',
                                            px: 1.5,
                                            py: 0.5
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: '50%',
                                                bgcolor: shop.status === 'active' ? '#4ade80' : 'rgba(255,255,255,0.4)'
                                            }}
                                        />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#fff',
                                                textTransform: 'capitalize',
                                                fontFamily: 'Inter, sans-serif',
                                                fontWeight: 500
                                            }}
                                        >
                                            {shop.status}
                                        </Typography>
                                    </Box>
                                    {/* Rating Pill */}
                                    {shop.rating?.average != null && (
                                        <Box
                                            sx={{
                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(8px)',
                                                borderRadius: '20px',
                                                px: 1.5,
                                                py: 0.5
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff'}}
                                            >
                                                {shop.rating.average} ({shop.rating.count} reviews)
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                                {shop.description && (
                                    <Typography
                                        sx={{color: 'rgba(255,255,255,0.8)', mt: 1, fontFamily: 'Inter, sans-serif'}}
                                    >
                                        {shop.description}
                                    </Typography>
                                )}
                            </Box>
                            <Stack direction="row" spacing={1.5}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Edit/>}
                                    onClick={() => navigate(`/shops/${shop._id}/edit`)}
                                    sx={{
                                        textTransform: 'none',
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 600,
                                        borderRadius: '4px',
                                        borderColor: 'rgba(255,255,255,0.4)',
                                        color: '#fff',
                                        '&:hover': {
                                            borderColor: '#fff',
                                            bgcolor: 'rgba(255,255,255,0.1)'
                                        }
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Delete/>}
                                    onClick={handleDelete}
                                    sx={{
                                        textTransform: 'none',
                                        fontFamily: 'Inter, sans-serif',
                                        fontWeight: 600,
                                        borderRadius: '4px',
                                        borderColor: 'rgba(255,100,100,0.6)',
                                        color: '#fca5a5',
                                        '&:hover': {
                                            borderColor: '#fca5a5',
                                            bgcolor: 'rgba(255,100,100,0.1)'
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </Box>
                    </Card>

                    <Grid container spacing={3}>
                        {/* Contact Info Card */}
                        <Grid size={{xs: 12, md: 6}}>
                            <Card
                                elevation={0}
                                sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: '6px',
                                    height: '100%'
                                }}
                            >
                                <CardContent sx={{p: 3}}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{fontFamily: 'Inter, sans-serif', fontWeight: 700, color: 'text.primary', mb: 1}}
                                    >
                                        Contact Info
                                    </Typography>
                                    <Divider sx={{mb: 1}}/>
                                    <InfoRow
                                        icon={<Phone fontSize="small"/>}
                                        label="Phone"
                                        value={shop.contact?.phone}
                                    />
                                    <InfoRow
                                        icon={<Email fontSize="small"/>}
                                        label="Email"
                                        value={shop.contact?.email}
                                    />
                                    {shop.destinations?.length > 0 && (
                                        <Box sx={{py: 1.5}}>
                                            <Typography variant="caption" sx={{color: 'text.secondary', fontFamily: 'Inter, sans-serif'}}>
                                                Destinations
                                            </Typography>
                                            {shop.destinations.map((d, i) => (
                                                <Typography key={i} variant="body2" sx={{fontFamily: 'Inter, sans-serif', fontWeight: 500, color: 'text.primary'}}>
                                                    {d.name} - GH₵ {d.price?.amount?.toFixed(2)}
                                                </Typography>
                                            ))}
                                        </Box>
                                    )}
                                    {shop.paymentDetails && (
                                        <Box sx={{py: 1.5}}>
                                            <Typography variant="caption" sx={{color: 'text.secondary', fontFamily: 'Inter, sans-serif'}}>
                                                Payment Details
                                            </Typography>
                                            <Typography variant="body2" sx={{fontFamily: 'Inter, sans-serif', fontWeight: 500, color: 'text.primary'}}>
                                                {shop.paymentDetails.provider?.toUpperCase()} - {shop.paymentDetails.number}
                                            </Typography>
                                            <Typography variant="body2" sx={{fontFamily: 'Inter, sans-serif', fontWeight: 500, color: 'text.secondary'}}>
                                                {shop.paymentDetails.accountName}
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Operating Details Card */}
                        <Grid size={{xs: 12, md: 6}}>
                            <Card
                                elevation={0}
                                sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: '6px',
                                    height: '100%'
                                }}
                            >
                                <CardContent sx={{p: 3}}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{fontFamily: 'Inter, sans-serif', fontWeight: 700, color: 'text.primary', mb: 1}}
                                    >
                                        Operating Details
                                    </Typography>
                                    <Divider sx={{mb: 1}}/>
                                    <InfoRow
                                        icon={<AccessTime fontSize="small"/>}
                                        label="Operating Hours"
                                        value={`${shop.operatingHours?.open} - ${shop.operatingHours?.close}`}
                                    />
                                    <InfoRow
                                        icon={<Badge fontSize="small"/>}
                                        label="License"
                                        value={shop.license}
                                    />
                                    <InfoRow
                                        icon={<CalendarMonth fontSize="small"/>}
                                        label="Created"
                                        value={new Date(shop.createdAt).toLocaleDateString()}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Performance Card */}
                        <Grid size={{xs: 12}}>
                            <Card
                                elevation={0}
                                sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: '6px'
                                }}
                            >
                                <CardContent sx={{p: 3}}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{fontFamily: 'Inter, sans-serif', fontWeight: 700, color: 'text.primary', mb: 2}}
                                    >
                                        Performance
                                    </Typography>
                                    <Grid container spacing={3}>
                                        {[
                                            {
                                                label: 'Total Products',
                                                value: shop.totalProducts,
                                                icon: <Inventory/>,
                                                color: '#0D6B3F',
                                                bg: 'rgba(13, 107, 63, 0.08)'
                                            },
                                            {
                                                label: 'Total Orders',
                                                value: shop.totalOrders,
                                                icon: <ShoppingCart/>,
                                                color: '#2563eb',
                                                bg: 'rgba(37, 99, 235, 0.08)'
                                            },
                                            {
                                                label: 'Revenue',
                                                value: `GH₵ ${shop.revenue?.toLocaleString() ?? 0}`,
                                                icon: <AttachMoney/>,
                                                color: '#10B981',
                                                bg: 'rgba(16, 185, 129, 0.08)'
                                            }
                                        ].map(stat => (
                                            <Grid size={{xs: 12, sm: 4}} key={stat.label}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2,
                                                        p: 2.5,
                                                        borderRadius: '4px',
                                                        bgcolor: stat.bg
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            color: stat.color,
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        {stat.icon}
                                                    </Box>
                                                    <Box>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{color: 'text.secondary', fontFamily: 'Inter, sans-serif'}}
                                                        >
                                                            {stat.label}
                                                        </Typography>
                                                        <Typography
                                                            variant="h5"
                                                            sx={{
                                                                fontFamily: 'Inter, sans-serif',
                                                                fontWeight: 700,
                                                                color: stat.color
                                                            }}
                                                        >
                                                            {stat.value}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
};

export default ShopDetailPage;
