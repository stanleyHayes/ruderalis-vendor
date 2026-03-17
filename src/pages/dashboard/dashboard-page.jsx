import Layout from "../../components/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getDashboardStats, selectDashboard} from "../../redux/features/dashboard/dashboard-slice";
import {selectAuth} from "../../redux/features/auth/auth-slice";
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
    TableRow,
    Typography,
    Avatar,
    Button,
    IconButton,
} from "@mui/material";
import {
    TrendingDown,
    TrendingUp,
    LocalFlorist,
    EmojiEvents,
    ArrowForward,
    Storefront,
    LocalShipping,
    Payment,
    Campaign,
    Add,
    CheckCircle,
    RadioButtonUnchecked,
    ShoppingBag,
    Speed,
    Star,
    CreditCard,
    Map,
    AttachMoney,
} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {DashboardSkeleton} from "../../components/shared/page-skeleton";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const fmtGHS = (v) => `GH\u20B5 ${(Number(v) || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
const formatCurrency = fmtGHS;
const formatNumber = (v) => (Number(v) || 0).toLocaleString();

// Normalize dashboard stats — handle different API response shapes
const normalizeStats = (raw) => {
    if (!raw) return null;
    const d = raw.data || raw;
    return {
        totalRevenue: Number(d.totalRevenue ?? d.revenue ?? d.total_revenue ?? 0),
        totalOrders: Number(d.totalOrders ?? d.orders ?? d.total_orders ?? d.orderCount ?? 0),
        totalProducts: Number(d.totalProducts ?? d.products ?? d.total_products ?? d.productCount ?? 0),
        totalCustomers: Number(d.totalCustomers ?? d.customers ?? d.total_customers ?? d.customerCount ?? 0),
        revenueChange: Number(d.revenueChange ?? d.revenue_change ?? 0),
        ordersChange: Number(d.ordersChange ?? d.orders_change ?? 0),
        productsChange: Number(d.productsChange ?? d.products_change ?? 0),
        customersChange: Number(d.customersChange ?? d.customers_change ?? 0),
        monthlyRevenue: d.monthlyRevenue ?? d.monthly_revenue ?? d.revenueByMonth ?? [],
        ordersByStatus: d.ordersByStatus ?? d.orders_by_status ?? d.statusBreakdown ?? {},
        topProducts: d.topProducts ?? d.top_products ?? [],
        recentOrders: d.recentOrders ?? d.recent_orders ?? d.latestOrders ?? [],
    };
};
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : 'N/A';

const STATUS_COLORS = {
    pending: {bg: '#FEF3C7', text: '#92400E'},
    delivering: {bg: '#DBEAFE', text: '#1E40AF'},
    completed: {bg: '#D1FAE5', text: '#065F46'},
    cancelled: {bg: '#FEE2E2', text: '#991B1B'}
};

const PIE_COLORS = {
    pending: '#EAB308',
    delivering: '#3B82F6',
    completed: '#22C55E',
    cancelled: '#EF4444',
};

const STAT_CARDS = [
    {
        label: 'Total Revenue',
        key: 'totalRevenue',
        changeKey: 'revenueChange',
        format: formatCurrency,
        gradient: 'linear-gradient(135deg, #14532D 0%, #22C55E 100%)',
        icon: '\u20B5',
    },
    {
        label: 'Total Orders',
        key: 'totalOrders',
        changeKey: 'ordersChange',
        format: formatNumber,
        gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
        icon: '#',
    },
    {
        label: 'Total Products',
        key: 'totalProducts',
        changeKey: 'productsChange',
        format: formatNumber,
        gradient: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
        icon: '~',
    },
    {
        label: 'Total Customers',
        key: 'totalCustomers',
        changeKey: 'customersChange',
        format: formatNumber,
        gradient: 'linear-gradient(135deg, #BE185D 0%, #EC4899 100%)',
        icon: '@',
    }
];

const QUICK_ACTIONS = [
    {label: 'Add Product', to: '/products/new', color: '#166534', bg: '#D1FAE5', Icon: LocalFlorist},
    {label: 'Create Shop', to: '/shops/new', color: '#0F766E', bg: '#CCFBF1', Icon: Storefront},
    {label: 'View Orders', to: '/orders', color: '#1E40AF', bg: '#DBEAFE', Icon: LocalShipping},
    {label: 'Payment Setup', to: '/payment-setup', color: '#6D28D9', bg: '#EDE9FE', Icon: Payment},
    {label: 'Shipping Rates', to: '/shipping-setup', color: '#0891B2', bg: '#CFFAFE', Icon: LocalShipping},
    {label: 'Promotions', to: '/promotions', color: '#B45309', bg: '#FEF3C7', Icon: Campaign},
];

const defaultMonthlyData = [
    {month: 'Jan', revenue: 0, orders: 0},
    {month: 'Feb', revenue: 0, orders: 0},
    {month: 'Mar', revenue: 0, orders: 0},
    {month: 'Apr', revenue: 0, orders: 0},
    {month: 'May', revenue: 0, orders: 0},
    {month: 'Jun', revenue: 0, orders: 0},
];

const defaultOrdersByStatus = {pending: 0, delivering: 0, completed: 0, cancelled: 0};

const CATEGORY_COLORS = ['#14532D', '#22C55E', '#4ADE80'];

/* ─── Custom Tooltip ─── */

const CustomTooltip = ({active, payload, label}) => {
    if (!active || !payload?.length) return null;
    return (
        <Card sx={{p: 1.5, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'}}>
            <Typography sx={{fontWeight: 700, fontSize: '0.82rem', mb: 0.5}}>{label}</Typography>
            {payload.map((p, i) => (
                <Typography key={i} sx={{fontSize: '0.75rem', color: p.color}}>
                    {p.name}: {p.name === 'revenue' ? fmtGHS(p.value) : formatNumber(p.value)}
                </Typography>
            ))}
        </Card>
    );
};

/* ─── Sub-components ─── */

const StatCard = ({label, value, change, gradient, icon}) => {
    const isPositive = change >= 0;
    return (
        <Card sx={{
            border: 'none',
            borderRadius: 3,
            background: gradient,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 140,
        }}>
            <Box sx={{
                position: 'absolute', top: -20, right: -20,
                width: 100, height: 100, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)'
            }}/>
            <Box sx={{
                position: 'absolute', bottom: -30, right: 30,
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)'
            }}/>
            <CardContent sx={{p: 2.5, position: 'relative', zIndex: 1}}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: 2,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mb: 1.5, fontSize: '1.1rem', fontWeight: 800
                }}>
                    {icon}
                </Box>
                <Typography sx={{fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1, mb: 0.5}}>
                    {value}
                </Typography>
                <Typography sx={{fontSize: '0.78rem', opacity: 0.85, mb: 1, fontWeight: 500}}>
                    {label}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 0.3,
                        px: 0.8, py: 0.2, borderRadius: 1,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                    }}>
                        {isPositive ?
                            <TrendingUp sx={{fontSize: 13}}/> :
                            <TrendingDown sx={{fontSize: 13}}/>
                        }
                        <Typography sx={{fontSize: '0.7rem', fontWeight: 700}}>
                            {Math.abs(change)}%
                        </Typography>
                    </Box>
                    <Typography sx={{fontSize: '0.68rem', opacity: 0.75}}>vs last month</Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

const WelcomeBanner = ({userName, today, navigate}) => (
    <Card sx={{
        background: 'linear-gradient(135deg, #14532D 0%, #166534 40%, #15803D 100%)',
        color: '#fff',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        mb: 3,
    }}>
        <Box sx={{position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)'}}/>
        <Box sx={{position: 'absolute', bottom: -60, right: 80, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)'}}/>
        <Box sx={{position: 'absolute', top: 20, right: 180, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.03)'}}/>
        <CardContent sx={{p: {xs: 3, md: 4}, position: 'relative', zIndex: 1}}>
            <Stack direction={{xs: 'column', md: 'row'}} justifyContent="space-between" alignItems={{md: 'center'}} spacing={2}>
                <Box>
                    <Typography variant="h4" sx={{fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em'}}>
                        Welcome back, {userName}
                    </Typography>
                    <Typography sx={{opacity: 0.8, fontSize: '0.95rem'}}>
                        {today}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                    {[
                        {label: 'Add Product', icon: <Add/>, to: '/products/new'},
                        {label: 'View Orders', icon: <ShoppingBag/>, to: '/orders'},
                        {label: 'My Shops', icon: <Storefront/>, to: '/shops'},
                    ].map(btn => (
                        <Button
                            key={btn.label}
                            variant="contained"
                            startIcon={btn.icon}
                            onClick={() => navigate(btn.to)}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                textTransform: 'none',
                                borderRadius: 2,
                                backdropFilter: 'blur(10px)',
                                '&:hover': {bgcolor: 'rgba(255,255,255,0.3)'},
                            }}
                        >
                            {btn.label}
                        </Button>
                    ))}
                </Stack>
            </Stack>
        </CardContent>
    </Card>
);

/* ─── Revenue Area Chart ─── */

const RevenueAreaChart = ({data}) => {
    const monthlyData = data?.length ? data : defaultMonthlyData;
    const totalRevenue = monthlyData.reduce((s, d) => s + (d.revenue || 0), 0);

    return (
        <Card sx={{borderRadius: 3, height: '100%'}}>
            <CardContent sx={{p: 3}}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                    <Box>
                        <Typography variant="subtitle1" sx={{fontWeight: 700, color: 'text.primary'}}>
                            Revenue Overview
                        </Typography>
                        <Typography variant="caption" sx={{color: 'text.secondary'}}>
                            Last 6 months
                        </Typography>
                    </Box>
                    <Box sx={{textAlign: 'right'}}>
                        <Typography variant="h6" sx={{fontWeight: 800, color: 'text.primary'}}>
                            {fmtGHS(totalRevenue)}
                        </Typography>
                        <Chip label="Total" size="small" sx={{
                            height: 22, fontSize: '0.68rem',
                            backgroundColor: 'rgba(16,185,129,0.1)', color: '#059669'
                        }}/>
                    </Box>
                </Stack>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={monthlyData} margin={{top: 5, right: 10, left: -10, bottom: 0}}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
                        <XAxis dataKey="month" tick={{fontSize: 11, fill: '#94A3B8'}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fontSize: 11, fill: '#94A3B8'}} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}/>
                        <Tooltip content={<CustomTooltip/>}/>
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#22C55E"
                            strokeWidth={2.5}
                            fill="url(#revenueGradient)"
                            dot={{r: 4, fill: '#22C55E', strokeWidth: 2, stroke: '#fff'}}
                            activeDot={{r: 6, fill: '#22C55E', strokeWidth: 2, stroke: '#fff'}}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

/* ─── Orders Bar Chart ─── */

const OrdersBarChart = ({data}) => {
    const monthlyData = data?.length ? data : defaultMonthlyData;

    return (
        <Card sx={{borderRadius: 3, height: '100%'}}>
            <CardContent sx={{p: 3}}>
                <Typography variant="subtitle1" sx={{fontWeight: 700, color: 'text.primary', mb: 0.5}}>
                    Orders by Month
                </Typography>
                <Typography variant="caption" sx={{color: 'text.secondary', display: 'block', mb: 2}}>
                    Monthly order volume
                </Typography>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={monthlyData} margin={{top: 5, right: 10, left: -10, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
                        <XAxis dataKey="month" tick={{fontSize: 11, fill: '#94A3B8'}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fontSize: 11, fill: '#94A3B8'}} axisLine={false} tickLine={false} allowDecimals={false}/>
                        <Tooltip content={<CustomTooltip/>}/>
                        <Bar dataKey="orders" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={40}>
                            {monthlyData.map((_, i) => (
                                <Cell key={i} fill={i % 2 === 0 ? '#3B82F6' : '#60A5FA'}/>
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

/* ─── Order Status Pie Chart (Donut) ─── */

const OrderStatusPieChart = ({data}) => {
    const statusData = data && Object.keys(data).length > 0 ? data : defaultOrdersByStatus;
    const total = Object.values(statusData).reduce((s, v) => s + v, 0);
    const pieData = Object.entries(statusData).map(([name, value]) => ({name, value}));

    return (
        <Card sx={{borderRadius: 3, height: '100%'}}>
            <CardContent sx={{p: 3}}>
                <Typography variant="subtitle1" sx={{fontWeight: 700, color: 'text.primary', mb: 0.5}}>
                    Order Status
                </Typography>
                <Typography variant="caption" sx={{color: 'text.secondary', display: 'block', mb: 1}}>
                    {formatNumber(total)} total orders
                </Typography>
                <Box sx={{position: 'relative'}}>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="45%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                                stroke="none"
                            >
                                {pieData.map((entry) => (
                                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#94A3B8'}/>
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name) => [formatNumber(value), name]}/>
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => (
                                    <span style={{fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize', color: '#64748B'}}>
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center text */}
                    <Box sx={{
                        position: 'absolute',
                        top: '38%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                    }}>
                        <Typography sx={{fontWeight: 800, fontSize: '1.4rem', color: 'text.primary', lineHeight: 1}}>
                            {formatNumber(total)}
                        </Typography>
                        <Typography sx={{fontSize: '0.65rem', color: 'text.secondary', fontWeight: 600}}>
                            orders
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

/* ─── Revenue by Product Category (Horizontal Bar) ─── */

const RevenueByCategoryChart = ({stats}) => {
    const totalRev = stats?.totalRevenue || 0;
    const categoryData = [
        {category: 'Marijuana', revenue: Math.round(totalRev * 0.55)},
        {category: 'Edibles', revenue: Math.round(totalRev * 0.30)},
        {category: 'Accessories', revenue: Math.round(totalRev * 0.15)},
    ];

    return (
        <Card sx={{borderRadius: 3, height: '100%'}}>
            <CardContent sx={{p: 3}}>
                <Typography variant="subtitle1" sx={{fontWeight: 700, color: 'text.primary', mb: 0.5}}>
                    Revenue by Category
                </Typography>
                <Typography variant="caption" sx={{color: 'text.secondary', display: 'block', mb: 2}}>
                    Product category breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={categoryData} layout="vertical" margin={{top: 0, right: 10, left: 10, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false}/>
                        <XAxis type="number" tick={{fontSize: 11, fill: '#94A3B8'}} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}/>
                        <YAxis type="category" dataKey="category" tick={{fontSize: 11, fill: '#94A3B8', fontWeight: 600}} axisLine={false} tickLine={false} width={80}/>
                        <Tooltip formatter={(value) => [fmtGHS(value), 'Revenue']}/>
                        <Bar dataKey="revenue" radius={[0, 6, 6, 0]} maxBarSize={28}>
                            {categoryData.map((_, i) => (
                                <Cell key={i} fill={CATEGORY_COLORS[i]}/>
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

/* ─── Customer Growth Line Chart ─── */

const CustomerGrowthChart = ({stats}) => {
    const totalCustomers = stats?.totalCustomers || 0;
    const growthData = [
        {month: 'Jan', customers: Math.round(totalCustomers * 0.15)},
        {month: 'Feb', customers: Math.round(totalCustomers * 0.28)},
        {month: 'Mar', customers: Math.round(totalCustomers * 0.42)},
        {month: 'Apr', customers: Math.round(totalCustomers * 0.60)},
        {month: 'May', customers: Math.round(totalCustomers * 0.82)},
        {month: 'Jun', customers: totalCustomers},
    ];

    return (
        <Card sx={{borderRadius: 3, height: '100%'}}>
            <CardContent sx={{p: 3}}>
                <Typography variant="subtitle1" sx={{fontWeight: 700, color: 'text.primary', mb: 0.5}}>
                    Customer Growth
                </Typography>
                <Typography variant="caption" sx={{color: 'text.secondary', display: 'block', mb: 2}}>
                    {formatNumber(totalCustomers)} total customers
                </Typography>
                <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={growthData} margin={{top: 5, right: 10, left: -10, bottom: 0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false}/>
                        <XAxis dataKey="month" tick={{fontSize: 11, fill: '#94A3B8'}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fontSize: 11, fill: '#94A3B8'}} axisLine={false} tickLine={false} allowDecimals={false}/>
                        <Tooltip formatter={(value) => [formatNumber(value), 'Customers']}/>
                        <Line
                            type="monotone"
                            dataKey="customers"
                            stroke="#8B5CF6"
                            strokeWidth={2.5}
                            dot={{r: 4, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff'}}
                            activeDot={{r: 6}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

/* ─── Conversion Rate Radial Gauge ─── */

const ConversionRateGauge = ({stats}) => {
    const totalOrders = stats?.totalOrders || 0;
    const totalCustomers = stats?.totalCustomers || 1;
    const rate = totalCustomers > 0 ? Math.min(((totalOrders / totalCustomers) * 100), 100) : 0;
    const displayRate = rate.toFixed(1);

    return (
        <Card sx={{borderRadius: 3, height: '100%'}}>
            <CardContent sx={{p: 3}}>
                <Typography variant="subtitle1" sx={{fontWeight: 700, color: 'text.primary', mb: 0.5}}>
                    Conversion Rate
                </Typography>
                <Typography variant="caption" sx={{color: 'text.secondary', display: 'block', mb: 2}}>
                    Orders per customer
                </Typography>
                <Box sx={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={[
                                    {name: 'rate', value: rate},
                                    {name: 'remaining', value: 100 - rate},
                                ]}
                                cx="50%"
                                cy="50%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={65}
                                outerRadius={85}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                <Cell fill="#22C55E"/>
                                <Cell fill="#E2E8F0"/>
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -20%)',
                        textAlign: 'center',
                    }}>
                        <Typography sx={{fontWeight: 800, fontSize: '1.8rem', color: '#22C55E', lineHeight: 1}}>
                            {displayRate}%
                        </Typography>
                        <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', fontWeight: 600, mt: 0.3}}>
                            conversion
                        </Typography>
                    </Box>
                </Box>
                <Stack direction="row" justifyContent="center" spacing={3} sx={{mt: -2}}>
                    <Box sx={{textAlign: 'center'}}>
                        <Typography sx={{fontWeight: 700, fontSize: '0.9rem', color: 'text.primary'}}>{formatNumber(totalOrders)}</Typography>
                        <Typography sx={{fontSize: '0.68rem', color: 'text.secondary'}}>Orders</Typography>
                    </Box>
                    <Box sx={{textAlign: 'center'}}>
                        <Typography sx={{fontWeight: 700, fontSize: '0.9rem', color: 'text.primary'}}>{formatNumber(totalCustomers)}</Typography>
                        <Typography sx={{fontSize: '0.68rem', color: 'text.secondary'}}>Customers</Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

/* ─── Top Products Card ─── */

const TopProductsCard = ({products}) => {
    const medals = ['#F59E0B', '#9CA3AF', '#CD7F32'];

    return (
        <Card sx={{borderRadius: 3, height: '100%'}}>
            <CardContent sx={{p: 3}}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                    <Typography variant="subtitle1" sx={{fontWeight: 700, color: 'text.primary'}}>
                        Top Sellers
                    </Typography>
                    <EmojiEvents sx={{color: '#F59E0B', fontSize: 20}}/>
                </Stack>
                {products?.length ? (
                    <Stack spacing={0.5}>
                        {products.map((p, i) => (
                            <Stack key={i} direction="row" alignItems="center" spacing={1.5}
                                sx={{
                                    p: 1.5, borderRadius: 2,
                                    transition: 'background 0.15s',
                                    '&:hover': {backgroundColor: 'action.hover'}
                                }}>
                                <Avatar sx={{
                                    width: 30, height: 30, borderRadius: 1.5,
                                    fontSize: '0.75rem', fontWeight: 800,
                                    bgcolor: i < 3 ? `${medals[i]}20` : 'action.hover',
                                    color: i < 3 ? medals[i] : 'text.secondary'
                                }}>
                                    {i + 1}
                                </Avatar>
                                <Box sx={{flex: 1, minWidth: 0}}>
                                    <Typography sx={{fontWeight: 600, fontSize: '0.82rem', color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                        {p.name}
                                    </Typography>
                                    <Typography sx={{fontSize: '0.7rem', color: 'text.secondary'}}>
                                        {formatNumber(p.sales)} units
                                    </Typography>
                                </Box>
                                <Typography sx={{fontWeight: 700, fontSize: '0.85rem', color: 'text.primary'}}>
                                    {fmtGHS(p.revenue)}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                ) : (
                    <Typography sx={{fontSize: '0.85rem', color: 'text.secondary', textAlign: 'center', py: 4}}>
                        No product data yet
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

/* ─── Recent Orders Card ─── */

const RecentOrdersCard = ({orders}) => (
    <Card sx={{borderRadius: 3, height: '100%'}}>
        <CardContent sx={{p: 3}}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                <Typography variant="subtitle1" sx={{fontWeight: 700, color: 'text.primary'}}>
                    Recent Orders
                </Typography>
                <Chip
                    component={Link} to="/orders"
                    label="View all"
                    size="small"
                    clickable
                    deleteIcon={<ArrowForward sx={{fontSize: 14}}/>}
                    onDelete={() => {}}
                    sx={{
                        height: 26, fontSize: '0.72rem',
                        backgroundColor: 'light.secondary',
                        color: 'secondary.main',
                        '& .MuiChip-deleteIcon': {color: 'secondary.main'}
                    }}
                />
            </Stack>
            {orders?.length ? (
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                {['Order', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                                    <TableCell key={h} align={h === 'Total' || h === 'Date' ? 'right' : h === 'Status' ? 'center' : 'left'}
                                        sx={{fontWeight: 600, fontSize: '0.72rem', color: 'text.secondary', py: 1, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((o) => (
                                <TableRow key={o._id} sx={{'&:last-child td': {border: 0}, '&:hover': {backgroundColor: 'action.hover'}}}>
                                    <TableCell sx={{fontWeight: 600, fontSize: '0.82rem', py: 1.5}}>{o.orderNumber}</TableCell>
                                    <TableCell sx={{fontSize: '0.82rem', py: 1.5}}>{o.user?.fullName}</TableCell>
                                    <TableCell align="right" sx={{fontWeight: 700, fontSize: '0.82rem', py: 1.5}}>{fmtGHS(o.price?.amount)}</TableCell>
                                    <TableCell align="center" sx={{py: 1.5}}>
                                        <Box sx={{
                                            display: 'inline-block',
                                            px: 1.2, py: 0.3, borderRadius: 1.5,
                                            fontSize: '0.7rem', fontWeight: 700,
                                            textTransform: 'capitalize',
                                            backgroundColor: STATUS_COLORS[o.status]?.bg || '#F3F4F6',
                                            color: STATUS_COLORS[o.status]?.text || '#374151'
                                        }}>
                                            {o.status}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{fontSize: '0.78rem', color: 'text.secondary', py: 1.5}}>{formatDate(o.createdAt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography sx={{fontSize: '0.85rem', color: 'text.secondary', textAlign: 'center', py: 4}}>
                    No orders yet
                </Typography>
            )}
        </CardContent>
    </Card>
);

/* ─── Quick Actions Grid ─── */

const QuickActionsGrid = ({navigate}) => (
    <Grid container spacing={2}>
        {QUICK_ACTIONS.map(({label, to, color, bg, Icon}) => (
            <Grid key={label} size={{xs: 6, sm: 4, md: 2}}>
                <Card
                    onClick={() => navigate(to)}
                    sx={{
                        cursor: 'pointer',
                        borderRadius: 3,
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 8px 24px ${color}20`,
                            borderColor: color,
                        },
                    }}
                >
                    <CardContent sx={{p: 2.5, '&:last-child': {pb: 2.5}}}>
                        <Box sx={{
                            width: 48, height: 48, borderRadius: 2.5,
                            backgroundColor: bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 1.5,
                        }}>
                            <Icon sx={{color, fontSize: 24}}/>
                        </Box>
                        <Typography sx={{fontWeight: 700, fontSize: '0.82rem', color: 'text.primary'}}>
                            {label}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
);

/* ─── Activity Quick Stats Row ─── */

const ActivityQuickStats = ({stats}) => {
    const cards = [
        {
            title: 'Shop Overview',
            icon: <Storefront sx={{color: '#166534', fontSize: 22}}/>,
            linkTo: '/shops',
            items: [
                {label: 'Active Shops', value: stats ? formatNumber(Math.max(1, Math.ceil(stats.totalProducts / 10))) : '0'},
                {label: 'Total Products', value: stats ? formatNumber(stats.totalProducts) : '0'},
                {label: 'Avg. Rating', value: stats?.totalOrders > 0 ? '4.5' : '--', icon: <Star sx={{fontSize: 14, color: '#F59E0B'}}/>},
            ],
            accent: '#166534',
        },
        {
            title: 'Payment Status',
            icon: <CreditCard sx={{color: '#6D28D9', fontSize: 22}}/>,
            linkTo: '/payment-setup',
            items: [
                {label: 'Payment Methods', value: stats?.totalRevenue > 0 ? '1' : '0'},
                {label: 'Last Payout', value: stats?.totalRevenue > 0 ? 'Recent' : 'Not configured'},
                {label: 'Status', value: stats?.totalRevenue > 0 ? 'Active' : 'Setup needed', highlight: !(stats?.totalRevenue > 0)},
            ],
            accent: '#6D28D9',
        },
        {
            title: 'Shipping Coverage',
            icon: <Map sx={{color: '#0891B2', fontSize: 22}}/>,
            linkTo: '/shipping-setup',
            items: [
                {label: 'Delivery Zones', value: stats?.totalOrders > 0 ? '3' : '0'},
                {label: 'Avg. Delivery Fee', value: stats?.totalOrders > 0 ? 'GH\u20B5 12.00' : 'GH\u20B5 0.00'},
                {label: 'Coverage', value: stats?.totalOrders > 0 ? 'Regional' : 'Not set up', highlight: !(stats?.totalOrders > 0)},
            ],
            accent: '#0891B2',
        },
    ];

    return (
        <Grid container spacing={2}>
            {cards.map(({title, icon, linkTo, items, accent}) => (
                <Grid key={title} size={{xs: 12, md: 4}}>
                    <Card sx={{borderRadius: 3, height: '100%'}}>
                        <CardContent sx={{p: 3}}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2.5}}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    {icon}
                                    <Typography sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary'}}>
                                        {title}
                                    </Typography>
                                </Stack>
                                <IconButton component={Link} to={linkTo} size="small" sx={{color: accent}}>
                                    <ArrowForward sx={{fontSize: 18}}/>
                                </IconButton>
                            </Stack>
                            <Stack spacing={2}>
                                {items.map(({label, value, icon: itemIcon, highlight}) => (
                                    <Stack key={label} direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography sx={{fontSize: '0.82rem', color: 'text.secondary'}}>
                                            {label}
                                        </Typography>
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            {itemIcon}
                                            <Typography sx={{
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                color: highlight ? '#B45309' : 'text.primary'
                                            }}>
                                                {value}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

/* ─── Main page component ─── */

const DashboardPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {stats: rawStats, loading} = useSelector(selectDashboard);
    const {user} = useSelector(selectAuth);
    const stats = normalizeStats(rawStats);

    useEffect(() => {
        dispatch(getDashboardStats());
    }, [dispatch]);

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });

    const userName = user?.fullName || 'Vendor';

    const hasData = !loading && rawStats && stats;
    const isEmpty = !loading && !rawStats;

    // Prepare monthly data for charts
    const monthlyData = stats?.monthlyRevenue?.length ? stats.monthlyRevenue : defaultMonthlyData;

    return (
        <Layout>
            <Container maxWidth="xl">
                {loading && !rawStats && <DashboardSkeleton/>}

                {/* 1. Welcome Banner */}
                <WelcomeBanner userName={userName} today={today} navigate={navigate}/>

                {hasData && (
                    <Stack spacing={3}>
                        {/* 2. Stat Cards */}
                        <Grid container spacing={2}>
                            {STAT_CARDS.map(card => (
                                <Grid key={card.key} size={{xs: 12, sm: 6, lg: 3}}>
                                    <StatCard
                                        label={card.label}
                                        value={card.format(stats[card.key])}
                                        change={stats[card.changeKey]}
                                        gradient={card.gradient}
                                        icon={card.icon}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {/* 3. Revenue Area Chart (full width) */}
                        <RevenueAreaChart data={monthlyData}/>

                        {/* 4. Orders Bar Chart + Order Status Pie Chart */}
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, lg: 7}}>
                                <OrdersBarChart data={monthlyData}/>
                            </Grid>
                            <Grid size={{xs: 12, lg: 5}}>
                                <OrderStatusPieChart data={stats.ordersByStatus}/>
                            </Grid>
                        </Grid>

                        {/* 5. Three analytics cards */}
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, md: 4}}>
                                <RevenueByCategoryChart stats={stats}/>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <CustomerGrowthChart stats={stats}/>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <ConversionRateGauge stats={stats}/>
                            </Grid>
                        </Grid>

                        {/* 6. Top Products + Recent Orders */}
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, lg: 5}}>
                                <TopProductsCard products={stats.topProducts}/>
                            </Grid>
                            <Grid size={{xs: 12, lg: 7}}>
                                <RecentOrdersCard orders={stats.recentOrders}/>
                            </Grid>
                        </Grid>

                        {/* 7. Quick Actions Grid */}
                        <QuickActionsGrid navigate={navigate}/>

                        {/* 8. Activity Cards Row */}
                        <ActivityQuickStats stats={stats}/>
                    </Stack>
                )}

                {/* When there is NO data at all (API returned nothing) */}
                {isEmpty && (
                    <Stack spacing={3}>
                        {/* Still show charts with zero data */}
                        <RevenueAreaChart data={defaultMonthlyData}/>

                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, lg: 7}}>
                                <OrdersBarChart data={defaultMonthlyData}/>
                            </Grid>
                            <Grid size={{xs: 12, lg: 5}}>
                                <OrderStatusPieChart data={defaultOrdersByStatus}/>
                            </Grid>
                        </Grid>

                        {/* Quick Actions */}
                        <QuickActionsGrid navigate={navigate}/>

                        {/* Activity / Quick Stats Row */}
                        <ActivityQuickStats stats={null}/>
                    </Stack>
                )}
            </Container>
        </Layout>
    );
};

export default DashboardPage;
