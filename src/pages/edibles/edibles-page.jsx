import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    InputAdornment,
    Rating,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    Add,
    CookieRounded,
    SearchRounded,
    InventoryRounded,
    RemoveShoppingCartRounded,
    StarRounded,
} from "@mui/icons-material";
import {CardGridSkeleton} from "../../components/shared/page-skeleton";
import Layout from "../../components/layout/layout";
import {getProducts, selectProducts} from "../../redux/features/products/products-slice";

const EDIBLE_GRADIENTS = [
    'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
    'linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)',
    'linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%)',
    'linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #F97316 100%)',
    'linear-gradient(135deg, #92400E 0%, #B45309 50%, #D97706 100%)',
    'linear-gradient(135deg, #9A3412 0%, #C2410C 50%, #EA580C 100%)',
];

const StatCard = ({label, value, color}) => (
    <Card sx={{borderRadius: '8px', boxShadow: 'none', border: '1px solid', borderColor: 'divider', flex: 1}}>
        <CardContent sx={{p: 2.5, '&:last-child': {pb: 2.5}}}>
            <Typography sx={{fontSize: 12, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5}}>
                {label}
            </Typography>
            <Typography sx={{fontSize: 28, fontWeight: 800, color: color || 'text.primary'}}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const EdiblesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {products, loading} = useSelector(selectProducts);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const edibles = useMemo(() => {
        return (products || []).filter(p => p.variant === 'edible');
    }, [products]);

    const filteredEdibles = useMemo(() => {
        if (!search.trim()) return edibles;
        const q = search.toLowerCase();
        return edibles.filter(p => p.name?.toLowerCase().includes(q));
    }, [edibles, search]);

    const stats = useMemo(() => {
        const total = edibles.length;
        const inStock = edibles.filter(p => p.stock?.quantity > 0).length;
        const outOfStock = total - inStock;
        const avgPrice = total > 0
            ? (edibles.reduce((sum, p) => sum + (p.price?.amount || 0), 0) / total).toFixed(2)
            : '0.00';
        return {total, inStock, outOfStock, avgPrice};
    }, [edibles]);

    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        {/* Header */}
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                <Box sx={{
                                    width: 44, height: 44, borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
                                }}>
                                    <CookieRounded sx={{fontSize: 24, color: '#fff'}} />
                                </Box>
                                <Typography variant="h4" sx={{color: "text.primary", fontWeight: 700}}>
                                    Edibles
                                </Typography>
                            </Box>
                            <Button
                                component={Link}
                                to="/products/new"
                                variant="contained"
                                startIcon={<Add />}
                                sx={{
                                    backgroundColor: '#B45309',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 3,
                                    '&:hover': {backgroundColor: '#92400E'}
                                }}
                            >
                                Add Edible
                            </Button>
                        </Box>

                        {/* Stats Row */}
                        <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                            <StatCard label="Total Edibles" value={stats.total} color="#B45309" />
                            <StatCard label="In Stock" value={stats.inStock} color="#059669" />
                            <StatCard label="Out of Stock" value={stats.outOfStock} color="#DC2626" />
                            <StatCard label="Average Price" value={`GH₵ ${stats.avgPrice}`} color="#7C3AED" />
                        </Stack>

                        {/* Search */}
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search edibles by name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            slotProps={{input: {startAdornment: (<InputAdornment position="start"><SearchRounded sx={{fontSize: 20, color: 'text.secondary'}}/></InputAdornment>)}}}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    backgroundColor: 'background.paper',
                                }
                            }}
                        />

                        {/* Grid */}
                        {loading ? (
                            <CardGridSkeleton count={4} />
                        ) : filteredEdibles.length === 0 ? (
                            <Box sx={{textAlign: 'center', py: 10}}>
                                <Box sx={{
                                    width: 80, height: 80, borderRadius: '20px', mx: 'auto', mb: 3,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: '#FEF3C7',
                                }}>
                                    <CookieRounded sx={{fontSize: 40, color: '#B45309'}} />
                                </Box>
                                <Typography variant="h6" sx={{color: 'text.primary', fontWeight: 700, mb: 1}}>
                                    No edibles found
                                </Typography>
                                <Typography sx={{color: 'text.secondary', fontSize: 14, mb: 3}}>
                                    {search ? 'Try a different search term' : 'Get started by adding your first edible product'}
                                </Typography>
                                {!search && (
                                    <Button
                                        component={Link}
                                        to="/products/new"
                                        variant="outlined"
                                        startIcon={<Add />}
                                        sx={{
                                            borderColor: '#B45309',
                                            color: '#B45309',
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            '&:hover': {backgroundColor: '#FEF3C7', borderColor: '#92400E'}
                                        }}
                                    >
                                        Add Edible
                                    </Button>
                                )}
                            </Box>
                        ) : (
                            <Grid container spacing={2}>
                                {filteredEdibles.map((product, i) => (
                                    <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={product._id}>
                                        <Card
                                            onClick={() => navigate(`/products/${product._id}`)}
                                            sx={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                boxShadow: 'none',
                                                borderRadius: '8px',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                                                    borderColor: '#D97706',
                                                }
                                            }}
                                        >
                                            {/* Gradient header */}
                                            <Box sx={{
                                                height: 140,
                                                background: EDIBLE_GRADIENTS[i % EDIBLE_GRADIENTS.length],
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                overflow: 'hidden',
                                            }}>
                                                <Box sx={{
                                                    position: 'absolute', top: -20, right: -20,
                                                    width: 100, height: 100, borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.1)',
                                                }} />
                                                <Box sx={{
                                                    position: 'absolute', bottom: -30, left: -10,
                                                    width: 70, height: 70, borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.08)',
                                                }} />
                                                <Box sx={{
                                                    width: 64, height: 64, borderRadius: '16px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                                    backdropFilter: 'blur(10px)',
                                                }}>
                                                    <Typography sx={{fontSize: 28, fontWeight: 800, color: '#fff'}}>
                                                        {(product.name || '?')[0].toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <CardContent sx={{p: 2.5, flex: 1, display: "flex", flexDirection: "column"}}>
                                                <Typography variant="subtitle1" sx={{
                                                    color: "text.primary", fontWeight: 700, mb: 0.5, fontSize: '0.95rem',
                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                }}>
                                                    {product.name}
                                                </Typography>

                                                {product.description && (
                                                    <Typography sx={{
                                                        color: 'text.secondary', fontSize: '0.78rem', mb: 1.5, lineHeight: 1.4,
                                                        overflow: 'hidden', textOverflow: 'ellipsis',
                                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                                    }}>
                                                        {product.description}
                                                    </Typography>
                                                )}

                                                {/* THC/CBD badges */}
                                                <Stack direction="row" spacing={0.75} sx={{mb: 1.5}} flexWrap="wrap" useFlexGap>
                                                    {(product.thc != null && product.thc > 0) && (
                                                        <Chip
                                                            label={`THC: ${product.thc}mg`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(217,119,6,0.08)',
                                                                color: '#B45309',
                                                                fontWeight: 700,
                                                                fontSize: '0.68rem',
                                                                height: 24,
                                                            }}
                                                        />
                                                    )}
                                                    {(product.cbd != null && product.cbd > 0) && (
                                                        <Chip
                                                            label={`CBD: ${product.cbd}mg`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(59,130,246,0.08)',
                                                                color: '#2563EB',
                                                                fontWeight: 700,
                                                                fontSize: '0.68rem',
                                                                height: 24,
                                                            }}
                                                        />
                                                    )}
                                                </Stack>

                                                {/* Flavor & Servings */}
                                                {(product.metadata?.edible?.flavor || product.metadata?.edible?.servings) && (
                                                    <Stack direction="row" spacing={0.75} sx={{mb: 1.5}} flexWrap="wrap" useFlexGap>
                                                        {product.metadata.edible.flavor && (
                                                            <Chip
                                                                label={product.metadata.edible.flavor}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    borderColor: '#D97706',
                                                                    color: '#B45309',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.68rem',
                                                                    height: 24,
                                                                }}
                                                            />
                                                        )}
                                                        {product.metadata.edible.servings && (
                                                            <Chip
                                                                label={`${product.metadata.edible.servings} servings`}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    borderColor: 'divider',
                                                                    color: 'text.secondary',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.68rem',
                                                                    height: 24,
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>
                                                )}

                                                <Box sx={{flex: 1}} />

                                                {/* Rating */}
                                                {product.rating != null && product.rating > 0 && (
                                                    <Box sx={{mb: 1}}>
                                                        <Rating
                                                            value={product.rating}
                                                            readOnly
                                                            size="small"
                                                            precision={0.5}
                                                            icon={<StarRounded sx={{fontSize: 18}} />}
                                                            emptyIcon={<StarRounded sx={{fontSize: 18}} />}
                                                        />
                                                    </Box>
                                                )}

                                                {/* Price & Stock */}
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mt: 0.5}}>
                                                    <Typography variant="h6" sx={{color: "text.primary", fontWeight: 800, fontSize: '1.15rem'}}>
                                                        GH₵ {(product.price?.amount || 0).toFixed(2)}
                                                    </Typography>
                                                    <Box sx={{
                                                        display: 'inline-block',
                                                        px: 1.2, py: 0.3, borderRadius: 1.5,
                                                        fontSize: '0.7rem', fontWeight: 700,
                                                        backgroundColor: product.stock?.quantity > 0 ? '#D1FAE5' : '#FEE2E2',
                                                        color: product.stock?.quantity > 0 ? '#065F46' : '#991B1B',
                                                    }}>
                                                        {product.stock?.quantity > 0 ? `${product.stock.quantity} in stock` : "Out of stock"}
                                                    </Box>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default EdiblesPage;
