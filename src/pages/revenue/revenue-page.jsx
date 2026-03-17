import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Container,
    Grid,
    LinearProgress,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import {
    AttachMoneyRounded,
    CalendarMonthRounded,
    TrendingUpRounded,
    ShowChartRounded,
    ReceiptLongRounded,
    ArrowUpwardRounded,
    ArrowDownwardRounded,
} from "@mui/icons-material";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import Layout from "../../components/layout/layout";
import {getRevenue, selectRevenue} from "../../redux/features/revenue/revenue-slice";
import {DashboardSkeleton} from "../../components/shared/page-skeleton";

/* ── helpers ── */
const fmt = (v) => `GH\u20B5 ${(Number(v) || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}`;
const safeDivide = (a, b) => (b === 0 ? 0 : a / b);
const safeMax = (arr) => (arr.length === 0 ? 0 : Math.max(...arr));
const safeMin = (arr) => (arr.length === 0 ? 0 : Math.min(...arr));

/* ── custom tooltip ── */
const CustomTooltip = ({active, payload, label}) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <Box sx={{
            background: 'rgba(17,24,39,0.92)', backdropFilter: 'blur(8px)',
            borderRadius: 2, px: 2, py: 1.2, border: '1px solid rgba(255,255,255,0.08)',
        }}>
            <Typography sx={{fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, mb: 0.3}}>
                {label}
            </Typography>
            <Typography sx={{fontSize: '0.95rem', color: '#34D399', fontWeight: 800}}>
                {fmt(payload[0].value)}
            </Typography>
        </Box>
    );
};

/* ── gradient card defs ── */
const STAT_CARDS = [
    {key: 'total', label: 'Total Revenue', icon: AttachMoneyRounded, gradient: 'linear-gradient(135deg, #059669 0%, #34D399 100%)'},
    {key: 'thisMonth', label: 'This Month', icon: CalendarMonthRounded, gradient: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)'},
    {key: 'lastMonth', label: 'Last Month', icon: ReceiptLongRounded, gradient: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)'},
    {key: 'average', label: 'Monthly Average', icon: TrendingUpRounded, gradient: 'linear-gradient(135deg, #DB2777 0%, #F472B6 100%)'},
];

const RevenuePage = () => {
    const dispatch = useDispatch();
    const {revenue, loading} = useSelector(selectRevenue);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    useEffect(() => {
        dispatch(getRevenue());
    }, [dispatch]);

    /* ── normalise data ── */
    const revenueData = Array.isArray(revenue)
        ? revenue.map((r) => ({
            month: r.month || r.label || r.name || 'N/A',
            revenue: Number(r.revenue ?? r.amount ?? r.total) || 0,
        }))
        : [];

    /* ── safe computations ── */
    const totalRevenue = revenueData.reduce((s, r) => s + (Number(r.revenue) || 0), 0);
    const thisMonth = revenueData.length > 0 ? (Number(revenueData[revenueData.length - 1].revenue) || 0) : 0;
    const lastMonth = revenueData.length > 1 ? (Number(revenueData[revenueData.length - 2].revenue) || 0) : 0;
    const average = revenueData.length > 0 ? safeDivide(totalRevenue, revenueData.length) : 0;
    const monthChange = Number(safeDivide((thisMonth - lastMonth), lastMonth) * 100).toFixed(1) || 0;
    const isUp = thisMonth >= lastMonth;

    const revenueValues = revenueData.map((r) => Number(r.revenue) || 0);
    const highestRevenue = safeMax(revenueValues);
    const lowestRevenue = safeMin(revenueValues);
    const highestMonth = revenueData.length > 0
        ? (revenueData.find((r) => (Number(r.revenue) || 0) === highestRevenue) || {}).month || '-'
        : '-';
    const lowestMonth = revenueData.length > 0
        ? (revenueData.find((r) => (Number(r.revenue) || 0) === lowestRevenue) || {}).month || '-'
        : '-';

    /* growth rate: safe against div-by-zero on first element */
    const firstRevenue = revenueData.length > 0 ? (Number(revenueData[0].revenue) || 0) : 0;
    const growthRate = revenueData.length > 1
        ? safeDivide((thisMonth - firstRevenue), firstRevenue) * 100 / (revenueData.length - 1)
        : 0;

    /* best streak: consecutive months of growth */
    let bestStreak = 0;
    let currentStreak = 0;
    revenueData.forEach((r, i) => {
        if (i === 0) { currentStreak = 1; }
        else if ((Number(r.revenue) || 0) >= (Number(revenueData[i - 1].revenue) || 0)) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }
        bestStreak = Math.max(bestStreak, currentStreak);
    });

    const statValues = {
        total: {value: fmt(totalRevenue), sub: `${revenueData.length} months tracked`},
        thisMonth: {value: fmt(thisMonth), sub: revenueData.length > 0 ? revenueData[revenueData.length - 1].month : '-'},
        lastMonth: {value: fmt(lastMonth), sub: revenueData.length > 1 ? revenueData[revenueData.length - 2].month : '-'},
        average: {value: fmt(average), sub: isUp ? 'Trending up' : 'Trending down'},
    };

    const paginatedRevenue = revenueData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const growthMetrics = [
        {label: 'Highest Month', detail: highestMonth, amount: fmt(highestRevenue), color: '#10B981'},
        {label: 'Lowest Month', detail: lowestMonth, amount: fmt(lowestRevenue), color: '#EF4444'},
        {label: 'Growth Rate', detail: 'MoM Average', amount: `${(Number(growthRate) || 0).toFixed(1)}%`, color: '#3B82F6'},
        {label: 'Best Streak', detail: 'Consecutive growth', amount: `${bestStreak || 0} months`, color: '#8B5CF6'},
    ];

    return (
        <Layout>
            <Container maxWidth="xl">
                <Stack spacing={3}>

                    {/* ═══════ 1. HEADER BANNER ═══════ */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
                        borderRadius: 3, px: {xs: 2.5, sm: 4}, py: {xs: 2.5, sm: 3},
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {/* decorative circles */}
                        <Box sx={{position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)'}}/>
                        <Box sx={{position: 'absolute', bottom: -30, right: 80, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)'}}/>
                        <Box sx={{position: 'absolute', top: 10, right: 200, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.04)'}}/>

                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{position: 'relative', zIndex: 1}}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{
                                    width: 48, height: 48, borderRadius: 2.5,
                                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <ShowChartRounded sx={{color: '#fff', fontSize: 26}}/>
                                </Box>
                                <Box>
                                    <Typography sx={{fontWeight: 800, fontSize: {xs: '1.3rem', sm: '1.6rem'}, color: '#fff', letterSpacing: '-0.02em'}}>
                                        Revenue Analytics
                                    </Typography>
                                    <Typography sx={{fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500}}>
                                        Track your earnings, growth, and monthly performance
                                    </Typography>
                                </Box>
                            </Stack>
                            {!loading && revenueData.length > 0 && (
                                <Chip
                                    icon={isUp
                                        ? <ArrowUpwardRounded sx={{fontSize: 14, color: '#065F46 !important'}}/>
                                        : <ArrowDownwardRounded sx={{fontSize: 14, color: '#991B1B !important'}}/>
                                    }
                                    label={`${isUp ? '+' : ''}${monthChange}% vs last month`}
                                    size="small"
                                    sx={{
                                        fontWeight: 700, fontSize: '0.78rem',
                                        backgroundColor: isUp ? 'rgba(255,255,255,0.95)' : 'rgba(254,226,226,0.95)',
                                        color: isUp ? '#065F46' : '#991B1B',
                                        '& .MuiChip-icon': {color: 'inherit'},
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    }}
                                />
                            )}
                        </Stack>
                    </Box>

                    {loading ? (
                        <DashboardSkeleton/>
                    ) : (
                        <>
                            {/* ═══════ 2. STAT CARDS ═══════ */}
                            <Grid container spacing={2}>
                                {STAT_CARDS.map((card, i) => (
                                    <Grid key={i} size={{xs: 6, lg: 3}}>
                                        <Card sx={{
                                            border: 'none', background: card.gradient,
                                            color: '#fff', position: 'relative', overflow: 'hidden',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': {transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)'},
                                        }}>
                                            <Box sx={{position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)'}}/>
                                            <Box sx={{position: 'absolute', bottom: -20, right: 20, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                                            <CardContent sx={{p: 2.5, position: 'relative'}}>
                                                <card.icon sx={{fontSize: 24, mb: 1, opacity: 0.9}}/>
                                                <Typography sx={{fontSize: {xs: '1.3rem', sm: '1.6rem'}, fontWeight: 800, lineHeight: 1.1}}>
                                                    {statValues[card.key].value}
                                                </Typography>
                                                <Typography sx={{fontSize: '0.78rem', opacity: 0.85, mt: 0.5, fontWeight: 600}}>
                                                    {card.label}
                                                </Typography>
                                                <Typography sx={{fontSize: '0.68rem', opacity: 0.6, mt: 0.2}}>
                                                    {statValues[card.key].sub}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* ═══════ 3. REVENUE AREA CHART ═══════ */}
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                                        <Box>
                                            <Typography sx={{fontWeight: 700, fontSize: '1rem', color: 'text.primary'}}>
                                                Revenue Trend
                                            </Typography>
                                            <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>
                                                Monthly revenue over time
                                            </Typography>
                                        </Box>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.15rem', color: '#059669'}}>
                                            {fmt(totalRevenue)}
                                        </Typography>
                                    </Stack>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={revenueData} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
                                            <defs>
                                                <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.4}/>
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false}/>
                                            <XAxis
                                                dataKey="month" tick={{fontSize: 12, fontWeight: 600, fill: '#9CA3AF'}}
                                                axisLine={false} tickLine={false}
                                            />
                                            <YAxis
                                                tickFormatter={(v) => `GH\u20B5${((Number(v) || 0) / 1000).toFixed(0)}k`}
                                                tick={{fontSize: 11, fill: '#9CA3AF'}}
                                                axisLine={false} tickLine={false} width={65}
                                            />
                                            <RechartsTooltip content={<CustomTooltip/>}/>
                                            <Area
                                                type="monotone" dataKey="revenue"
                                                stroke="#10B981" strokeWidth={2.5}
                                                fill="url(#areaGreen)"
                                                dot={{r: 4, fill: '#fff', stroke: '#10B981', strokeWidth: 2}}
                                                activeDot={{r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2}}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* ═══════ 4. BAR CHART + GROWTH METRICS ═══════ */}
                            <Grid container spacing={2}>
                                <Grid size={{xs: 12, lg: 7}}>
                                    <Card sx={{height: '100%'}}>
                                        <CardContent sx={{p: 3}}>
                                            <Typography sx={{fontWeight: 700, fontSize: '1rem', color: 'text.primary', mb: 0.5}}>
                                                Monthly Comparison
                                            </Typography>
                                            <Typography sx={{fontSize: '0.78rem', color: 'text.secondary', mb: 2}}>
                                                Side-by-side monthly revenue
                                            </Typography>
                                            <ResponsiveContainer width="100%" height={280}>
                                                <BarChart data={revenueData} margin={{top: 5, right: 10, left: 0, bottom: 0}}>
                                                    <defs>
                                                        <linearGradient id="barGreen" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
                                                            <stop offset="100%" stopColor="#059669" stopOpacity={0.7}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false}/>
                                                    <XAxis
                                                        dataKey="month" tick={{fontSize: 12, fontWeight: 600, fill: '#9CA3AF'}}
                                                        axisLine={false} tickLine={false}
                                                    />
                                                    <YAxis
                                                        tickFormatter={(v) => `GH\u20B5${((Number(v) || 0) / 1000).toFixed(0)}k`}
                                                        tick={{fontSize: 11, fill: '#9CA3AF'}}
                                                        axisLine={false} tickLine={false} width={65}
                                                    />
                                                    <RechartsTooltip content={<CustomTooltip/>}/>
                                                    <Bar
                                                        dataKey="revenue" fill="url(#barGreen)"
                                                        radius={[6, 6, 0, 0]} maxBarSize={48}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                <Grid size={{xs: 12, lg: 5}}>
                                    <Card sx={{height: '100%'}}>
                                        <CardContent sx={{p: 3}}>
                                            <Typography sx={{fontWeight: 700, fontSize: '1rem', color: 'text.primary', mb: 0.5}}>
                                                Growth Metrics
                                            </Typography>
                                            <Typography sx={{fontSize: '0.78rem', color: 'text.secondary', mb: 2}}>
                                                Key performance indicators
                                            </Typography>
                                            <Stack spacing={2}>
                                                {growthMetrics.map((stat, i) => (
                                                    <Box key={i} sx={{
                                                        p: 2, borderRadius: 2,
                                                        backgroundColor: `${stat.color}0A`,
                                                        borderLeft: `3px solid ${stat.color}`,
                                                        transition: 'background-color 0.2s ease',
                                                        '&:hover': {backgroundColor: `${stat.color}14`},
                                                    }}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Box>
                                                                <Typography sx={{fontSize: '0.78rem', color: 'text.primary', fontWeight: 700}}>
                                                                    {stat.label}
                                                                </Typography>
                                                                <Typography sx={{fontSize: '0.7rem', color: 'text.secondary'}}>
                                                                    {stat.detail}
                                                                </Typography>
                                                            </Box>
                                                            <Typography sx={{fontWeight: 800, fontSize: '1.05rem', color: stat.color}}>
                                                                {stat.amount}
                                                            </Typography>
                                                        </Stack>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            {/* ═══════ 5. BREAKDOWN TABLE ═══════ */}
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <Typography sx={{fontWeight: 700, fontSize: '1rem', color: 'text.primary', mb: 0.5}}>
                                        Revenue Breakdown
                                    </Typography>
                                    <Typography sx={{fontSize: '0.78rem', color: 'text.secondary', mb: 2}}>
                                        Detailed monthly performance
                                    </Typography>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    {['Month', 'Revenue', 'Change', '% of Total', 'Share'].map((h, i) => (
                                                        <TableCell
                                                            key={h}
                                                            align={i > 0 ? 'right' : 'left'}
                                                            sx={{
                                                                fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary',
                                                                textTransform: 'uppercase', letterSpacing: '0.06em', py: 1.5,
                                                                borderBottom: '2px solid', borderColor: 'divider',
                                                                display: (i === 2 || i === 4) ? {xs: 'none', sm: 'table-cell'} : 'table-cell',
                                                            }}
                                                        >
                                                            {h}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {paginatedRevenue.map((item, idx) => {
                                                    const i = page * rowsPerPage + idx;
                                                    const rev = Number(item.revenue) || 0;
                                                    const prev = i > 0 ? (Number(revenueData[i - 1].revenue) || 0) : rev;
                                                    const chg = Number(safeDivide((rev - prev), prev) * 100).toFixed(1) || 0;
                                                    const up = rev >= prev;
                                                    const pct = Number(safeDivide(rev, totalRevenue) * 100).toFixed(1) || 0;

                                                    return (
                                                        <TableRow key={item.month} sx={{
                                                            '&:last-child td': {border: 0},
                                                            '&:hover': {backgroundColor: 'action.hover'},
                                                            transition: 'background-color 0.15s ease',
                                                        }}>
                                                            <TableCell>
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <Box sx={{
                                                                        width: 10, height: 10, borderRadius: '50%',
                                                                        background: 'linear-gradient(135deg, #059669, #34D399)',
                                                                    }}/>
                                                                    <Typography sx={{fontWeight: 600, fontSize: '0.85rem', color: 'text.primary'}}>
                                                                        {item.month}
                                                                    </Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography sx={{fontWeight: 700, fontSize: '0.85rem', color: 'text.primary'}}>
                                                                    {fmt(rev)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right" sx={{display: {xs: 'none', sm: 'table-cell'}}}>
                                                                {i > 0 ? (
                                                                    <Box sx={{
                                                                        display: 'inline-flex', alignItems: 'center', gap: 0.3,
                                                                        px: 1, py: 0.3, borderRadius: 1,
                                                                        backgroundColor: up ? '#D1FAE5' : '#FEE2E2',
                                                                        color: up ? '#065F46' : '#991B1B',
                                                                        fontSize: '0.72rem', fontWeight: 700,
                                                                    }}>
                                                                        {up ? <ArrowUpwardRounded sx={{fontSize: 12}}/> : <ArrowDownwardRounded sx={{fontSize: 12}}/>}
                                                                        {up ? '+' : ''}{chg}%
                                                                    </Box>
                                                                ) : (
                                                                    <Typography sx={{fontSize: '0.75rem', color: 'text.secondary'}}>--</Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography sx={{fontSize: '0.82rem', color: 'text.secondary', fontWeight: 600}}>
                                                                    {pct}%
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="right" sx={{display: {xs: 'none', sm: 'table-cell'}, minWidth: 140}}>
                                                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1}}>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={Math.min(Number(pct) || 0, 100)}
                                                                        sx={{
                                                                            flex: 1, maxWidth: 110, height: 7, borderRadius: 4,
                                                                            backgroundColor: 'rgba(0,0,0,0.06)',
                                                                            '& .MuiLinearProgress-bar': {
                                                                                borderRadius: 4,
                                                                                background: 'linear-gradient(90deg, #059669, #34D399)',
                                                                            },
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            component="div"
                                            count={revenueData.length}
                                            page={page}
                                            onPageChange={(_, newPage) => setPage(newPage)}
                                            rowsPerPage={rowsPerPage}
                                            onRowsPerPageChange={(e) => {
                                                setRowsPerPage(parseInt(e.target.value, 10));
                                                setPage(0);
                                            }}
                                            rowsPerPageOptions={[5, 6, 10, 25]}
                                            sx={{
                                                borderTop: '1px solid',
                                                borderColor: 'divider',
                                                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                                    fontSize: '0.78rem', color: 'text.secondary',
                                                },
                                            }}
                                        />
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </Stack>
            </Container>
        </Layout>
    );
};

export default RevenuePage;
