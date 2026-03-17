import Layout from "../../components/layout/layout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {Link} from "react-router-dom";
import {getOrder, updateOrderStatus, updateItemStatus, selectOrders, clearOrder} from "../../redux/features/orders/orders-slice";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    FormControl,
    Grid,
    MenuItem,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {
    ArrowBack,
    PersonRounded,
    EmailRounded,
    PhoneRounded,
    LocalShippingRounded,
    CreditCardRounded,
    ReceiptLongRounded,
    UpdateRounded,
    InventoryRounded,
    StickyNote2Rounded,
    CheckCircleRounded,
    StorefrontRounded,
    AccountBalanceRounded,
    LocalAtmRounded,
    LocationOnRounded,
} from "@mui/icons-material";
import {DetailSkeleton} from "../../components/shared/page-skeleton";

const STATUS_STYLES = {
    pending: {bg: '#FEF3C7', text: '#92400E', dot: '#EAB308', label: 'Pending'},
    processing: {bg: '#E0E7FF', text: '#3730A3', dot: '#6366F1', label: 'Processing'},
    delivering: {bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6', label: 'Delivering'},
    shipped: {bg: '#E0E7FF', text: '#3730A3', dot: '#8B5CF6', label: 'Shipped'},
    delivered: {bg: '#D1FAE5', text: '#065F46', dot: '#22C55E', label: 'Delivered'},
    completed: {bg: '#D1FAE5', text: '#065F46', dot: '#22C55E', label: 'Completed'},
    cancelled: {bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444', label: 'Cancelled'},
    refunded: {bg: '#FCE7F3', text: '#9D174D', dot: '#EC4899', label: 'Refunded'},
};

const PAYMENT_STATUS_STYLES = {
    pending: {bg: '#FEF3C7', text: '#92400E'},
    paid: {bg: '#D1FAE5', text: '#065F46'},
    failed: {bg: '#FEE2E2', text: '#991B1B'},
    refunded: {bg: '#DBEAFE', text: '#1E40AF'},
};

const PAYMENT_METHOD_ICONS = {
    mobile_money: PhoneRounded,
    credit_card: CreditCardRounded,
    debit_card: AccountBalanceRounded,
    cash: LocalAtmRounded,
    bank_transfer: AccountBalanceRounded,
};

const TIMELINE_STEPS = ['pending', 'processing', 'delivering', 'delivered'];
const VENDOR_ALLOWED_STATUSES = ['delivering', 'completed', 'cancelled'];
const ITEM_ALLOWED_STATUSES = ['pending', 'processing', 'delivering', 'shipped', 'delivered', 'completed', 'cancelled'];

const fmtGHS = (v) => `GH₵ ${(Number(v) || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'}) : '';
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) : '';

const SectionHeader = ({icon: Icon, title, color = '#10B981'}) => (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 2}}>
        <Box sx={{width: 34, height: 34, borderRadius: 2, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon sx={{fontSize: 18, color}}/>
        </Box>
        <Typography sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary'}}>{title}</Typography>
    </Stack>
);

const InfoItem = ({label, value, mono}) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{py: 0.8}}>
        <Typography sx={{color: 'text.secondary', fontSize: '0.82rem'}}>{label}</Typography>
        <Typography component="div" sx={{color: 'text.primary', fontWeight: 600, fontSize: '0.82rem', fontFamily: mono ? 'monospace' : 'inherit'}}>{value}</Typography>
    </Stack>
);

const StatusBadge = ({status, styles}) => {
    const s = styles?.[status] || {bg: '#F3F4F6', text: '#6B7280'};
    return (
        <Chip
            label={status?.replace('_', ' ')}
            size="small"
            sx={{
                height: 22, fontSize: '0.7rem', fontWeight: 600,
                textTransform: 'capitalize',
                bgcolor: s.bg, color: s.text,
            }}
        />
    );
};

const getItemPrice = (item) => {
    if (typeof item?.price === 'number') return item.price;
    if (typeof item?.product?.price === 'number') return item.product.price;
    if (typeof item?.product?.price?.amount === 'number') return item.product.price.amount;
    return 0;
};

const normalizeOrder = (raw) => {
    if (!raw) return null;
    // Handle various API response wrappers
    const o = raw.order || raw;
    return {
        ...o,
        items: o.items || o.products || [],
        user: o.user || o.customer || {},
        price: o.price || {amount: o.total || o.subtotal || 0, currency: o.currency || 'GHS'},
        subtotal: o.subtotal ?? o.price?.amount ?? 0,
        tax: o.tax ?? 0,
        shipping: o.shipping ?? o.deliveryFee?.amount ?? 0,
        destination: typeof o.destination === 'string' ? o.destination : (o.destination?.name || ''),
        shippingAddress: typeof o.shippingAddress === 'object' ? o.shippingAddress : (typeof o.destination === 'object' ? o.destination : null),
        shop: o.shop || {},
        coupon: o.coupon || null,
        notes: o.notes || '',
    };
};

const OrderDetailPage = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {order: rawOrder, loading} = useSelector(selectOrders);
    const order = normalizeOrder(rawOrder);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        dispatch(getOrder(id));
        return () => dispatch(clearOrder());
    }, [dispatch, id]);

    useEffect(() => {
        if (rawOrder) setNewStatus((rawOrder.order || rawOrder)?.status || '');
    }, [rawOrder]);

    const handleStatusUpdate = () => {
        if (newStatus && newStatus !== order?.status) {
            dispatch(updateOrderStatus({id: order._id, status: newStatus}));
        }
    };

    const handleItemStatusUpdate = (itemId, status) => {
        if (order?._id && itemId && status) {
            dispatch(updateItemStatus({id: order._id, itemId, status}));
        }
    };

    if (loading && !rawOrder) {
        return (
            <Layout>
                <Container maxWidth="xl">
                    <DetailSkeleton/>
                </Container>
            </Layout>
        );
    }

    if (!order) {
        return (
            <Layout>
                <Container maxWidth="xl">
                    <Stack alignItems="center" spacing={2} sx={{py: 10}}>
                        <ReceiptLongRounded sx={{fontSize: 48, color: 'text.secondary', opacity: 0.3}}/>
                        <Typography sx={{color: 'text.secondary'}}>Order not found</Typography>
                        <Button onClick={() => navigate('/orders')} variant="outlined" size="small">Back to Orders</Button>
                    </Stack>
                </Container>
            </Layout>
        );
    }

    const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
    const itemCount = order.items?.reduce((s, p) => s + (p?.quantity || 0), 0) || 0;
    const isCancelledOrRefunded = order.status === 'cancelled' || order.status === 'refunded';

    // Determine timeline index for current status
    const timelineIndex = (() => {
        if (isCancelledOrRefunded) return -1;
        const idx = TIMELINE_STEPS.indexOf(order.status);
        // shipped maps to delivering step, completed maps to delivered step
        if (order.status === 'shipped') return 2;
        if (order.status === 'completed') return 3;
        return idx;
    })();

    const PaymentIcon = PAYMENT_METHOD_ICONS[order.paymentMethod] || CreditCardRounded;

    // Shipping address
    const shippingAddr = order.shippingAddress;
    const addressParts = shippingAddr
        ? [shippingAddr.street, shippingAddr.city, shippingAddr.state, shippingAddr.zip, shippingAddr.country].filter(Boolean)
        : [];
    const destinationLabel = typeof order.destination === 'string'
        ? order.destination
        : order.destination?.name || order.destination?.toString() || null;

    return (
        <Layout>
            <Container maxWidth="xl">
                {/* Back */}
                <Button
                    startIcon={<ArrowBack sx={{fontSize: 16}}/>}
                    onClick={() => navigate('/orders')}
                    sx={{mb: 2, color: 'text.secondary', '&:hover': {color: 'primary.main', bgcolor: 'transparent'}}}>
                    Back to Orders
                </Button>

                {/* Hero Header */}
                <Card sx={{mb: 2.5, border: 'none', overflow: 'hidden', background: 'linear-gradient(135deg, #064E3B 0%, #059669 40%, #10B981 70%, #34D399 100%)', color: '#fff'}}>
                    <Box sx={{position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                    <Box sx={{position: 'absolute', bottom: -30, left: '40%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)'}}/>
                    <CardContent sx={{p: 3, position: 'relative'}}>
                        <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} spacing={2}>
                            <Box>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 0.5}}>
                                    <Typography sx={{fontWeight: 800, fontSize: '1.5rem'}}>{order.orderNumber || `#${order._id?.slice(-6)}`}</Typography>
                                    <Box sx={{
                                        px: 1.5, py: 0.4, borderRadius: 1.5,
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        fontSize: '0.75rem', fontWeight: 700,
                                        textTransform: 'capitalize'
                                    }}>
                                        {order.status}
                                    </Box>
                                </Stack>
                                <Typography sx={{fontSize: '0.82rem', opacity: 0.8}}>
                                    Placed on {fmtDate(order.createdAt)} at {fmtTime(order.createdAt)}
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={3}>
                                {[
                                    {label: 'Items', value: itemCount},
                                    {label: 'Total', value: fmtGHS(order.price?.amount)},
                                    {label: 'Payment', value: order.paymentMethod?.replace(/_/g, ' ')},
                                ].map(s => (
                                    <Box key={s.label} sx={{textAlign: 'center'}}>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.2rem'}}>{s.value}</Typography>
                                        <Typography sx={{fontSize: '0.68rem', opacity: 0.7, textTransform: 'capitalize'}}>{s.label}</Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {loading && <DetailSkeleton/>}

                {/* Status Timeline */}
                <Card sx={{mb: 2.5}}>
                    <CardContent sx={{p: 2.5}}>
                        {isCancelledOrRefunded ? (
                            <Stack alignItems="center" spacing={1} sx={{py: 1}}>
                                <Box sx={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    backgroundColor: statusStyle.bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: `2px solid ${statusStyle.text}`
                                }}>
                                    <CheckCircleRounded sx={{fontSize: 22, color: statusStyle.text}}/>
                                </Box>
                                <Typography sx={{fontWeight: 700, fontSize: '0.9rem', color: statusStyle.text, textTransform: 'capitalize'}}>
                                    Order {order.status}
                                </Typography>
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={0} sx={{overflow: 'auto'}}>
                                {TIMELINE_STEPS.map((s, i) => {
                                    const isCompleted = timelineIndex > i;
                                    const isCurrent = timelineIndex === i;
                                    const isActive = timelineIndex >= i;
                                    const style = STATUS_STYLES[s] || STATUS_STYLES.pending;
                                    return (
                                        <Stack key={s} direction="row" alignItems="center" sx={{flex: 1, minWidth: 0}}>
                                            <Stack alignItems="center" spacing={0.5} sx={{flex: 1}}>
                                                <Box sx={{
                                                    width: isCurrent ? 32 : 24, height: isCurrent ? 32 : 24,
                                                    borderRadius: '50%',
                                                    backgroundColor: isActive ? style.bg : 'action.hover',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'all 0.3s',
                                                    border: isCurrent ? `2px solid ${style.dot}` : 'none'
                                                }}>
                                                    {isActive && <CheckCircleRounded sx={{fontSize: isCurrent ? 18 : 14, color: style.dot}}/>}
                                                </Box>
                                                <Typography sx={{
                                                    fontSize: '0.62rem', fontWeight: isCurrent ? 700 : 500,
                                                    color: isActive ? style.text : 'text.secondary',
                                                    textTransform: 'capitalize', textAlign: 'center'
                                                }}>
                                                    {s}
                                                </Typography>
                                            </Stack>
                                            {i < TIMELINE_STEPS.length - 1 && (
                                                <Box sx={{
                                                    height: 2, flex: 1, minWidth: 16,
                                                    backgroundColor: isCompleted ? style.dot : 'action.hover',
                                                    transition: 'background 0.3s', mt: -2
                                                }}/>
                                            )}
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        )}
                    </CardContent>
                </Card>

                <Grid container spacing={2}>
                    {/* Left Column */}
                    <Grid size={{xs: 12, lg: 8}}>
                        <Stack spacing={2}>
                            {/* Products Table */}
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <SectionHeader icon={InventoryRounded} title={`Items (${itemCount} items)`} color="#3B82F6"/>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    {['Product', 'Qty', 'Unit Price', 'Status', 'Total'].map((h, i) => (
                                                        <TableCell key={h} align={i > 0 ? (i === 3 ? 'center' : 'right') : 'left'}
                                                            sx={{fontWeight: 600, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', py: 1.5}}>
                                                            {h}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {order.items?.map((item, i) => {
                                                    const unitPrice = getItemPrice(item);
                                                    const lineTotal = (item?.quantity || 0) * unitPrice;
                                                    const itemStatus = item?.status || 'pending';
                                                    const itemStyle = STATUS_STYLES[itemStatus] || STATUS_STYLES.pending;
                                                    const productImage = item?.product?.image;
                                                    const itemId = item?.product?._id || item?._id || i;
                                                    return (
                                                        <TableRow key={i} sx={{'&:last-child td': {border: 0}, '&:hover': {bgcolor: 'action.hover'}}}>
                                                            <TableCell sx={{py: 2}}>
                                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                                    {productImage ? (
                                                                        <Avatar
                                                                            src={productImage}
                                                                            variant="rounded"
                                                                            sx={{width: 36, height: 36, borderRadius: 2}}
                                                                        />
                                                                    ) : (
                                                                        <Avatar sx={{
                                                                            width: 36, height: 36, borderRadius: 2,
                                                                            bgcolor: `hsl(${(i * 60) + 120}, 40%, 92%)`,
                                                                            color: `hsl(${(i * 60) + 120}, 50%, 35%)`,
                                                                            fontSize: '0.75rem', fontWeight: 700
                                                                        }}>
                                                                            {(item?.product?.name || 'P')[0]}
                                                                        </Avatar>
                                                                    )}
                                                                    <Box>
                                                                        <Typography sx={{fontWeight: 600, fontSize: '0.85rem', color: 'text.primary'}}>
                                                                            {item?.product?.name || 'Unknown'}
                                                                        </Typography>
                                                                        {item?.product?.variant && (
                                                                            <Typography sx={{fontSize: '0.7rem', color: 'text.secondary'}}>
                                                                                {item.product.variant}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell align="right" sx={{fontWeight: 600, fontSize: '0.85rem'}}>{item?.quantity || 0}</TableCell>
                                                            <TableCell align="right" sx={{fontSize: '0.85rem', color: 'text.secondary'}}>{fmtGHS(unitPrice)}</TableCell>
                                                            <TableCell align="center">
                                                                <FormControl size="small" sx={{minWidth: 120}}>
                                                                    <Select
                                                                        value={itemStatus}
                                                                        onChange={(e) => handleItemStatusUpdate(itemId, e.target.value)}
                                                                        sx={{
                                                                            borderRadius: 2, height: 28,
                                                                            fontSize: '0.72rem', fontWeight: 600,
                                                                            bgcolor: itemStyle.bg, color: itemStyle.text,
                                                                            '.MuiSelect-icon': {color: itemStyle.text},
                                                                            '& .MuiOutlinedInput-notchedOutline': {border: 'none'},
                                                                        }}
                                                                        renderValue={(val) => (
                                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                                <Box sx={{width: 6, height: 6, borderRadius: '50%', bgcolor: (STATUS_STYLES[val] || STATUS_STYLES.pending).dot}}/>
                                                                                <span style={{textTransform: 'capitalize'}}>{val}</span>
                                                                            </Stack>
                                                                        )}
                                                                    >
                                                                        {ITEM_ALLOWED_STATUSES.map(s => {
                                                                            const st = STATUS_STYLES[s] || STATUS_STYLES.pending;
                                                                            return (
                                                                                <MenuItem key={s} value={s}>
                                                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                                                        <Box sx={{width: 8, height: 8, borderRadius: '50%', bgcolor: st.dot}}/>
                                                                                        <Typography sx={{textTransform: 'capitalize', fontSize: '0.8rem'}}>{s}</Typography>
                                                                                    </Stack>
                                                                                </MenuItem>
                                                                            );
                                                                        })}
                                                                    </Select>
                                                                </FormControl>
                                                            </TableCell>
                                                            <TableCell align="right" sx={{fontWeight: 700, fontSize: '0.85rem'}}>{fmtGHS(lineTotal)}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* Order Totals */}
                                    <Divider sx={{my: 2}}/>
                                    <Box sx={{maxWidth: 320, ml: 'auto'}}>
                                        <Stack spacing={1}>
                                            <InfoItem label="Subtotal" value={fmtGHS(order.subtotal)} mono/>
                                            <InfoItem label="Tax" value={fmtGHS(order.tax)} mono/>
                                            <InfoItem label="Shipping" value={order.shipping === 0 ? 'Free' : fmtGHS(order.shipping)} mono={order.shipping !== 0}/>
                                            {order.coupon?.discount && (
                                                <InfoItem label={`Coupon (${order.coupon.code || ''})`} value={`- ${fmtGHS(order.coupon.discount)}`} mono/>
                                            )}
                                            <Divider/>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{py: 0.5}}>
                                                <Typography sx={{fontWeight: 800, fontSize: '0.95rem', color: 'text.primary'}}>Total</Typography>
                                                <Typography sx={{fontWeight: 800, fontSize: '1.1rem', color: '#059669'}}>{fmtGHS(order.price?.amount)}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* Notes */}
                            {order.notes && (
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <SectionHeader icon={StickyNote2Rounded} title="Order Notes" color="#F59E0B"/>
                                        <Box sx={{p: 2, borderRadius: 2, bgcolor: 'rgba(245,158,11,0.06)', borderLeft: '3px solid #F59E0B'}}>
                                            <Typography sx={{fontSize: '0.85rem', color: 'text.primary', lineHeight: 1.6}}>
                                                {order.notes}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </Grid>

                    {/* Right Column */}
                    <Grid size={{xs: 12, lg: 4}}>
                        <Stack spacing={2}>
                            {/* Customer */}
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <SectionHeader icon={PersonRounded} title="Customer" color="#8B5CF6"/>
                                    <Stack spacing={2}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{width: 44, height: 44, bgcolor: '#8B5CF620', color: '#8B5CF6', fontWeight: 700}}>
                                                {(order.user?.fullName || order.user?.firstName || 'C')[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary'}}>
                                                    {order.user?.fullName || [order.user?.firstName, order.user?.lastName].filter(Boolean).join(' ') || 'N/A'}
                                                </Typography>
                                                <Typography sx={{fontSize: '0.75rem', color: 'text.secondary'}}>Customer</Typography>
                                            </Box>
                                        </Stack>
                                        <Divider/>
                                        <Stack spacing={1.5}>
                                            {order.user?.email && (
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <EmailRounded sx={{fontSize: 16, color: 'text.secondary'}}/>
                                                    <Typography
                                                        component="a"
                                                        href={`mailto:${order.user.email}`}
                                                        sx={{fontSize: '0.82rem', color: 'text.primary', textDecoration: 'none', '&:hover': {color: '#059669', textDecoration: 'underline'}}}
                                                    >
                                                        {order.user.email}
                                                    </Typography>
                                                </Stack>
                                            )}
                                            {order.user?.phone && (
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <PhoneRounded sx={{fontSize: 16, color: 'text.secondary'}}/>
                                                    <Typography
                                                        component="a"
                                                        href={`tel:${order.user.phone}`}
                                                        sx={{fontSize: '0.82rem', color: 'text.primary', textDecoration: 'none', '&:hover': {color: '#059669', textDecoration: 'underline'}}}
                                                    >
                                                        {order.user.phone}
                                                    </Typography>
                                                </Stack>
                                            )}
                                            {order.user?.address && (
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <LocationOnRounded sx={{fontSize: 16, color: 'text.secondary'}}/>
                                                    <Typography sx={{fontSize: '0.82rem', color: 'text.primary'}}>
                                                        {typeof order.user.address === 'string'
                                                            ? order.user.address
                                                            : [order.user.address?.street, order.user.address?.city, order.user.address?.state, order.user.address?.country].filter(Boolean).join(', ') || 'N/A'}
                                                    </Typography>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Shipping */}
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <SectionHeader icon={LocalShippingRounded} title="Shipping" color="#0891B2"/>
                                    <Stack spacing={1.5}>
                                        {destinationLabel && (
                                            <Box sx={{p: 2, borderRadius: 2, bgcolor: 'rgba(8,145,178,0.06)'}}>
                                                <Typography sx={{fontSize: '0.72rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5}}>
                                                    Delivery Zone
                                                </Typography>
                                                <Typography sx={{fontWeight: 600, fontSize: '0.85rem', color: 'text.primary'}}>
                                                    {destinationLabel}
                                                </Typography>
                                            </Box>
                                        )}
                                        {addressParts.length > 0 && (
                                            <Box sx={{p: 2, borderRadius: 2, bgcolor: 'rgba(8,145,178,0.06)'}}>
                                                <Typography sx={{fontSize: '0.72rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5}}>
                                                    Shipping Address
                                                </Typography>
                                                <Typography sx={{fontWeight: 600, fontSize: '0.85rem', color: 'text.primary'}}>
                                                    {addressParts.join(', ')}
                                                </Typography>
                                            </Box>
                                        )}
                                        {!destinationLabel && addressParts.length === 0 && (
                                            <Typography sx={{fontSize: '0.85rem', color: 'text.secondary'}}>No shipping info available</Typography>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Shop */}
                            {order.shop && (
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <SectionHeader icon={StorefrontRounded} title="Shop" color="#D97706"/>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{width: 40, height: 40, bgcolor: '#D9770620', color: '#D97706', fontWeight: 700}}>
                                                {(order.shop?.name || 'S')[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography
                                                    component={order.shop?._id ? Link : 'span'}
                                                    to={order.shop?._id ? `/shops/${order.shop._id}` : undefined}
                                                    sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary', textDecoration: 'none', '&:hover': {color: '#D97706'}}}
                                                >
                                                    {order.shop?.name || 'Unknown Shop'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Payment */}
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <SectionHeader icon={CreditCardRounded} title="Payment" color="#059669"/>
                                    <Stack spacing={1} divider={<Divider sx={{opacity: 0.5}}/>}>
                                        <InfoItem label="Method" value={
                                            <Stack direction="row" spacing={0.75} alignItems="center">
                                                <PaymentIcon sx={{fontSize: 16, color: '#059669'}}/>
                                                <Chip label={order.paymentMethod?.replace(/_/g, ' ')} size="small" sx={{
                                                    height: 22, fontSize: '0.7rem', fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                    bgcolor: '#D1FAE5', color: '#065F46'
                                                }}/>
                                            </Stack>
                                        }/>
                                        <InfoItem label="Status" value={
                                            <StatusBadge status={order.paymentStatus} styles={PAYMENT_STATUS_STYLES}/>
                                        }/>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Update Status */}
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <SectionHeader icon={UpdateRounded} title="Update Status" color="#F59E0B"/>
                                    <Stack spacing={2}>
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                value={newStatus}
                                                onChange={e => setNewStatus(e.target.value)}
                                                sx={{borderRadius: 2}}
                                                renderValue={(val) => {
                                                    const st = STATUS_STYLES[val] || STATUS_STYLES.pending;
                                                    return (
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Box sx={{width: 8, height: 8, borderRadius: '50%', bgcolor: st.dot}}/>
                                                            <span style={{textTransform: 'capitalize', fontSize: '0.85rem'}}>{val}</span>
                                                        </Stack>
                                                    );
                                                }}
                                            >
                                                {VENDOR_ALLOWED_STATUSES.map(s => {
                                                    const style = STATUS_STYLES[s];
                                                    return (
                                                        <MenuItem key={s} value={s}>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Box sx={{width: 8, height: 8, borderRadius: '50%', bgcolor: style.dot}}/>
                                                                <Typography sx={{textTransform: 'capitalize', fontSize: '0.85rem'}}>{s}</Typography>
                                                            </Stack>
                                                        </MenuItem>
                                                    );
                                                })}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={handleStatusUpdate}
                                            disabled={loading || newStatus === order.status}
                                            sx={{bgcolor: '#059669', '&:hover': {bgcolor: '#047857'}}}>
                                            Update Status
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Layout>
    );
};

export default OrderDetailPage;
