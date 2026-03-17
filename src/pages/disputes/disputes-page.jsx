import {useEffect, useState, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {
    Avatar, Box, Button, Card, CardContent, Chip, Container, Grid,
    InputAdornment, Stack, Tab, Tabs, TextField, Typography,
} from "@mui/material";
import {
    GavelRounded, SearchRounded, WarningAmberRounded, CheckCircleRounded,
    HourglassEmptyRounded, PendingRounded, ErrorRounded, AccessTimeRounded,
} from "@mui/icons-material";
import Layout from "../../components/layout/layout";
import {getDisputes, selectDisputes} from "../../redux/features/disputes/disputes-slice";
import {TableSkeleton} from "../../components/shared/page-skeleton";

const STATUS_CONFIG = {
    open: {bg: '#FEF3C7', text: '#92400E', dot: '#EAB308', label: 'Open'},
    investigating: {bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6', label: 'Investigating'},
    awaiting_response: {bg: '#FEF9C3', text: '#854D0E', dot: '#CA8A04', label: 'Awaiting Response'},
    resolved: {bg: '#D1FAE5', text: '#065F46', dot: '#22C55E', label: 'Resolved'},
    closed: {bg: '#F1F5F9', text: '#475569', dot: '#94A3B8', label: 'Closed'},
    escalated: {bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444', label: 'Escalated'},
};

const PRIORITY_CONFIG = {
    low: {color: '#22C55E', label: 'Low'},
    medium: {color: '#EAB308', label: 'Medium'},
    high: {color: '#F97316', label: 'High'},
    urgent: {color: '#EF4444', label: 'Urgent'},
};

const TABS = ['all', 'open', 'investigating', 'awaiting_response', 'resolved', 'closed'];

const DisputesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {disputes, loading} = useSelector(selectDisputes);
    const [tab, setTab] = useState(0);
    const [search, setSearch] = useState('');

    useEffect(() => { dispatch(getDisputes()); }, [dispatch]);

    const filtered = useMemo(() => {
        let result = disputes || [];
        if (tab > 0) result = result.filter(d => d.status === TABS[tab]);
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(d =>
                d.reason?.toLowerCase().includes(q) ||
                d.customer?.fullName?.toLowerCase().includes(q) ||
                d.order?.orderNumber?.toLowerCase().includes(q) ||
                d._id?.toLowerCase().includes(q)
            );
        }
        return result;
    }, [disputes, tab, search]);

    const stats = useMemo(() => {
        const all = disputes || [];
        return {
            total: all.length,
            open: all.filter(d => d.status === 'open' || d.status === 'awaiting_response').length,
            investigating: all.filter(d => d.status === 'investigating').length,
            resolved: all.filter(d => d.status === 'resolved' || d.status === 'closed').length,
        };
    }, [disputes]);

    return (
        <Layout>
            <Container maxWidth="xl">
                <Stack spacing={2.5}>
                    {/* Header */}
                    <Card sx={{border: 'none', overflow: 'hidden', background: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 50%, #F97316 100%)', color: '#fff'}}>
                        <Box sx={{position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                        <CardContent sx={{p: 3, position: 'relative'}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{width: 46, height: 46, bgcolor: 'rgba(255,255,255,0.15)'}}><GavelRounded sx={{fontSize: 24}}/></Avatar>
                                    <Box>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.3rem'}}>Disputes & Resolutions</Typography>
                                        <Typography sx={{fontSize: '0.82rem', opacity: 0.8}}>Manage conflicts with customers. Admin assists in resolution.</Typography>
                                    </Box>
                                </Stack>
                                {stats.open > 0 && (
                                    <Chip icon={<WarningAmberRounded sx={{fontSize: 14, color: '#fff !important'}}/>}
                                        label={`${stats.open} requiring attention`} size="small"
                                        sx={{bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, fontSize: '0.72rem'}}/>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <Grid container spacing={2}>
                        {[
                            {icon: GavelRounded, label: 'Total Disputes', value: stats.total, color: '#F97316'},
                            {icon: WarningAmberRounded, label: 'Open / Awaiting', value: stats.open, color: '#EAB308'},
                            {icon: HourglassEmptyRounded, label: 'Investigating', value: stats.investigating, color: '#3B82F6'},
                            {icon: CheckCircleRounded, label: 'Resolved / Closed', value: stats.resolved, color: '#22C55E'},
                        ].map(s => (
                            <Grid key={s.label} size={{xs: 6, lg: 3}}>
                                <Card sx={{border: 'none', background: `${s.color}06`}}>
                                    <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Box sx={{width: 36, height: 36, borderRadius: 1.5, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <s.icon sx={{fontSize: 18, color: s.color}}/>
                                            </Box>
                                            <Box>
                                                <Typography sx={{fontSize: '1.1rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.2}}>{s.value}</Typography>
                                                <Typography sx={{fontSize: '0.65rem', color: 'text.secondary', fontWeight: 500}}>{s.label}</Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Toolbar */}
                    <Card>
                        <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems={{sm: 'center'}}>
                                <TextField fullWidth placeholder="Search by reason, customer, order..." value={search}
                                    onChange={(e) => setSearch(e.target.value)} size="small" sx={{flex: 1}}
                                    slotProps={{input: {startAdornment: <InputAdornment position="start"><SearchRounded sx={{fontSize: 20, color: 'text.secondary'}}/></InputAdornment>}}}/>
                                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
                                    sx={{minHeight: 36, '& .MuiTab-root': {minHeight: 36, fontWeight: 600, fontSize: '0.78rem', textTransform: 'none', px: 1.5}, '& .Mui-selected': {color: '#C2410C'}, '& .MuiTabs-indicator': {backgroundColor: '#C2410C'}}}>
                                    {TABS.map(t => <Tab key={t} label={t === 'all' ? 'All' : (STATUS_CONFIG[t]?.label || t)}/>)}
                                </Tabs>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* List */}
                    {loading ? <TableSkeleton/> : filtered.length === 0 ? (
                        <Card>
                            <CardContent sx={{p: 3}}>
                                <Box sx={{textAlign: 'center', py: 8}}>
                                    <GavelRounded sx={{fontSize: 48, color: 'text.secondary', opacity: 0.15, mb: 1}}/>
                                    <Typography sx={{fontWeight: 700, color: 'text.primary', mb: 0.5}}>No disputes found</Typography>
                                    <Typography sx={{color: 'text.secondary', fontSize: '0.85rem'}}>
                                        {search ? 'Try adjusting your search' : 'Great! No active disputes to handle.'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ) : (
                        <Stack spacing={1.5}>
                            {filtered.map((d) => {
                                const sConfig = STATUS_CONFIG[d.status] || STATUS_CONFIG.open;
                                const pConfig = PRIORITY_CONFIG[d.priority] || PRIORITY_CONFIG.medium;
                                return (
                                    <Card key={d._id} onClick={() => navigate(`/disputes/${d._id}`)}
                                        sx={{cursor: 'pointer', transition: 'all 0.15s', '&:hover': {borderColor: '#F9731660', transform: 'translateX(2px)'}}}>
                                        <CardContent sx={{p: 2.5}}>
                                            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" spacing={2}>
                                                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{flex: 1}}>
                                                    <Avatar sx={{width: 40, height: 40, bgcolor: `${sConfig.dot}12`, color: sConfig.dot, fontWeight: 700, fontSize: '0.85rem'}}>
                                                        {d.customer?.fullName?.[0] || d.user?.fullName?.[0] || '?'}
                                                    </Avatar>
                                                    <Box sx={{flex: 1, minWidth: 0}}>
                                                        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 0.5}}>
                                                            <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary'}}>
                                                                {d.reason || d.subject || 'Dispute'}
                                                            </Typography>
                                                            <Box sx={{width: 4, height: 4, borderRadius: '50%', bgcolor: pConfig.color}}/>
                                                            <Typography sx={{fontSize: '0.65rem', color: pConfig.color, fontWeight: 700, textTransform: 'uppercase'}}>{pConfig.label}</Typography>
                                                        </Stack>
                                                        <Typography sx={{fontSize: '0.78rem', color: 'text.secondary', mb: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 500}}>
                                                            {d.description || d.message || 'No description provided'}
                                                        </Typography>
                                                        <Stack direction="row" spacing={2} alignItems="center">
                                                            <Typography sx={{fontSize: '0.72rem', color: 'text.secondary'}}>
                                                                Customer: <strong>{d.customer?.fullName || d.user?.fullName || 'Unknown'}</strong>
                                                            </Typography>
                                                            {d.order && (
                                                                <Typography sx={{fontSize: '0.72rem', color: 'text.secondary'}}>
                                                                    Order: <strong>{d.order?.orderNumber || d.order?._id?.slice(-6)}</strong>
                                                                </Typography>
                                                            )}
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                <AccessTimeRounded sx={{fontSize: 12, color: 'text.secondary'}}/>
                                                                <Typography sx={{fontSize: '0.68rem', color: 'text.secondary'}}>
                                                                    {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A'}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                                <Stack alignItems="flex-end" spacing={1}>
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <Box sx={{width: 6, height: 6, borderRadius: '50%', bgcolor: sConfig.dot}}/>
                                                        <Typography sx={{fontSize: '0.72rem', fontWeight: 600, color: sConfig.text}}>{sConfig.label}</Typography>
                                                    </Stack>
                                                    {d.responses?.length > 0 && (
                                                        <Typography sx={{fontSize: '0.65rem', color: 'text.secondary'}}>{d.responses.length} response(s)</Typography>
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}
                </Stack>
            </Container>
        </Layout>
    );
};

export default DisputesPage;
