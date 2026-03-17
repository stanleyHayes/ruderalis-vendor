import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
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
    Typography,
} from "@mui/material";
import {AccountBalance, ArrowUpward, ShoppingCart, TrendingDown, ReceiptLongRounded, TrendingUpRounded, ReplayRounded, AccountBalanceRounded} from "@mui/icons-material";
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
import Layout from "../../components/layout/layout";
import {getTransactions, selectFunds} from "../../redux/features/funds/funds-slice";

const STATUS_COLORS = {
    completed: {bg: '#D1FAE5', text: '#065F46'},
    pending: {bg: '#FEF3C7', text: '#92400E'},
    processing: {bg: '#DBEAFE', text: '#1E40AF'},
};

const FundsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {transactions, loading} = useSelector(selectFunds);
    const [tab, setTab] = useState("all");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch]);

    // Normalize API data — handle both old mock format and real API Payment format
    const normalized = transactions.map(t => ({
        ...t,
        amount: t.amount ?? t.price?.amount ?? 0,
        type: t.type || t.purpose || 'sale',
        date: t.date || t.createdAt,
        description: t.description || t.purpose?.replace(/-/g, ' ') || '',
        status: t.status === 'success' ? 'completed' : (t.status || 'pending'),
    }));

    const completedSales = normalized.filter(t => ['sale', 'daily-payment'].includes(t.type) && t.status === "completed").reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const completedRefunds = normalized.filter(t => t.type === "refund" && t.status === "completed").reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const completedWithdrawals = normalized.filter(t => ['withdrawal', 'monthly-payment'].includes(t.type) && t.status === "completed").reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const availableBalance = completedSales - completedRefunds - completedWithdrawals;
    const pendingAmount = normalized.filter(t => t.status === "pending" || t.status === "processing").reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const filtered = tab === "all" ? normalized : normalized.filter(t => {
        if (tab === 'sale') return ['sale', 'daily-payment', 'product-setup', 'store-setup', 'product-promotion', 'store-promotion'].includes(t.type);
        if (tab === 'refund') return t.type === 'refund';
        if (tab === 'withdrawal') return ['withdrawal', 'monthly-payment'].includes(t.type);
        return true;
    });

    const paginatedTransactions = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const typeIcon = (type) => {
        switch (type) {
            case "sale":
                return <ShoppingCart sx={{fontSize: 16}}/>;
            case "refund":
                return <TrendingDown sx={{fontSize: 16}}/>;
            case "withdrawal":
                return <AccountBalance sx={{fontSize: 16}}/>;
            default:
                return null;
        }
    };

    const typeIconBg = (type) => {
        switch (type) {
            case "sale":
                return {bg: '#D1FAE5', color: '#059669'};
            case "refund":
                return {bg: '#FEE2E2', color: '#991B1B'};
            case "withdrawal":
                return {bg: '#FEF3C7', color: '#92400E'};
            default:
                return {bg: '#F3F4F6', color: '#6B7280'};
        }
    };

    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack direction={{xs: "column", sm: "row"}} justifyContent="space-between" alignItems={{sm: "center"}} spacing={2}>
                            <Typography variant="h4" sx={{color: "text.primary", fontWeight: 700}}>
                                Funds
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate("/funds/withdraw")}
                                sx={{bgcolor: "primary.main", px: 3}}
                            >
                                Request Withdrawal
                            </Button>
                        </Stack>

                        {/* Stats */}
                        {!loading && (
                            <Stack direction="row" spacing={2} sx={{flexWrap: 'wrap', gap: 2}}>
                                <MiniStat icon={ReceiptLongRounded} label="Total Transactions" value={normalized.length.toLocaleString()} color="#3B82F6"/>
                                <MiniStat icon={TrendingUpRounded} label="Sales" value={normalized.filter(t => ['sale', 'daily-payment'].includes(t.type)).length.toLocaleString()} color="#10B981"/>
                                <MiniStat icon={ReplayRounded} label="Refunds" value={normalized.filter(t => t.type === 'refund').length.toLocaleString()} color="#EF4444"/>
                                <MiniStat icon={AccountBalanceRounded} label="Withdrawals" value={normalized.filter(t => ['withdrawal', 'monthly-payment'].includes(t.type)).length.toLocaleString()} color="#F59E0B"/>
                            </Stack>
                        )}

                        {/* Balance Cards with Gradients */}
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Card sx={{
                                    border: 'none',
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
                                    color: '#fff',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    minHeight: 140,
                                }}>
                                    <Box sx={{position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)'}}/>
                                    <Box sx={{position: 'absolute', bottom: -30, right: 30, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)'}}/>
                                    <CardContent sx={{p: 2.5, position: 'relative', zIndex: 1}}>
                                        <Box sx={{
                                            width: 36, height: 36, borderRadius: 2,
                                            background: 'rgba(255,255,255,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            mb: 1.5,
                                        }}>
                                            <ArrowUpward sx={{fontSize: 20}}/>
                                        </Box>
                                        <Typography sx={{fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1, mb: 0.5}}>
                                            GH₵ {availableBalance.toFixed(2)}
                                        </Typography>
                                        <Typography sx={{fontSize: '0.78rem', opacity: 0.85, fontWeight: 500}}>
                                            Available Balance
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <Card sx={{
                                    border: 'none',
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
                                    color: '#fff',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    minHeight: 140,
                                }}>
                                    <Box sx={{position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)'}}/>
                                    <Box sx={{position: 'absolute', bottom: -30, right: 30, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)'}}/>
                                    <CardContent sx={{p: 2.5, position: 'relative', zIndex: 1}}>
                                        <Box sx={{
                                            width: 36, height: 36, borderRadius: 2,
                                            background: 'rgba(255,255,255,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            mb: 1.5, fontSize: '1.1rem', fontWeight: 800,
                                        }}>
                                            ...
                                        </Box>
                                        <Typography sx={{fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1, mb: 0.5}}>
                                            GH₵ {pendingAmount.toFixed(2)}
                                        </Typography>
                                        <Typography sx={{fontSize: '0.78rem', opacity: 0.85, fontWeight: 500}}>
                                            Pending Amount
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Transactions */}
                        <Card>
                            <CardContent sx={{p: 0, "&:last-child": {pb: 0}}}>
                                <Tabs
                                    value={tab}
                                    onChange={(_, v) => { setTab(v); setPage(0); }}
                                    sx={{
                                        px: 3, pt: 2,
                                        "& .MuiTab-root": {textTransform: "capitalize", fontWeight: 600, fontSize: '0.85rem'},
                                    }}
                                >
                                    <Tab label="All" value="all"/>
                                    <Tab label="Sales" value="sale"/>
                                    <Tab label="Refunds" value="refund"/>
                                    <Tab label="Withdrawals" value="withdrawal"/>
                                </Tabs>

                                {loading ? (
                                    <TableSkeleton/>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    {["Type", "Description", "Amount", "Status", "Date"].map((h, i) => (
                                                        <TableCell
                                                            key={h}
                                                            sx={{
                                                                fontWeight: 600, fontSize: '0.72rem', color: 'text.secondary',
                                                                py: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em',
                                                                display: i === 3 ? {xs: "none", sm: "table-cell"} :
                                                                    i === 4 ? {xs: "none", md: "table-cell"} : "table-cell",
                                                            }}
                                                        >
                                                            {h}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {paginatedTransactions.map((txn) => {
                                                    const iconStyle = typeIconBg(txn.type);
                                                    const statusStyle = STATUS_COLORS[txn.status] || {bg: '#F3F4F6', text: '#6B7280'};
                                                    return (
                                                        <TableRow key={txn._id} sx={{"&:last-child td": {borderBottom: 0}, "&:hover": {backgroundColor: "action.hover"}}}>
                                                            <TableCell>
                                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                                    <Box sx={{
                                                                        width: 30, height: 30, borderRadius: 1.5,
                                                                        bgcolor: iconStyle.bg, color: iconStyle.color,
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    }}>
                                                                        {typeIcon(txn.type)}
                                                                    </Box>
                                                                    <Typography variant="body2" sx={{color: "text.primary", textTransform: "capitalize", fontWeight: 600, fontSize: '0.82rem'}}>
                                                                        {txn.type?.replace(/-/g, ' ')}
                                                                    </Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" sx={{color: "text.secondary", fontSize: '0.82rem'}}>
                                                                    {txn.description || txn.transactionID || txn.reference || ''}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        fontSize: '0.85rem',
                                                                        color: txn.amount >= 0 ? '#059669' : '#DC2626',
                                                                    }}
                                                                >
                                                                    {txn.amount >= 0 ? "+" : ""}GH₵ {Math.abs(txn.amount).toFixed(2)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{display: {xs: "none", sm: "table-cell"}}}>
                                                                <Box sx={{
                                                                    display: 'inline-block',
                                                                    px: 1.2, py: 0.3, borderRadius: 1.5,
                                                                    fontSize: '0.7rem', fontWeight: 700,
                                                                    textTransform: 'capitalize',
                                                                    backgroundColor: statusStyle.bg,
                                                                    color: statusStyle.text,
                                                                }}>
                                                                    {txn.status}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell sx={{display: {xs: "none", md: "table-cell"}}}>
                                                                <Typography variant="body2" sx={{color: "text.secondary", fontSize: '0.78rem'}}>
                                                                    {txn.date ? new Date(txn.date).toLocaleDateString() : 'N/A'}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                {filtered.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} sx={{textAlign: "center", py: 4}}>
                                                            <Typography variant="body2" sx={{color: "text.secondary"}}>
                                                                No transactions found
                                                            </Typography>
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
                                )}
                            </CardContent>
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default FundsPage;
