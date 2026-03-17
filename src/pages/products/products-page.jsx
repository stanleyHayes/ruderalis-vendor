import Layout from "../../components/layout/layout";
import {
    Avatar, Box, Button, Card, CardContent, Chip, Container, Grid, IconButton,
    InputAdornment, Menu, MenuItem, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useState} from "react";
import {getProducts, deleteProduct, selectProducts} from "../../redux/features/products/products-slice";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import {
    Search, LocalFlorist, Add, Inventory2Rounded, CheckCircleRounded, WarningRounded, CategoryRounded,
    MoreVertRounded, EditRounded, DeleteRounded, VisibilityRounded, SortRounded, GridViewRounded,
    ViewListRounded, StarRounded, TrendingUpRounded, LocalOfferRounded, SpaRounded,
    FilterListRounded, FileDownloadRounded,
} from "@mui/icons-material";
import {TableSkeleton} from "../../components/shared/page-skeleton";

const VARIANTS = [
    {label: 'All', value: 'all', color: '#166534'},
    {label: 'Marijuana', value: 'marijuana', color: '#16A34A'},
    {label: 'Edible', value: 'edible', color: '#D97706'},
    {label: 'Accessory', value: 'accessory', color: '#4F46E5'},
];

const STATUS_STYLES = {
    active: {bg: '#D1FAE5', text: '#065F46', dot: '#22C55E'},
    pending: {bg: '#FEF3C7', text: '#92400E', dot: '#EAB308'},
    deleted: {bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444'},
};

const VARIANT_COLORS = {marijuana: '#16A34A', edible: '#D97706', accessory: '#4F46E5'};
const STRAIN_COLORS = {indica: '#7C3AED', sativa: '#EA580C', hybrid: '#059669', cbd: '#0891B2'};

const fmtGHS = (v) => `GH₵ ${(Number(v) || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

const ProductsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {products, loading} = useSelector(selectProducts);
    const [search, setSearch] = useState('');
    const [activeVariant, setActiveVariant] = useState('all');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [viewMode, setViewMode] = useState('table');
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuProduct, setMenuProduct] = useState(null);

    useEffect(() => { dispatch(getProducts()); }, [dispatch]);

    const filtered = useMemo(() => {
        let result = (products || []).filter(p => {
            const q = search.toLowerCase();
            const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
            const matchVariant = activeVariant === 'all' || p.variant === activeVariant;
            return matchSearch && matchVariant;
        });
        result.sort((a, b) => {
            let va, vb;
            if (sortBy === 'name') { va = a.name || ''; vb = b.name || ''; }
            else if (sortBy === 'price') { va = a.price?.amount || 0; vb = b.price?.amount || 0; }
            else if (sortBy === 'stock') { va = a.stock?.quantity || 0; vb = b.stock?.quantity || 0; }
            else if (sortBy === 'rating') { va = a.rating?.average || 0; vb = b.rating?.average || 0; }
            else { va = a.createdAt || ''; vb = b.createdAt || ''; }
            if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
            return sortDir === 'asc' ? va - vb : vb - va;
        });
        return result;
    }, [products, search, activeVariant, sortBy, sortDir]);

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const stats = useMemo(() => ({
        total: (products || []).length,
        active: (products || []).filter(p => p.status === 'active').length,
        pending: (products || []).filter(p => p.status !== 'active').length,
        variants: new Set((products || []).map(p => p.variant)).size,
        totalValue: (products || []).reduce((s, p) => s + ((p.price?.amount || 0) * (p.stock?.quantity || 0)), 0),
        avgPrice: (products || []).length > 0 ? (products || []).reduce((s, p) => s + (p.price?.amount || 0), 0) / (products || []).length : 0,
    }), [products]);

    const handleSort = (field) => {
        if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(field); setSortDir('asc'); }
    };

    const handleMenuOpen = (e, product) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); setMenuProduct(product); };
    const handleMenuClose = () => { setMenuAnchor(null); setMenuProduct(null); };

    const handleDelete = async () => {
        if (menuProduct) { await dispatch(deleteProduct(menuProduct._id)); handleMenuClose(); }
    };

    const SortableHeader = ({label, field, align}) => (
        <TableCell align={align} onClick={() => handleSort(field)}
            sx={{fontWeight: 700, color: sortBy === field ? 'primary.main' : 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', py: 1.5, cursor: 'pointer', userSelect: 'none', '&:hover': {color: 'primary.main'}, whiteSpace: 'nowrap'}}>
            <Stack direction="row" spacing={0.5} alignItems="center" justifyContent={align === 'right' ? 'flex-end' : 'flex-start'}>
                <span>{label}</span>
                {sortBy === field && <SortRounded sx={{fontSize: 14, transform: sortDir === 'desc' ? 'rotate(180deg)' : 'none'}}/>}
            </Stack>
        </TableCell>
    );

    return (
        <Layout>
            <Container maxWidth="xl">
                <Stack spacing={2.5}>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #14532D, #22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <SpaRounded sx={{color: '#fff', fontSize: 22}}/>
                            </Box>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography sx={{fontWeight: 800, fontSize: '1.4rem', color: 'text.primary'}}>Products</Typography>
                                    {!loading && <Chip label={filtered.length} size="small" sx={{height: 22, fontSize: '0.7rem', fontWeight: 700, bgcolor: '#D1FAE5', color: '#065F46'}}/>}
                                </Stack>
                                <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>Manage your product catalog</Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                            <Button component={Link} to="/products/new" variant="contained" startIcon={<Add/>} sx={{px: 3}}>Add Product</Button>
                        </Stack>
                    </Stack>

                    {/* Stats */}
                    {!loading && (
                        <Grid container spacing={2}>
                            {[
                                {icon: Inventory2Rounded, label: 'Total Products', value: stats.total, color: '#166534'},
                                {icon: CheckCircleRounded, label: 'Active', value: stats.active, color: '#16A34A'},
                                {icon: WarningRounded, label: 'Pending', value: stats.pending, color: '#EAB308'},
                                {icon: LocalOfferRounded, label: 'Avg Price', value: fmtGHS(stats.avgPrice), color: '#2563EB'},
                                {icon: TrendingUpRounded, label: 'Inventory Value', value: fmtGHS(stats.totalValue), color: '#7C3AED'},
                                {icon: CategoryRounded, label: 'Variants', value: stats.variants, color: '#0891B2'},
                            ].map(s => (
                                <Grid key={s.label} size={{xs: 6, sm: 4, lg: 2}}>
                                    <Card sx={{border: 'none', background: `${s.color}06`}}>
                                        <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Box sx={{width: 34, height: 34, borderRadius: 1.5, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <s.icon sx={{fontSize: 17, color: s.color}}/>
                                                </Box>
                                                <Box>
                                                    <Typography sx={{fontSize: '1rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.2}}>{s.value}</Typography>
                                                    <Typography sx={{fontSize: '0.62rem', color: 'text.secondary', fontWeight: 500}}>{s.label}</Typography>
                                                </Box>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* Toolbar */}
                    <Card>
                        <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems={{sm: 'center'}}>
                                <TextField fullWidth placeholder="Search products by name or description..." value={search}
                                    onChange={(e) => {setSearch(e.target.value); setPage(0);}} size="small"
                                    slotProps={{input: {startAdornment: <InputAdornment position="start"><Search sx={{fontSize: 20, color: 'text.secondary'}}/></InputAdornment>}}}
                                    sx={{flex: 1}}/>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Stack direction="row" spacing={0.5}>
                                        {VARIANTS.map(v => (
                                            <Chip key={v.value} label={v.label} size="small"
                                                onClick={() => {setActiveVariant(v.value); setPage(0);}}
                                                sx={{
                                                    fontWeight: 600, fontSize: '0.72rem', cursor: 'pointer',
                                                    bgcolor: activeVariant === v.value ? v.color : 'transparent',
                                                    color: activeVariant === v.value ? '#fff' : 'text.secondary',
                                                    border: activeVariant === v.value ? 'none' : '1px solid',
                                                    borderColor: 'divider',
                                                    '&:hover': {bgcolor: activeVariant === v.value ? v.color : 'action.hover'}
                                                }}/>
                                        ))}
                                    </Stack>
                                    <Box sx={{borderLeft: '1px solid', borderColor: 'divider', height: 24, mx: 0.5}}/>
                                    <Tooltip title="Table view"><IconButton size="small" onClick={() => setViewMode('table')} sx={{color: viewMode === 'table' ? 'primary.main' : 'text.secondary'}}><ViewListRounded sx={{fontSize: 20}}/></IconButton></Tooltip>
                                    <Tooltip title="Grid view"><IconButton size="small" onClick={() => setViewMode('grid')} sx={{color: viewMode === 'grid' ? 'primary.main' : 'text.secondary'}}><GridViewRounded sx={{fontSize: 20}}/></IconButton></Tooltip>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Content */}
                    {loading ? <TableSkeleton/> : filtered.length === 0 ? (
                        <Card>
                            <CardContent sx={{p: 3}}>
                                <Box sx={{textAlign: 'center', py: 8}}>
                                    <Box sx={{width: 70, height: 70, borderRadius: 3, mx: 'auto', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'light.secondary'}}>
                                        <SpaRounded sx={{fontSize: 36, color: 'secondary.main'}}/>
                                    </Box>
                                    <Typography sx={{fontWeight: 700, color: 'text.primary', mb: 0.5}}>No products found</Typography>
                                    <Typography sx={{color: 'text.secondary', fontSize: '0.85rem', mb: 2}}>
                                        {search || activeVariant !== 'all' ? 'Try adjusting your search or filters' : 'Get started by adding your first product'}
                                    </Typography>
                                    {!search && activeVariant === 'all' && (
                                        <Button component={Link} to="/products/new" variant="outlined" startIcon={<Add/>}>Add Product</Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    ) : viewMode === 'grid' ? (
                        /* Grid View */
                        <>
                            <Grid container spacing={2}>
                                {paginated.map((p) => {
                                    const vColor = VARIANT_COLORS[p.variant] || '#6B7280';
                                    const sStyle = STATUS_STYLES[p.status] || STATUS_STYLES.pending;
                                    return (
                                        <Grid key={p._id} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
                                            <Card onClick={() => navigate(`/products/${p._id}`)} sx={{cursor: 'pointer', transition: 'all 0.2s', '&:hover': {transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.08)', borderColor: 'secondary.main'}}}>
                                                <Box sx={{height: 8, background: `linear-gradient(90deg, ${vColor}, ${vColor}80)`}}/>
                                                <CardContent sx={{p: 2.5}}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{mb: 1.5}}>
                                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                                            <Avatar sx={{width: 40, height: 40, borderRadius: 1.5, bgcolor: `${vColor}12`, color: vColor, fontWeight: 800, fontSize: '0.9rem'}}>
                                                                {(p.name || '?')[0]}
                                                            </Avatar>
                                                            <Box sx={{minWidth: 0}}>
                                                                <Typography sx={{fontWeight: 700, fontSize: '0.88rem', color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140}}>
                                                                    {p.name}
                                                                </Typography>
                                                                <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', textTransform: 'capitalize'}}>{p.variant}</Typography>
                                                            </Box>
                                                        </Stack>
                                                        <Box sx={{width: 8, height: 8, borderRadius: '50%', bgcolor: sStyle.dot, mt: 0.5}}/>
                                                    </Stack>
                                                    {p.strain && <Chip label={p.strain} size="small" sx={{height: 20, fontSize: '0.62rem', fontWeight: 600, bgcolor: `${STRAIN_COLORS[p.strain] || '#6B7280'}12`, color: STRAIN_COLORS[p.strain] || '#6B7280', mb: 1.5, textTransform: 'capitalize'}}/>}
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mt: 'auto'}}>
                                                        <Typography sx={{fontWeight: 800, fontSize: '1rem', color: 'text.primary'}}>{fmtGHS(p.price?.amount)}</Typography>
                                                        <Typography sx={{fontSize: '0.72rem', color: p.stock?.quantity > 0 ? 'text.secondary' : '#EF4444', fontWeight: 600}}>
                                                            {p.stock?.quantity > 0 ? `${p.stock.quantity} in stock` : 'Out of stock'}
                                                        </Typography>
                                                    </Stack>
                                                    {p.rating?.average > 0 && (
                                                        <Stack direction="row" spacing={0.3} alignItems="center" sx={{mt: 1}}>
                                                            <StarRounded sx={{fontSize: 14, color: '#EAB308'}}/>
                                                            <Typography sx={{fontSize: '0.72rem', fontWeight: 600, color: 'text.secondary'}}>{p.rating.average} ({p.rating.count})</Typography>
                                                        </Stack>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                            <TablePagination component="div" count={filtered.length} page={page}
                                onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => {setRowsPerPage(parseInt(e.target.value, 10)); setPage(0);}}
                                rowsPerPageOptions={[10, 20, 40]}/>
                        </>
                    ) : (
                        /* Table View */
                        <Card>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{bgcolor: 'action.hover'}}>
                                            <TableCell sx={{fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5, pl: 2.5}}>Product</TableCell>
                                            <SortableHeader label="Variant" field="variant"/>
                                            <SortableHeader label="Strain" field="strain"/>
                                            <SortableHeader label="Price" field="price" align="right"/>
                                            <SortableHeader label="Stock" field="stock" align="right"/>
                                            <SortableHeader label="Rating" field="rating" align="center"/>
                                            <TableCell sx={{fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5}} align="center">Status</TableCell>
                                            <TableCell sx={{fontWeight: 700, color: 'text.secondary', fontSize: '0.7rem', textTransform: 'uppercase', py: 1.5, pr: 2.5}} align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginated.map(p => {
                                            const vColor = VARIANT_COLORS[p.variant] || '#6B7280';
                                            const sStyle = STATUS_STYLES[p.status] || STATUS_STYLES.pending;
                                            return (
                                                <TableRow key={p._id} hover onClick={() => navigate(`/products/${p._id}`)}
                                                    sx={{cursor: 'pointer', '&:last-child td': {border: 0}}}>
                                                    <TableCell sx={{py: 1.5, pl: 2.5}}>
                                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                                            <Avatar sx={{width: 38, height: 38, borderRadius: 1.5, bgcolor: `${vColor}10`, color: vColor, fontWeight: 700, fontSize: '0.85rem'}}>
                                                                {(p.name || '?')[0]}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography sx={{fontWeight: 600, fontSize: '0.85rem', color: 'text.primary'}}>{p.name}</Typography>
                                                                <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                                                    {p.shop?.name || p.description?.slice(0, 40)}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip label={p.variant || 'N/A'} size="small" sx={{height: 22, fontSize: '0.68rem', fontWeight: 600, bgcolor: `${vColor}10`, color: vColor, textTransform: 'capitalize'}}/>
                                                    </TableCell>
                                                    <TableCell>
                                                        {p.strain ? (
                                                            <Chip label={p.strain} size="small" variant="outlined" sx={{height: 22, fontSize: '0.68rem', fontWeight: 600, borderColor: STRAIN_COLORS[p.strain] || '#6B7280', color: STRAIN_COLORS[p.strain] || '#6B7280', textTransform: 'capitalize'}}/>
                                                        ) : <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>—</Typography>}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography sx={{fontWeight: 700, fontSize: '0.85rem', color: 'text.primary'}}>{fmtGHS(p.price?.amount)}</Typography>
                                                        {p.sale?.status && <Typography sx={{fontSize: '0.62rem', color: '#EF4444', textDecoration: 'line-through'}}>{fmtGHS(p.sale.price?.amount)}</Typography>}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Typography sx={{fontWeight: 600, fontSize: '0.85rem', color: p.stock?.quantity > 0 ? 'text.primary' : '#EF4444'}}>
                                                            {p.stock?.quantity ?? 0}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {p.rating?.average > 0 ? (
                                                            <Stack direction="row" spacing={0.3} alignItems="center" justifyContent="center">
                                                                <StarRounded sx={{fontSize: 14, color: '#EAB308'}}/>
                                                                <Typography sx={{fontSize: '0.78rem', fontWeight: 600}}>{p.rating.average}</Typography>
                                                            </Stack>
                                                        ) : <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>—</Typography>}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                                                            <Box sx={{width: 6, height: 6, borderRadius: '50%', bgcolor: sStyle.dot}}/>
                                                            <Typography sx={{fontSize: '0.72rem', fontWeight: 600, color: sStyle.text, textTransform: 'capitalize'}}>{p.status}</Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="right" sx={{pr: 2.5}}>
                                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, p)} sx={{color: 'text.secondary'}}>
                                                            <MoreVertRounded sx={{fontSize: 18}}/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination component="div" count={filtered.length} page={page}
                                onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => {setRowsPerPage(parseInt(e.target.value, 10)); setPage(0);}}
                                rowsPerPageOptions={[5, 10, 25]}
                                sx={{borderTop: '1px solid', borderColor: 'divider', '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {fontSize: '0.78rem', color: 'text.secondary'}}}/>
                        </Card>
                    )}

                    {/* Context Menu */}
                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}
                        slotProps={{paper: {sx: {borderRadius: 2, minWidth: 160, boxShadow: '0 4px 20px rgba(0,0,0,0.12)'}}}}>
                        <MenuItem onClick={() => {navigate(`/products/${menuProduct?._id}`); handleMenuClose();}} sx={{fontSize: '0.82rem', gap: 1.5}}>
                            <VisibilityRounded sx={{fontSize: 18, color: 'text.secondary'}}/> View Details
                        </MenuItem>
                        <MenuItem onClick={() => {navigate(`/products/${menuProduct?._id}/edit`); handleMenuClose();}} sx={{fontSize: '0.82rem', gap: 1.5}}>
                            <EditRounded sx={{fontSize: 18, color: 'text.secondary'}}/> Edit Product
                        </MenuItem>
                        <MenuItem onClick={handleDelete} sx={{fontSize: '0.82rem', gap: 1.5, color: '#EF4444'}}>
                            <DeleteRounded sx={{fontSize: 18}}/> Delete
                        </MenuItem>
                    </Menu>
                </Stack>
            </Container>
        </Layout>
    );
};

export default ProductsPage;
