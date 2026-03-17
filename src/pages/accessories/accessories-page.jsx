import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import {
    Box, Button, Card, CardContent, Chip, Container, Grid,
    InputAdornment, Stack, TextField, Typography,
} from "@mui/material";
import {Add, BuildRounded, SearchRounded} from "@mui/icons-material";
import {CardGridSkeleton} from "../../components/shared/page-skeleton";
import Layout from "../../components/layout/layout";
import {getProducts, selectProducts} from "../../redux/features/products/products-slice";

const GRADIENTS = [
    'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)',
    'linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #818CF8 100%)',
    'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)',
    'linear-gradient(135deg, #3730A3 0%, #4F46E5 50%, #6366F1 100%)',
];

const fmtGHS = (v) => `GH₵ ${(Number(v) || 0).toFixed(2)}`;

const MiniStat = ({label, value, color}) => (
    <Card sx={{flex: 1, minWidth: 0, border: 'none', background: `${color}08`}}>
        <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
            <Typography sx={{fontSize: '1.1rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.2}}>{value}</Typography>
            <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', fontWeight: 500}}>{label}</Typography>
        </CardContent>
    </Card>
);

const AccessoriesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {products, loading} = useSelector(selectProducts);
    const [search, setSearch] = useState('');

    useEffect(() => { dispatch(getProducts()); }, [dispatch]);

    const accessories = useMemo(() => (products || []).filter(p => p.variant === 'accessory'), [products]);
    const filtered = useMemo(() => {
        if (!search.trim()) return accessories;
        const q = search.toLowerCase();
        return accessories.filter(p => p.name?.toLowerCase().includes(q));
    }, [accessories, search]);

    const stats = useMemo(() => {
        const total = accessories.length;
        const inStock = accessories.filter(p => p.stock?.quantity > 0).length;
        const avg = total > 0 ? accessories.reduce((s, p) => s + (p.price?.amount || 0), 0) / total : 0;
        return {total, inStock, outOfStock: total - inStock, avg};
    }, [accessories]);

    return (
        <Layout>
            <Container maxWidth="xl">
                <Stack spacing={2.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <BuildRounded sx={{color: '#fff', fontSize: 22}}/>
                            </Box>
                            <Typography sx={{fontWeight: 800, fontSize: '1.4rem', color: 'text.primary'}}>Accessories</Typography>
                        </Stack>
                        <Button component={Link} to="/products/new" variant="contained" startIcon={<Add/>}
                            sx={{bgcolor: '#4F46E5', '&:hover': {bgcolor: '#4338CA'}}}>
                            Add Accessory
                        </Button>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{flexWrap: 'wrap', gap: 2}}>
                        <MiniStat label="Total Accessories" value={stats.total} color="#3B82F6"/>
                        <MiniStat label="In Stock" value={stats.inStock} color="#10B981"/>
                        <MiniStat label="Out of Stock" value={stats.outOfStock} color="#EF4444"/>
                        <MiniStat label="Avg Price" value={fmtGHS(stats.avg)} color="#8B5CF6"/>
                    </Stack>

                    <TextField fullWidth placeholder="Search accessories..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        slotProps={{input: {startAdornment: <InputAdornment position="start"><SearchRounded sx={{fontSize: 20, color: 'text.secondary'}}/></InputAdornment>}}}
                        sx={{'& .MuiOutlinedInput-root': {borderRadius: 2, bgcolor: 'background.paper'}}}/>

                    {loading ? <CardGridSkeleton count={4}/> : filtered.length === 0 ? (
                        <Box sx={{textAlign: 'center', py: 10}}>
                            <Box sx={{width: 80, height: 80, borderRadius: 4, mx: 'auto', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#EEF2FF'}}>
                                <BuildRounded sx={{fontSize: 40, color: '#4F46E5'}}/>
                            </Box>
                            <Typography sx={{fontWeight: 700, color: 'text.primary', mb: 1}}>No accessories found</Typography>
                            <Typography sx={{color: 'text.secondary', fontSize: '0.85rem', mb: 2}}>{search ? 'Try a different search' : 'Add your first accessory product'}</Typography>
                            {!search && <Button component={Link} to="/products/new" variant="outlined" startIcon={<Add/>} sx={{borderColor: '#4F46E5', color: '#4F46E5'}}>Add Accessory</Button>}
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {filtered.map((p, i) => (
                                <Grid key={p._id} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
                                    <Card onClick={() => navigate(`/products/${p._id}`)}
                                        sx={{cursor: 'pointer', overflow: 'hidden', transition: 'all 0.2s', '&:hover': {transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', borderColor: '#6366F1'}}}>
                                        <Box sx={{height: 120, background: GRADIENTS[i % GRADIENTS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'}}>
                                            <Box sx={{position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)'}}/>
                                            <Box sx={{width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <Typography sx={{fontSize: 22, fontWeight: 800, color: '#fff'}}>{(p.name || '?')[0]}</Typography>
                                            </Box>
                                        </Box>
                                        <CardContent sx={{p: 2.5}}>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary', mb: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{p.name}</Typography>
                                            {p.description && <Typography sx={{color: 'text.secondary', fontSize: '0.75rem', mb: 1.5, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{p.description}</Typography>}
                                            <Stack direction="row" spacing={0.75} sx={{mb: 1.5}} flexWrap="wrap" useFlexGap>
                                                {p.metadata?.accessory?.material && <Chip label={p.metadata.accessory.material} size="small" sx={{height: 22, fontSize: '0.65rem', fontWeight: 600, bgcolor: '#EEF2FF', color: '#4338CA'}}/>}
                                                {p.metadata?.accessory?.color && <Chip label={p.metadata.accessory.color} size="small" variant="outlined" sx={{height: 22, fontSize: '0.65rem', fontWeight: 600}}/>}
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{fontWeight: 800, fontSize: '1.05rem', color: 'text.primary'}}>{fmtGHS(p.price?.amount)}</Typography>
                                                <Box sx={{px: 1, py: 0.3, borderRadius: 1, fontSize: '0.65rem', fontWeight: 700, bgcolor: p.stock?.quantity > 0 ? '#D1FAE5' : '#FEE2E2', color: p.stock?.quantity > 0 ? '#065F46' : '#991B1B'}}>
                                                    {p.stock?.quantity > 0 ? `${p.stock.quantity} in stock` : 'Out of stock'}
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
        </Layout>
    );
};

export default AccessoriesPage;
