import Layout from "../../components/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {getOrders, selectOrders} from "../../redux/features/orders/orders-slice";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    InputAdornment,
    Snackbar,
    Alert,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import {
    Search,
    Receipt,
    ReceiptLongRounded,
    HourglassEmptyRounded,
    CheckCircleRounded,
    AttachMoneyRounded,
    CreditCard,
    AccountBalance,
    LocalAtm,
    FileDownloadRounded,
    InboxRounded,
} from "@mui/icons-material";
import {TableSkeleton} from "../../components/shared/page-skeleton";

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

const fmtGHS = (v) => `GH₵ ${(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

const STATUS_STYLES = {
    pending: {bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B'},
    delivering: {bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6'},
    completed: {bg: '#D1FAE5', text: '#065F46', dot: '#10B981'},
    cancelled: {bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444'},
};

const PAYMENT_ICONS = {
    mobile_money: LocalAtm,
};

const TABS = ['all', 'pending', 'delivering', 'completed', 'cancelled'];

const OrdersPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {orders, loading} = useSelector(selectOrders);
    const [tab, setTab] = useState(0);
    const [search, setSearch] = useState('');
    const [snackbar, setSnackbar] = useState({open: false, message: ''});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(getOrders());
    }, [dispatch]);

    const filtered = orders.filter(order => {
        const matchesTab = tab === 0 || order.status === TABS[tab];
        const matchesSearch = search === '' ||
            order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.fullName?.toLowerCase().includes(search.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const paginatedOrders = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const getTabCount = (status) => {
        if (status === 'all') return orders.length;
        return orders.filter(o => o.status === status).length;
    };

    const handleExport = () => {
        setSnackbar({open: true, message: 'Export started. Your file will download shortly.'});
    };

    const getPaymentMethodIcon = (method) => {
        const Icon = PAYMENT_ICONS[method] || LocalAtm;
        return <Icon sx={{fontSize: 16, color: 'text.secondary'}}/>;
    };

    const formatPaymentMethod = (method) => {
        if (!method) return 'N/A';
        return method.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    return (
        <Layout>
            <Box sx={{overflow: 'auto', maxHeight: '100vh', py: 3}}>
                <Container maxWidth="xl">
                    {/* Header */}
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                            <Typography variant="h4" sx={{color: 'text.primary', fontWeight: 700}}>
                                Orders
                            </Typography>
                            {!loading && (
                                <Box sx={{
                                    backgroundColor: '#DBEAFE',
                                    color: '#1E40AF',
                                    px: 1.5,
                                    py: 0.25,
                                    borderRadius: '6px',
                                    fontSize: 13,
                                    fontWeight: 600
                                }}>
                                    {filtered.length}
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* Stats */}
                    {!loading && (
                        <Stack direction="row" spacing={2} sx={{mb: 2.5, flexWrap: 'wrap', gap: 2}}>
                            <MiniStat icon={ReceiptLongRounded} label="Total Orders" value={orders.length.toLocaleString()} color="#3B82F6"/>
                            <MiniStat icon={HourglassEmptyRounded} label="Pending" value={orders.filter(o => o.status === 'pending').length.toLocaleString()} color="#F59E0B"/>
                            <MiniStat icon={CheckCircleRounded} label="Completed" value={orders.filter(o => o.status === 'completed').length.toLocaleString()} color="#10B981"/>
                            <MiniStat icon={AttachMoneyRounded} label="Total Revenue" value={fmtGHS(orders.reduce((sum, o) => sum + (o.price?.amount || 0), 0))} color="#059669"/>
                        </Stack>
                    )}

                    {/* Tabs */}
                    <Tabs
                        value={tab}
                        onChange={(e, v) => { setTab(v); setPage(0); }}
                        sx={{
                            mb: 3,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: 14,
                                minHeight: 40,
                                py: 1
                            },
                            '& .Mui-selected': {
                                color: '#0D6B3F'
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#0D6B3F'
                            }
                        }}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        {TABS.map(t => {
                            const statusStyle = STATUS_STYLES[t];
                            return (
                                <Tab
                                    key={t}
                                    label={
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            {t !== 'all' && (
                                                <Box sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: '50%',
                                                    backgroundColor: statusStyle?.dot || '#6B7280',
                                                    flexShrink: 0,
                                                }}/>
                                            )}
                                            <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>
                                            <Box sx={{
                                                backgroundColor: tab === TABS.indexOf(t)
                                                    ? 'rgba(13,107,63,0.1)'
                                                    : 'rgba(0,0,0,0.06)',
                                                color: tab === TABS.indexOf(t)
                                                    ? '#0D6B3F'
                                                    : 'text.secondary',
                                                px: 1,
                                                py: 0.125,
                                                borderRadius: '6px',
                                                fontSize: 12,
                                                fontWeight: 600,
                                                minWidth: 20,
                                                textAlign: 'center'
                                            }}>
                                                {getTabCount(t)}
                                            </Box>
                                        </Box>
                                    }
                                />
                            );
                        })}
                    </Tabs>

                    {/* Search + Export */}
                    <Stack direction="row" spacing={2} sx={{mb: 3}}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Search by order number or customer name..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(0); }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{color: 'text.secondary', fontSize: 20}}/>
                                        </InputAdornment>
                                    )
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '4px',
                                    backgroundColor: 'background.paper'
                                }
                            }}
                        />
                        <Button
                            variant="outlined"
                            startIcon={<FileDownloadRounded sx={{fontSize: 18}}/>}
                            onClick={handleExport}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: '4px',
                                borderColor: 'divider',
                                color: 'text.primary',
                                px: 3,
                                whiteSpace: 'nowrap',
                                '&:hover': {borderColor: '#0D6B3F', color: '#0D6B3F'},
                            }}
                        >
                            Export
                        </Button>
                    </Stack>

                    {loading && orders.length === 0 && <TableSkeleton/>}

                    {/* Table */}
                    <TableContainer sx={{
                        backgroundColor: 'background.paper',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden'
                    }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{backgroundColor: 'rgba(0,0,0,0.02)'}}>
                                    {['Order Number', 'Customer', 'Total', 'Status', 'Payment Method', 'Payment Status', 'Date'].map(h => (
                                        <TableCell key={h} sx={{
                                            fontWeight: 700,
                                            color: 'text.secondary',
                                            fontSize: 12,
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                            borderBottom: '2px solid',
                                            borderColor: 'divider',
                                            py: 2,
                                            px: 2.5,
                                        }}>
                                            {h}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedOrders.map(order => (
                                    <TableRow
                                        key={order._id}
                                        onClick={() => navigate(`/orders/${order._id}`)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'background-color 0.15s',
                                            '&:hover': {backgroundColor: 'rgba(16,185,129,0.06)'},
                                            '&:last-child td': {borderBottom: 0}
                                        }}
                                    >
                                        <TableCell sx={{color: 'text.primary', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider', py: 2, px: 2.5, fontSize: 13}}>
                                            {order.orderNumber}
                                        </TableCell>
                                        <TableCell sx={{color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider', py: 2, px: 2.5, fontSize: 13}}>
                                            {order.user?.fullName}
                                        </TableCell>
                                        <TableCell sx={{color: 'text.primary', fontWeight: 700, borderBottom: '1px solid', borderColor: 'divider', py: 2, px: 2.5, fontSize: 13}}>
                                            {fmtGHS(order.price?.amount)}
                                        </TableCell>
                                        <TableCell sx={{borderBottom: '1px solid', borderColor: 'divider', py: 2, px: 2.5}}>
                                            <Box sx={{
                                                display: 'inline-block',
                                                backgroundColor: (STATUS_STYLES[order.status] || {bg: '#F3F4F6'}).bg,
                                                color: (STATUS_STYLES[order.status] || {text: '#6B7280'}).text,
                                                fontWeight: 600,
                                                fontSize: 12,
                                                px: 1.5,
                                                py: 0.375,
                                                borderRadius: '6px',
                                                textTransform: 'capitalize'
                                            }}>
                                                {order.status}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{borderBottom: '1px solid', borderColor: 'divider', py: 2, px: 2.5}}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                {getPaymentMethodIcon(order.paymentMethod)}
                                                <Typography sx={{fontSize: 13, color: 'text.primary'}}>
                                                    {formatPaymentMethod(order.paymentMethod)}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{borderBottom: '1px solid', borderColor: 'divider', py: 2, px: 2.5}}>
                                            <Box sx={{
                                                display: 'inline-block',
                                                backgroundColor: 'rgba(0,0,0,0.04)',
                                                color: 'text.secondary',
                                                fontWeight: 600,
                                                fontSize: 12,
                                                px: 1.5,
                                                py: 0.375,
                                                borderRadius: '6px',
                                                textTransform: 'capitalize'
                                            }}>
                                                {order.paymentStatus}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{color: 'text.secondary', borderBottom: '1px solid', borderColor: 'divider', py: 2, px: 2.5, fontSize: 13}}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!loading && filtered.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{py: 8, borderBottom: 0}}>
                                            <Stack alignItems="center" spacing={1.5}>
                                                <Box sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 3,
                                                    bgcolor: 'rgba(0,0,0,0.04)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}>
                                                    <InboxRounded sx={{fontSize: 32, color: 'text.disabled'}}/>
                                                </Box>
                                                <Typography sx={{color: 'text.primary', fontWeight: 700, fontSize: 16}}>
                                                    No orders found
                                                </Typography>
                                                <Typography sx={{color: 'text.secondary', fontSize: 13, maxWidth: 300}}>
                                                    {search
                                                        ? `No results matching "${search}". Try adjusting your search or filters.`
                                                        : 'There are no orders in this category yet.'}
                                                </Typography>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={filtered.length}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                            rowsPerPageOptions={[5, 10, 25]}
                            sx={{
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                    fontSize: '0.78rem',
                                    color: 'text.secondary'
                                }
                            }}
                        />
                    </TableContainer>
                </Container>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({open: false, message: ''})}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbar({open: false, message: ''})}
                    severity="info"
                    sx={{borderRadius: '4px', fontWeight: 600}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Layout>
    );
};

export default OrdersPage;
