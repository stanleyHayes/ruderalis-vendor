import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import {ArrowBack, Email, LocalHospital, LocationOn, Phone} from "@mui/icons-material";
import {DetailSkeleton} from "../../components/shared/page-skeleton";
import Layout from "../../components/layout/layout";
import {getCustomer, selectCustomers, clearCustomer} from "../../redux/features/customers/customers-slice";

const AVATAR_COLORS = [
    '#059669', '#2563EB', '#7C3AED', '#DB2777', '#D97706', '#0891B2', '#4F46E5', '#BE185D',
];

const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const fmtGHS = (v) => `GH₵ ${(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

const STATUS_STYLES = {
    active: {bg: '#D1FAE5', text: '#065F46'},
    suspended: {bg: '#FEE2E2', text: '#991B1B'},
};

const CustomerDetailPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    const {customer, loading, error} = useSelector(selectCustomers);

    useEffect(() => {
        dispatch(getCustomer(id));
        return () => dispatch(clearCustomer());
    }, [dispatch, id]);

    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Button
                            startIcon={<ArrowBack/>}
                            onClick={() => navigate("/customers")}
                            sx={{alignSelf: "flex-start", color: "text.secondary"}}
                        >
                            Back to Customers
                        </Button>

                        {loading ? (
                            <DetailSkeleton/>
                        ) : error ? (
                            <Typography variant="body1" sx={{color: "error.main", textAlign: "center", py: 4}}>
                                {error}
                            </Typography>
                        ) : customer ? (
                            <>
                                {/* Profile Header */}
                                <Card sx={{overflow: 'hidden'}}>
                                    <Box sx={{
                                        height: 80,
                                        background: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
                                    }}/>
                                    <CardContent sx={{p: 3, mt: -5}}>
                                        <Stack direction={{xs: "column", sm: "row"}} alignItems={{sm: "flex-end"}} spacing={2.5}>
                                            {(() => {
                                                const color = getAvatarColor(customer.fullName || '');
                                                return (
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: `${color}18`,
                                                            color: color,
                                                            width: 80,
                                                            height: 80,
                                                            fontSize: '2rem',
                                                            fontWeight: 800,
                                                            border: '4px solid',
                                                            borderColor: 'background.paper',
                                                        }}
                                                    >
                                                        {customer.fullName.charAt(0)}
                                                    </Avatar>
                                                );
                                            })()}
                                            <Box sx={{flex: 1, pb: 0.5}}>
                                                <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                                                    <Typography variant="h5" sx={{color: "text.primary", fontWeight: 800}}>
                                                        {customer.fullName}
                                                    </Typography>
                                                    {(() => {
                                                        const s = STATUS_STYLES[customer.status] || STATUS_STYLES.inactive;
                                                        return (
                                                            <Box sx={{
                                                                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                                                                px: 1.2, py: 0.3, borderRadius: 1.5,
                                                                fontSize: '0.7rem', fontWeight: 700,
                                                                textTransform: 'capitalize',
                                                                backgroundColor: s.bg, color: s.text,
                                                            }}>
                                                                <Box sx={{width: 6, height: 6, borderRadius: '50%', bgcolor: s.text}}/>
                                                                {customer.status}
                                                            </Box>
                                                        );
                                                    })()}
                                                </Stack>
                                                <Typography variant="body2" sx={{color: "text.secondary", mt: 0.5}}>
                                                    Customer since {new Date(customer.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Stat Cards with Gradients */}
                                <Grid container spacing={2}>
                                    {[
                                        {
                                            label: 'Total Orders',
                                            value: customer.totalOrders,
                                            gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
                                            icon: '#',
                                        },
                                        {
                                            label: 'Total Spent',
                                            value: fmtGHS(customer.totalSpent),
                                            gradient: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
                                            icon: '₵',
                                        },
                                    ].map((stat) => (
                                        <Grid size={{xs: 12, sm: 6}} key={stat.label}>
                                            <Card sx={{
                                                border: 'none',
                                                borderRadius: 3,
                                                background: stat.gradient,
                                                color: '#fff',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                minHeight: 130,
                                            }}>
                                                <Box sx={{
                                                    position: 'absolute', top: -20, right: -20,
                                                    width: 100, height: 100, borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.1)',
                                                }}/>
                                                <Box sx={{
                                                    position: 'absolute', bottom: -30, right: 30,
                                                    width: 60, height: 60, borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.08)',
                                                }}/>
                                                <CardContent sx={{p: 2.5, position: 'relative', zIndex: 1}}>
                                                    <Box sx={{
                                                        width: 36, height: 36, borderRadius: 2,
                                                        background: 'rgba(255,255,255,0.2)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        mb: 1.5, fontSize: '1.1rem', fontWeight: 800,
                                                    }}>
                                                        {stat.icon}
                                                    </Box>
                                                    <Typography sx={{fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1, mb: 0.5}}>
                                                        {stat.value}
                                                    </Typography>
                                                    <Typography sx={{fontSize: '0.78rem', opacity: 0.85, fontWeight: 500}}>
                                                        {stat.label}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>

                                {/* Info Cards */}
                                <Grid container spacing={2}>
                                    <Grid size={{xs: 12, md: 4}}>
                                        <Card sx={{height: "100%"}}>
                                            <CardContent sx={{p: 3}}>
                                                <Typography variant="subtitle1" sx={{color: "text.primary", fontWeight: 700, mb: 2}}>
                                                    Contact Information
                                                </Typography>
                                                <Divider sx={{mb: 2}}/>
                                                <Stack spacing={2}>
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Box sx={{
                                                            width: 34, height: 34, borderRadius: 2,
                                                            bgcolor: 'light.secondary',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                            <Email sx={{color: "secondary.main", fontSize: 18}}/>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" sx={{color: "text.secondary"}}>Email</Typography>
                                                            <Typography variant="body2" sx={{color: "text.primary", fontWeight: 500}}>
                                                                {customer.email}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                                        <Box sx={{
                                                            width: 34, height: 34, borderRadius: 2,
                                                            bgcolor: 'light.secondary',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                            <Phone sx={{color: "secondary.main", fontSize: 18}}/>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" sx={{color: "text.secondary"}}>Phone</Typography>
                                                            <Typography variant="body2" sx={{color: "text.primary", fontWeight: 500}}>
                                                                {customer.phone}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid size={{xs: 12, md: 4}}>
                                        <Card sx={{height: "100%"}}>
                                            <CardContent sx={{p: 3}}>
                                                <Typography variant="subtitle1" sx={{color: "text.primary", fontWeight: 700, mb: 2}}>
                                                    Medical Card
                                                </Typography>
                                                <Divider sx={{mb: 2}}/>
                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                    <Box sx={{
                                                        width: 34, height: 34, borderRadius: 2,
                                                        bgcolor: 'rgba(16,185,129,0.08)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <LocalHospital sx={{color: "secondary.main", fontSize: 18}}/>
                                                    </Box>
                                                    <Typography variant="body2" sx={{color: "text.primary", fontWeight: 500}}>
                                                        {customer.medicalCard}
                                                    </Typography>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid size={{xs: 12, md: 4}}>
                                        <Card sx={{height: "100%"}}>
                                            <CardContent sx={{p: 3}}>
                                                <Typography variant="subtitle1" sx={{color: "text.primary", fontWeight: 700, mb: 2}}>
                                                    Address
                                                </Typography>
                                                <Divider sx={{mb: 2}}/>
                                                <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                                                    <Box sx={{
                                                        width: 34, height: 34, borderRadius: 2,
                                                        bgcolor: 'light.secondary',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        flexShrink: 0,
                                                    }}>
                                                        <LocationOn sx={{color: "secondary.main", fontSize: 18}}/>
                                                    </Box>
                                                    <Typography variant="body2" sx={{color: "text.primary", fontWeight: 500, lineHeight: 1.7}}>
                                                        {customer.address?.street}{customer.address?.gpAddressOrHouseNumber ? ` (${customer.address.gpAddressOrHouseNumber})` : ''}<br/>
                                                        {customer.address?.city}, {customer.address?.region}<br/>
                                                        {customer.address?.country}
                                                    </Typography>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </>
                        ) : null}
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default CustomerDetailPage;
