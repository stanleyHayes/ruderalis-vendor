import Layout from "../../components/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import {getShops, selectShops} from "../../redux/features/shops/shops-slice";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Container,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import {Add, Inventory, ShoppingCart, AttachMoney, AccessTime, StorefrontRounded, CheckCircleRounded, AttachMoneyRounded, StarRounded} from "@mui/icons-material";
import {CardGridSkeleton} from "../../components/shared/page-skeleton";

const MiniStat = ({icon: Icon, label, value, color}) => (
    <Card sx={{border: 'none', background: `${color}08`, flex: 1, minWidth: 0}}>
        <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{width: 36, height: 36, borderRadius: 2, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon sx={{fontSize: 18, color}}/>
                </Box>
                <Box>
                    <Typography sx={{fontSize: '1.1rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.2}}>{value}</Typography>
                    <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', fontWeight: 500}}>{label}</Typography>
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

const ShopsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {shops, loading} = useSelector(selectShops);

    useEffect(() => {
        dispatch(getShops());
    }, [dispatch]);

    return (
        <Layout>
            <Box sx={{overflow: 'auto', maxHeight: '100vh', py: 4}}>
                <Container maxWidth="xl">
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                        <Box>
                            <Typography variant="h4" sx={{fontFamily: 'Inter, sans-serif', fontWeight: 700, color: 'text.primary'}}>
                                Dispensaries
                            </Typography>
                            <Typography variant="body2" sx={{color: 'text.secondary', mt: 0.5}}>
                                Manage your dispensary locations
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<Add/>}
                            component={Link}
                            to="/shops/create"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '4px',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 600,
                                px: 3,
                                backgroundColor: '#0D6B3F',
                                '&:hover': {backgroundColor: '#0a5832'}
                            }}
                        >
                            Add Shop
                        </Button>
                    </Box>

                    {/* Stats */}
                    {!loading && (
                        <Stack direction="row" spacing={2} sx={{mb: 2.5, flexWrap: 'wrap', gap: 2}}>
                            <MiniStat icon={StorefrontRounded} label="Total Shops" value={shops.length.toLocaleString()} color="#10B981"/>
                            <MiniStat icon={CheckCircleRounded} label="Active" value={shops.filter(s => s.status === 'active').length.toLocaleString()} color="#059669"/>
                            <MiniStat icon={AttachMoneyRounded} label="Total Revenue" value={`GH₵ ${shops.reduce((sum, s) => sum + (s.revenue || 0), 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} color="#3B82F6"/>
                            <MiniStat icon={StarRounded} label="Avg Rating" value={shops.length > 0 ? (shops.reduce((sum, s) => sum + (s.rating?.average || 0), 0) / shops.filter(s => s.rating?.average != null).length).toFixed(1) : '0'} color="#F59E0B"/>
                        </Stack>
                    )}

                    {loading && shops.length === 0 && <CardGridSkeleton/>}

                    <Grid container spacing={3}>
                        {shops.map(shop => (
                            <Grid size={{xs: 12, md: 6, lg: 4}} key={shop._id}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        border: 1,
                                        borderColor: 'divider',
                                        borderRadius: '6px',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            borderColor: '#0D6B3F',
                                            boxShadow: '0 4px 20px rgba(13, 107, 63, 0.08)'
                                        }
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => navigate(`/shops/${shop._id}`)}
                                        sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}
                                    >
                                        {/* Gradient Header */}
                                        <Box
                                            sx={{
                                                background: 'linear-gradient(135deg, #0D6B3F 0%, #10B981 100%)',
                                                py: 3,
                                                px: 3,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    color: '#fff',
                                                    fontSize: '1.5rem',
                                                    fontFamily: 'Inter, sans-serif',
                                                    fontWeight: 700,
                                                    backdropFilter: 'blur(8px)'
                                                }}
                                            >
                                                {shop.name?.charAt(0)?.toUpperCase()}
                                            </Avatar>
                                            <Box sx={{flex: 1, minWidth: 0}}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontFamily: 'Inter, sans-serif',
                                                        fontWeight: 700,
                                                        color: '#fff',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {shop.name}
                                                </Typography>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mt: 0.5}}>
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
                                                            color: 'rgba(255,255,255,0.85)',
                                                            textTransform: 'capitalize',
                                                            fontFamily: 'Inter, sans-serif'
                                                        }}
                                                    >
                                                        {shop.status}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {/* Rating Pill */}
                                            {shop.rating?.average != null && (
                                                <Box
                                                    sx={{
                                                        bgcolor: 'rgba(255,255,255,0.2)',
                                                        backdropFilter: 'blur(8px)',
                                                        borderRadius: '20px',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        sx={{fontFamily: 'Inter, sans-serif', fontWeight: 700, color: '#fff'}}
                                                    >
                                                        {shop.rating.average}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Card Body */}
                                        <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5}}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    fontFamily: 'Inter, sans-serif',
                                                    mb: 1
                                                }}
                                            >
                                                {shop.contact?.phone} | {shop.contact?.email}
                                            </Typography>
                                            {shop.destinations?.length > 0 && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{color: 'text.secondary', fontFamily: 'Inter, sans-serif', mb: 1, display: 'block'}}
                                                >
                                                    Delivers to: {shop.destinations.map(d => d.name).join(', ')}
                                                </Typography>
                                            )}

                                            {shop.operatingHours && (
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.75, mb: 2}}>
                                                    <AccessTime sx={{fontSize: 16, color: 'text.disabled'}}/>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{color: 'text.secondary', fontFamily: 'Inter, sans-serif'}}
                                                    >
                                                        {shop.operatingHours.open} - {shop.operatingHours.close}
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Divider sx={{my: 1.5}}/>

                                            {/* Stats Row */}
                                            <Stack direction="row" spacing={2} sx={{mt: 'auto'}}>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.75}}>
                                                    <Inventory sx={{fontSize: 18, color: '#0D6B3F'}}/>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#0D6B3F'}}
                                                    >
                                                        {shop.totalProducts}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{color: 'text.secondary', fontFamily: 'Inter, sans-serif'}}>
                                                        Products
                                                    </Typography>
                                                </Box>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.75}}>
                                                    <ShoppingCart sx={{fontSize: 18, color: '#2563eb'}}/>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#2563eb'}}
                                                    >
                                                        {shop.totalOrders}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{color: 'text.secondary', fontFamily: 'Inter, sans-serif'}}>
                                                        Orders
                                                    </Typography>
                                                </Box>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.75}}>
                                                    <AttachMoney sx={{fontSize: 18, color: '#10B981'}}/>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#10B981'}}
                                                    >
                                                        GH₵{shop.revenue?.toLocaleString() ?? 0}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {!loading && shops.length === 0 && (
                        <Box sx={{textAlign: 'center', py: 8}}>
                            <Typography sx={{color: 'text.secondary', fontFamily: 'Inter, sans-serif'}}>
                                No shops found. Create your first dispensary to get started.
                            </Typography>
                        </Box>
                    )}
                </Container>
            </Box>
        </Layout>
    );
};

export default ShopsPage;
