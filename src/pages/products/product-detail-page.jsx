import Layout from "../../components/layout/layout";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Skeleton,
    Stack,
    Typography
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getProduct, deleteProduct, selectProducts, clearProduct} from "../../redux/features/products/products-slice";
import {useNavigate, useParams} from "react-router";
import {Link} from "react-router-dom";
import {
    ArrowBack,
    AttachMoneyRounded,
    CalendarMonthRounded,
    CategoryRounded,
    DeleteOutline,
    Edit,
    SpaRounded,
    InventoryRounded,
    LocalFloristRounded,
    ScaleRounded,
    ScienceRounded,
    StorefrontRounded,
    TagRounded,
    UpdateRounded
} from "@mui/icons-material";

const STRAIN_COLORS = {
    indica: {bg: '#F3E8FF', text: '#7C3AED'},
    sativa: {bg: '#FFF7ED', text: '#EA580C'},
    hybrid: {bg: '#ECFDF5', text: '#059669'}
};

const STATUS_STYLES = {
    active: {bg: '#D1FAE5', text: '#065F46'},
    pending: {bg: '#FEF3C7', text: '#92400E'}
};

const fmtGHS = (v) => `GH₵ ${(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

const ProductDetailPage = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {product, loading, error} = useSelector(selectProducts);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(getProduct(id));
        return () => {
            dispatch(clearProduct());
        };
    }, [dispatch, id]);

    const handleDelete = async () => {
        const result = await dispatch(deleteProduct(id));
        if (!result.error) {
            navigate('/products');
        }
        setDeleteDialogOpen(false);
    };

    const formatVariant = (variant) => {
        if (!variant) return 'N/A';
        return variant.charAt(0).toUpperCase() + variant.slice(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isPlaceholderImage = (url) => {
        if (!url) return true;
        return url.includes('placeholder') || url.includes('via.placeholder') || url.includes('placehold');
    };

    const StatCard = ({icon: Icon, value, label, bgColor, iconColor}) => (
        <Box sx={{
            flex: '1 1 0',
            minWidth: 130,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
        }}>
            <Box sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                backgroundColor: bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                <Icon sx={{fontSize: 22, color: iconColor}}/>
            </Box>
            <Box>
                <Typography sx={{fontWeight: 800, fontSize: '1.15rem', color: 'text.primary', lineHeight: 1.2}}>
                    {value}
                </Typography>
                <Typography sx={{fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                    {label}
                </Typography>
            </Box>
        </Box>
    );

    const InfoItem = ({icon: Icon, label, value, color = '#10B981'}) => (
        <Stack direction="row" spacing={2} alignItems="center" sx={{py: 1.2}}>
            <Box sx={{
                width: 40, height: 40, borderRadius: 2,
                background: `${color}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <Icon sx={{fontSize: 20, color}}/>
            </Box>
            <Box sx={{flex: 1, minWidth: 0}}>
                <Typography sx={{fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                    {label}
                </Typography>
                <Typography sx={{fontSize: '0.9rem', color: 'text.primary', fontWeight: 500, mt: 0.1}}>
                    {value || 'N/A'}
                </Typography>
            </Box>
        </Stack>
    );

    return (
        <Layout>
            <Box sx={{overflow: 'auto', maxHeight: '100vh', py: 3}}>
                <Container maxWidth="lg">
                    {/* Back Button */}
                    <Button
                        component={Link}
                        to="/products"
                        startIcon={<ArrowBack sx={{fontSize: 18}}/>}
                        sx={{
                            color: 'text.secondary',
                            textTransform: 'none',
                            mb: 2,
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            '&:hover': {color: '#0D6B3F', backgroundColor: 'transparent'}
                        }}>
                        Back to Products
                    </Button>

                    {loading ? (
                        <Stack spacing={2.5}>
                            <Skeleton variant="rectangular" height={200} sx={{borderRadius: 3}}/>
                            <Stack direction="row" spacing={2}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Skeleton key={i} variant="rectangular" height={80} sx={{borderRadius: 3, flex: 1}}/>
                                ))}
                            </Stack>
                            <Stack direction="row" spacing={2.5}>
                                <Skeleton variant="rectangular" height={250} sx={{borderRadius: 3, flex: 1}}/>
                                <Skeleton variant="rectangular" height={250} sx={{borderRadius: 3, flex: 1}}/>
                            </Stack>
                        </Stack>
                    ) : error ? (
                        <Alert severity="error" sx={{borderRadius: 3}}>{error}</Alert>
                    ) : product ? (
                        <Stack spacing={2.5}>
                            {/* Hero Card */}
                            <Card sx={{overflow: 'hidden', boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 3}}>
                                {/* Gradient Header */}
                                <Box sx={{
                                    minHeight: 140,
                                    background: 'linear-gradient(135deg, #064E3B 0%, #059669 40%, #10B981 70%, #34D399 100%)',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    px: 3,
                                    py: 3
                                }}>
                                    {/* Decorative circles */}
                                    <Box sx={{position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                                    <Box sx={{position: 'absolute', bottom: -20, left: '30%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)'}}/>
                                    <Box sx={{position: 'absolute', top: 15, left: '60%', width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.03)'}}/>

                                    <Box sx={{position: 'relative', zIndex: 1, width: '100%'}}>
                                        <Stack
                                            direction={{xs: 'column', sm: 'row'}}
                                            justifyContent="space-between"
                                            alignItems={{xs: 'flex-start', sm: 'center'}}
                                            spacing={2}
                                        >
                                            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                                                <Typography sx={{
                                                    fontWeight: 800,
                                                    fontSize: {xs: '1.5rem', sm: '1.8rem'},
                                                    color: '#fff',
                                                    letterSpacing: '-0.02em'
                                                }}>
                                                    {product.name}
                                                </Typography>
                                                <Box sx={{
                                                    backgroundColor: product.status === 'active' ? 'rgba(255,255,255,0.2)' : 'rgba(239,68,68,0.3)',
                                                    backdropFilter: 'blur(10px)',
                                                    color: '#fff',
                                                    fontWeight: 700,
                                                    fontSize: '0.75rem',
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 2
                                                }}>
                                                    {product.status}
                                                </Box>
                                            </Stack>
                                            <Stack direction="row" spacing={1.5}>
                                                <Button
                                                    component={Link}
                                                    to={`/products/${product._id}/edit`}
                                                    variant="outlined"
                                                    startIcon={<Edit sx={{fontSize: 16}}/>}
                                                    size="small"
                                                    sx={{
                                                        borderColor: 'rgba(255,255,255,0.35)',
                                                        color: '#fff',
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        px: 2.5,
                                                        fontSize: '0.8rem',
                                                        '&:hover': {borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)'}
                                                    }}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<DeleteOutline sx={{fontSize: 16}}/>}
                                                    size="small"
                                                    onClick={() => setDeleteDialogOpen(true)}
                                                    sx={{
                                                        backgroundColor: 'rgba(239,68,68,0.8)',
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        px: 2.5,
                                                        fontSize: '0.8rem',
                                                        boxShadow: 'none',
                                                        '&:hover': {backgroundColor: 'rgba(220,38,38,0.95)', boxShadow: 'none'}
                                                    }}>
                                                    Delete
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Box>

                                {/* Description below gradient */}
                                {product.description && (
                                    <CardContent sx={{px: 3, py: 2.5}}>
                                        <Typography sx={{color: 'text.secondary', fontSize: '0.9rem', lineHeight: 1.7}}>
                                            {product.description}
                                        </Typography>
                                    </CardContent>
                                )}
                            </Card>

                            {/* Quick Stats Row */}
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                flexWrap: 'wrap'
                            }}>
                                <StatCard
                                    icon={AttachMoneyRounded}
                                    value={fmtGHS(product.price?.amount)}
                                    label="Price"
                                    bgColor="#ECFDF5"
                                    iconColor="#059669"
                                />
                                <StatCard
                                    icon={ScienceRounded}
                                    value={`${product.thc}%`}
                                    label="THC"
                                    bgColor="#F3E8FF"
                                    iconColor="#7C3AED"
                                />
                                <StatCard
                                    icon={ScienceRounded}
                                    value={`${product.cbd}%`}
                                    label="CBD"
                                    bgColor="#DBEAFE"
                                    iconColor="#2563EB"
                                />
                                <StatCard
                                    icon={InventoryRounded}
                                    value={product.stock?.quantity}
                                    label="Stock"
                                    bgColor={product.stock?.quantity > 0 ? '#FEF3C7' : '#FEE2E2'}
                                    iconColor={product.stock?.quantity > 0 ? '#D97706' : '#DC2626'}
                                />
                                <StatCard
                                    icon={ScaleRounded}
                                    value={product.weight}
                                    label="Weight"
                                    bgColor="#CCFBF1"
                                    iconColor="#0D9488"
                                />
                            </Box>

                            {/* Details Grid */}
                            <Grid container spacing={2.5}>
                                {/* Product Info Card */}
                                <Grid size={{xs: 12, md: 6}}>
                                    <Card sx={{height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 3}}>
                                        <CardContent sx={{p: 3}}>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary', mb: 1}}>
                                                Product Information
                                            </Typography>
                                            <Divider sx={{mb: 1}}/>
                                            <Stack divider={<Divider sx={{opacity: 0.5}}/>}>
                                                <Stack direction="row" spacing={2} alignItems="center" sx={{py: 1.2}}>
                                                    <Box sx={{
                                                        width: 40, height: 40, borderRadius: 2,
                                                        background: '#F59E0B12',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                    }}>
                                                        <CategoryRounded sx={{fontSize: 20, color: '#F59E0B'}}/>
                                                    </Box>
                                                    <Box sx={{flex: 1, minWidth: 0}}>
                                                        <Typography sx={{fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                                            Variant
                                                        </Typography>
                                                        <Chip
                                                            label={formatVariant(product.variant)}
                                                            size="small"
                                                            sx={{
                                                                mt: 0.5,
                                                                height: 24,
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700,
                                                                backgroundColor: '#FEF3C7',
                                                                color: '#92400E'
                                                            }}
                                                        />
                                                    </Box>
                                                </Stack>
                                                <Stack direction="row" spacing={2} alignItems="center" sx={{py: 1.2}}>
                                                    <Box sx={{
                                                        width: 40, height: 40, borderRadius: 2,
                                                        background: (STRAIN_COLORS[product.strain]?.text || '#10B981') + '12',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                    }}>
                                                        <LocalFloristRounded sx={{fontSize: 20, color: STRAIN_COLORS[product.strain]?.text || '#10B981'}}/>
                                                    </Box>
                                                    <Box sx={{flex: 1, minWidth: 0}}>
                                                        <Typography sx={{fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                                            Strain
                                                        </Typography>
                                                        <Chip
                                                            label={product.strain.charAt(0).toUpperCase() + product.strain.slice(1)}
                                                            size="small"
                                                            sx={{
                                                                mt: 0.5,
                                                                height: 24,
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700,
                                                                backgroundColor: STRAIN_COLORS[product.strain]?.bg || '#ECFDF5',
                                                                color: STRAIN_COLORS[product.strain]?.text || '#059669'
                                                            }}
                                                        />
                                                    </Box>
                                                </Stack>
                                                <InfoItem icon={ScaleRounded} label="Weight" value={product.weight} color="#0D9488"/>
                                                <Stack direction="row" spacing={2} alignItems="center" sx={{py: 1.2}}>
                                                    <Box sx={{
                                                        width: 40, height: 40, borderRadius: 2,
                                                        background: (STATUS_STYLES[product.status] || STATUS_STYLES.pending).bg,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                    }}>
                                                        <SpaRounded sx={{fontSize: 20, color: (STATUS_STYLES[product.status] || STATUS_STYLES.pending).text}}/>
                                                    </Box>
                                                    <Box sx={{flex: 1, minWidth: 0}}>
                                                        <Typography sx={{fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                                            Status
                                                        </Typography>
                                                        <Chip
                                                            label={product.status}
                                                            size="small"
                                                            sx={{
                                                                mt: 0.5,
                                                                height: 24,
                                                                fontSize: '0.75rem',
                                                                fontWeight: 700,
                                                                textTransform: 'capitalize',
                                                                backgroundColor: (STATUS_STYLES[product.status] || STATUS_STYLES.pending).bg,
                                                                color: (STATUS_STYLES[product.status] || STATUS_STYLES.pending).text
                                                            }}
                                                        />
                                                    </Box>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Shop & Dates Card */}
                                <Grid size={{xs: 12, md: 6}}>
                                    <Card sx={{height: '100%', boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 3}}>
                                        <CardContent sx={{p: 3}}>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary', mb: 1}}>
                                                Shop & Dates
                                            </Typography>
                                            <Divider sx={{mb: 1}}/>
                                            <Stack divider={<Divider sx={{opacity: 0.5}}/>}>
                                                <Stack direction="row" spacing={2} alignItems="center" sx={{py: 1.2}}>
                                                    <Box sx={{
                                                        width: 40, height: 40, borderRadius: 2,
                                                        background: '#10B98112',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                                    }}>
                                                        <StorefrontRounded sx={{fontSize: 20, color: '#10B981'}}/>
                                                    </Box>
                                                    <Box sx={{flex: 1, minWidth: 0}}>
                                                        <Typography sx={{fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                                            Shop Name
                                                        </Typography>
                                                        {product.shop?._id ? (
                                                            <Typography
                                                                component={Link}
                                                                to={`/shops/${product.shop._id}`}
                                                                sx={{
                                                                    fontSize: '0.9rem',
                                                                    color: '#0D6B3F',
                                                                    fontWeight: 600,
                                                                    mt: 0.1,
                                                                    textDecoration: 'none',
                                                                    '&:hover': {textDecoration: 'underline'}
                                                                }}
                                                            >
                                                                {product.shop?.name || 'N/A'}
                                                            </Typography>
                                                        ) : (
                                                            <Typography sx={{fontSize: '0.9rem', color: 'text.primary', fontWeight: 500, mt: 0.1}}>
                                                                {product.shop?.name || 'N/A'}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Stack>
                                                <InfoItem icon={TagRounded} label="Shop ID" value={product.shop?._id || 'N/A'} color="#6366F1"/>
                                                <InfoItem icon={CalendarMonthRounded} label="Created" value={formatDate(product.createdAt)} color="#3B82F6"/>
                                                <InfoItem icon={UpdateRounded} label="Last Updated" value={formatDate(product.updatedAt)} color="#8B5CF6"/>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* Product Image */}
                            {product.image && (
                                <Card sx={{overflow: 'hidden', boxShadow: 'none', border: '1px solid', borderColor: 'divider', borderRadius: 3}}>
                                    <CardContent sx={{p: 3}}>
                                        <Typography sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary', mb: 2}}>
                                            Product Image
                                        </Typography>
                                        {isPlaceholderImage(product.image) ? (
                                            <Box sx={{
                                                width: '100%',
                                                height: 280,
                                                borderRadius: 3,
                                                background: 'linear-gradient(135deg, #064E3B 0%, #059669 50%, #34D399 100%)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1
                                            }}>
                                                <SpaRounded sx={{fontSize: 64, color: 'rgba(255,255,255,0.3)'}}/>
                                                <Typography sx={{color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600}}>
                                                    No image available
                                                </Typography>
                                            </Box>
                                        ) : (
                                            <Box
                                                component="img"
                                                src={product.image}
                                                alt={product.name}
                                                sx={{
                                                    width: '100%',
                                                    maxHeight: 400,
                                                    objectFit: 'cover',
                                                    borderRadius: 3,
                                                    display: 'block'
                                                }}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    ) : null}

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                        open={deleteDialogOpen}
                        onClose={() => setDeleteDialogOpen(false)}
                        PaperProps={{
                            sx: {
                                borderRadius: 3,
                                p: 1,
                                maxWidth: 420
                            }
                        }}
                    >
                        <DialogTitle sx={{fontWeight: 700, fontSize: '1.1rem', pb: 0.5}}>
                            Delete Product
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{fontSize: '0.9rem', lineHeight: 1.6}}>
                                Are you sure you want to delete "{product?.name}"? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{px: 3, pb: 2.5, gap: 1}}>
                            <Button
                                onClick={() => setDeleteDialogOpen(false)}
                                sx={{
                                    color: 'text.secondary',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    px: 2.5
                                }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="contained"
                                sx={{
                                    backgroundColor: '#DC2626',
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    px: 2.5,
                                    boxShadow: 'none',
                                    '&:hover': {backgroundColor: '#B91C1C', boxShadow: 'none'}
                                }}>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
            </Box>
        </Layout>
    );
};

export default ProductDetailPage;
