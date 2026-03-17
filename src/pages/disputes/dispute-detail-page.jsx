import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router";
import {Link} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    Alert, Avatar, Box, Button, Card, CardContent, Chip, Container, Divider,
    Grid, Stack, TextField, Typography,
} from "@mui/material";
import {
    ArrowBack, GavelRounded, PersonRounded, LocalShippingRounded, AccessTimeRounded,
    SendRounded, WarningAmberRounded, CheckCircleRounded, EscalatorWarningRounded,
    SupportAgentRounded, DescriptionRounded,
} from "@mui/icons-material";
import Layout from "../../components/layout/layout";
import {getDispute, respondToDispute, escalateDispute, selectDisputes, clearDispute} from "../../redux/features/disputes/disputes-slice";
import {DetailSkeleton} from "../../components/shared/page-skeleton";

const STATUS_CONFIG = {
    open: {bg: '#FEF3C7', text: '#92400E', dot: '#EAB308', label: 'Open'},
    investigating: {bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6', label: 'Investigating'},
    awaiting_response: {bg: '#FEF9C3', text: '#854D0E', dot: '#CA8A04', label: 'Awaiting Response'},
    resolved: {bg: '#D1FAE5', text: '#065F46', dot: '#22C55E', label: 'Resolved'},
    closed: {bg: '#F1F5F9', text: '#475569', dot: '#94A3B8', label: 'Closed'},
    escalated: {bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444', label: 'Escalated'},
};

const PRIORITY_CONFIG = {
    low: {color: '#22C55E'}, medium: {color: '#EAB308'}, high: {color: '#F97316'}, urgent: {color: '#EF4444'},
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : 'N/A';

const SectionHeader = ({icon: Icon, title, color = '#F97316'}) => (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 2}}>
        <Box sx={{width: 34, height: 34, borderRadius: 1.5, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon sx={{fontSize: 18, color}}/>
        </Box>
        <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary'}}>{title}</Typography>
    </Stack>
);

const DisputeDetailPage = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {dispute, loading, error} = useSelector(selectDisputes);
    const [success, setSuccess] = useState('');

    useEffect(() => { dispatch(getDispute(id)); return () => dispatch(clearDispute()); }, [dispatch, id]);

    const formik = useFormik({
        initialValues: {message: '', evidence: ''},
        validationSchema: Yup.object({message: Yup.string().required('Response is required').min(10, 'At least 10 characters')}),
        onSubmit: async (values, {resetForm}) => {
            const result = await dispatch(respondToDispute({id, message: values.message, evidence: values.evidence}));
            if (!result.error) { setSuccess('Response submitted successfully'); resetForm(); setTimeout(() => setSuccess(''), 3000); }
        },
    });

    const handleEscalate = async () => {
        const result = await dispatch(escalateDispute(id));
        if (!result.error) setSuccess('Dispute escalated to admin');
    };

    if (loading && !dispute) return <Layout><Container maxWidth="lg"><DetailSkeleton/></Container></Layout>;

    if (!dispute) return (
        <Layout><Container maxWidth="lg">
            <Stack alignItems="center" spacing={2} sx={{py: 10}}>
                <GavelRounded sx={{fontSize: 48, color: 'text.secondary', opacity: 0.3}}/>
                <Typography sx={{color: 'text.secondary'}}>Dispute not found</Typography>
                <Button onClick={() => navigate('/disputes')} variant="outlined" size="small">Back to Disputes</Button>
            </Stack>
        </Container></Layout>
    );

    const sConfig = STATUS_CONFIG[dispute.status] || STATUS_CONFIG.open;
    const pConfig = PRIORITY_CONFIG[dispute.priority] || PRIORITY_CONFIG.medium;
    const isOpen = ['open', 'investigating', 'awaiting_response'].includes(dispute.status);

    return (
        <Layout>
            <Container maxWidth="lg">
                <Stack spacing={2.5}>
                    <Button startIcon={<ArrowBack sx={{fontSize: 16}}/>} onClick={() => navigate('/disputes')}
                        sx={{alignSelf: 'flex-start', color: 'text.secondary', '&:hover': {color: 'primary.main', bgcolor: 'transparent'}}}>
                        Back to Disputes
                    </Button>

                    {/* Hero */}
                    <Card sx={{border: 'none', overflow: 'hidden', background: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 50%, #F97316 100%)', color: '#fff'}}>
                        <Box sx={{position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                        <CardContent sx={{p: 3, position: 'relative'}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} spacing={2}>
                                <Box>
                                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 0.5}}>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.2rem'}}>{dispute.reason || dispute.subject || 'Dispute'}</Typography>
                                        <Box sx={{px: 1.2, py: 0.3, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', fontWeight: 700}}>
                                            {sConfig.label}
                                        </Box>
                                    </Stack>
                                    <Typography sx={{fontSize: '0.82rem', opacity: 0.8}}>
                                        Opened {fmtDate(dispute.createdAt)} · Priority: {dispute.priority || 'Medium'}
                                    </Typography>
                                </Box>
                                {isOpen && (
                                    <Button onClick={handleEscalate} startIcon={<WarningAmberRounded/>} variant="contained"
                                        sx={{bgcolor: 'rgba(255,255,255,0.2)', '&:hover': {bgcolor: 'rgba(255,255,255,0.3)'}}}>
                                        Escalate to Admin
                                    </Button>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}
                    {error && <Alert severity="error">{error}</Alert>}

                    <Grid container spacing={2.5}>
                        {/* Left — Timeline */}
                        <Grid size={{xs: 12, lg: 8}}>
                            <Stack spacing={2}>
                                {/* Original Complaint */}
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <SectionHeader icon={DescriptionRounded} title="Original Complaint" color="#C2410C"/>
                                        <Box sx={{p: 2.5, borderRadius: 2, bgcolor: 'rgba(249,115,22,0.04)', borderLeft: '3px solid #F97316'}}>
                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 1.5}}>
                                                <Avatar sx={{width: 28, height: 28, bgcolor: '#F9731612', color: '#F97316', fontSize: '0.72rem', fontWeight: 700}}>
                                                    {dispute.customer?.fullName?.[0] || dispute.user?.fullName?.[0] || 'C'}
                                                </Avatar>
                                                <Typography sx={{fontWeight: 600, fontSize: '0.82rem', color: 'text.primary'}}>
                                                    {dispute.customer?.fullName || dispute.user?.fullName || 'Customer'}
                                                </Typography>
                                                <Typography sx={{fontSize: '0.68rem', color: 'text.secondary'}}>{fmtDate(dispute.createdAt)}</Typography>
                                            </Stack>
                                            <Typography sx={{fontSize: '0.85rem', color: 'text.primary', lineHeight: 1.7}}>
                                                {dispute.description || dispute.message || 'No description provided.'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Conversation Thread */}
                                {dispute.responses?.length > 0 && (
                                    <Card>
                                        <CardContent sx={{p: 3}}>
                                            <SectionHeader icon={SupportAgentRounded} title="Resolution Thread" color="#3B82F6"/>
                                            <Stack spacing={2}>
                                                {dispute.responses.map((r, i) => {
                                                    const isVendor = r.role === 'vendor' || r.from === 'vendor';
                                                    const isAdmin = r.role === 'admin' || r.from === 'admin';
                                                    const color = isAdmin ? '#7C3AED' : isVendor ? '#166534' : '#C2410C';
                                                    const label = isAdmin ? 'Admin' : isVendor ? 'You (Vendor)' : 'Customer';
                                                    return (
                                                        <Box key={i} sx={{p: 2, borderRadius: 2, bgcolor: `${color}04`, borderLeft: `3px solid ${color}`}}>
                                                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 1}}>
                                                                <Avatar sx={{width: 24, height: 24, bgcolor: `${color}12`, color, fontSize: '0.62rem', fontWeight: 700}}>
                                                                    {isAdmin ? 'A' : isVendor ? 'V' : 'C'}
                                                                </Avatar>
                                                                <Typography sx={{fontWeight: 600, fontSize: '0.78rem', color}}>{label}</Typography>
                                                                <Typography sx={{fontSize: '0.65rem', color: 'text.secondary'}}>{fmtDate(r.createdAt || r.date)}</Typography>
                                                            </Stack>
                                                            <Typography sx={{fontSize: '0.82rem', color: 'text.primary', lineHeight: 1.6}}>
                                                                {r.message || r.text}
                                                            </Typography>
                                                            {r.evidence && (
                                                                <Typography sx={{fontSize: '0.72rem', color: 'text.secondary', mt: 1, fontStyle: 'italic'}}>
                                                                    Evidence: {r.evidence}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    );
                                                })}
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Response Form */}
                                {isOpen && (
                                    <Card>
                                        <CardContent sx={{p: 3}} component="form" onSubmit={formik.handleSubmit}>
                                            <SectionHeader icon={SendRounded} title="Your Response" color="#166534"/>
                                            <Stack spacing={2}>
                                                <TextField fullWidth multiline rows={4} label="Response Message" placeholder="Explain your side, provide context, or propose a resolution..."
                                                    name="message" value={formik.values.message} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                                    error={formik.touched.message && Boolean(formik.errors.message)}
                                                    helperText={formik.touched.message && formik.errors.message} size="small"/>
                                                <TextField fullWidth label="Evidence (optional)" placeholder="Link to evidence, screenshot URL, tracking number..."
                                                    name="evidence" value={formik.values.evidence} onChange={formik.handleChange} size="small"/>
                                                <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
                                                    <Button type="submit" variant="contained" startIcon={<SendRounded/>} disabled={loading}>
                                                        Submit Response
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}
                            </Stack>
                        </Grid>

                        {/* Right — Info */}
                        <Grid size={{xs: 12, lg: 4}}>
                            <Stack spacing={2}>
                                {/* Status */}
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <Typography sx={{fontWeight: 700, fontSize: '0.88rem', color: 'text.primary', mb: 2}}>Dispute Info</Typography>
                                        <Stack spacing={1.5} divider={<Divider sx={{opacity: 0.5}}/>}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>Status</Typography>
                                                <Chip label={sConfig.label} size="small" sx={{height: 22, fontSize: '0.68rem', fontWeight: 700, bgcolor: sConfig.bg, color: sConfig.text}}/>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>Priority</Typography>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Box sx={{width: 6, height: 6, borderRadius: '50%', bgcolor: pConfig.color}}/>
                                                    <Typography sx={{fontSize: '0.78rem', fontWeight: 600, color: pConfig.color, textTransform: 'capitalize'}}>{dispute.priority || 'Medium'}</Typography>
                                                </Stack>
                                            </Stack>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>Opened</Typography>
                                                <Typography sx={{fontSize: '0.78rem', fontWeight: 500, color: 'text.primary'}}>{fmtDate(dispute.createdAt)}</Typography>
                                            </Stack>
                                            {dispute.resolvedAt && (
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>Resolved</Typography>
                                                    <Typography sx={{fontSize: '0.78rem', fontWeight: 500, color: '#22C55E'}}>{fmtDate(dispute.resolvedAt)}</Typography>
                                                </Stack>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Customer */}
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <SectionHeader icon={PersonRounded} title="Customer" color="#8B5CF6"/>
                                        <Stack spacing={1}>
                                            <Typography sx={{fontWeight: 600, fontSize: '0.88rem', color: 'text.primary'}}>
                                                {dispute.customer?.fullName || dispute.user?.fullName || 'Unknown'}
                                            </Typography>
                                            {(dispute.customer?.email || dispute.user?.email) && (
                                                <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>{dispute.customer?.email || dispute.user?.email}</Typography>
                                            )}
                                            {(dispute.customer?.phone || dispute.user?.phone) && (
                                                <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>{dispute.customer?.phone || dispute.user?.phone}</Typography>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>

                                {/* Order */}
                                {dispute.order && (
                                    <Card>
                                        <CardContent sx={{p: 3}}>
                                            <SectionHeader icon={LocalShippingRounded} title="Related Order" color="#0891B2"/>
                                            <Stack spacing={1}>
                                                <Typography sx={{fontWeight: 600, fontSize: '0.88rem', color: 'text.primary'}}>
                                                    {dispute.order?.orderNumber || `#${dispute.order?._id?.slice(-6)}`}
                                                </Typography>
                                                <Button component={Link} to={`/orders/${dispute.order?._id}`} size="small" variant="outlined" sx={{alignSelf: 'flex-start'}}>
                                                    View Order
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Tips */}
                                <Card sx={{background: 'rgba(249,115,22,0.04)'}}>
                                    <CardContent sx={{p: 3}}>
                                        <Typography sx={{fontWeight: 700, fontSize: '0.82rem', color: 'text.primary', mb: 1.5}}>Resolution Tips</Typography>
                                        <Stack spacing={1.5}>
                                            {[
                                                'Respond promptly to show good faith',
                                                'Provide evidence (photos, tracking numbers)',
                                                'Propose a fair resolution (refund, replacement)',
                                                'Escalate to admin if you cannot resolve directly',
                                                'Keep communication professional and factual',
                                            ].map((tip, i) => (
                                                <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                                                    <Box sx={{width: 4, height: 4, borderRadius: '50%', bgcolor: '#F97316', mt: 0.8, flexShrink: 0}}/>
                                                    <Typography sx={{fontSize: '0.72rem', color: 'text.secondary', lineHeight: 1.5}}>{tip}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </Layout>
    );
};

export default DisputeDetailPage;
