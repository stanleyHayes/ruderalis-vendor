import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {
    LocalShippingRounded,
    AddRounded,
    DeleteRounded,
    LocationOnRounded,
    SaveRounded,
    EditRounded,
    InfoRounded,
    PublicRounded,
} from "@mui/icons-material";
import Layout from "../../components/layout/layout";
import {updateProfile, selectAuth, clearMessage, clearError} from "../../redux/features/auth/auth-slice";

const fmtGHS = (v) => `GH₵ ${(Number(v) || 0).toFixed(2)}`;

const ShippingSetupPage = () => {
    const dispatch = useDispatch();
    const {user, loading, message, error} = useSelector(selectAuth);
    const [destinations, setDestinations] = useState([]);
    const [shippingPolicy, setShippingPolicy] = useState('');
    const [freeShippingThreshold, setFreeShippingThreshold] = useState('');

    useEffect(() => {
        setDestinations(user?.destinations || []);
        setShippingPolicy(user?.shippingPolicy || '');
        setFreeShippingThreshold(user?.freeShippingThreshold || '');
    }, [user]);

    const addDestination = () => setDestinations([...destinations, {name: '', price: {amount: 0, currency: 'GHS'}}]);
    const removeDestination = (i) => setDestinations(destinations.filter((_, idx) => idx !== i));
    const updateDestination = (i, field, value) => {
        const updated = [...destinations];
        if (field === 'name') updated[i] = {...updated[i], name: value};
        else updated[i] = {...updated[i], price: {...updated[i].price, amount: parseFloat(value) || 0}};
        setDestinations(updated);
    };

    const handleSave = () => {
        dispatch(clearError());
        dispatch(clearMessage());
        dispatch(updateProfile({
            destinations,
            shippingPolicy,
            freeShippingThreshold: parseFloat(freeShippingThreshold) || 0
        }));
    };

    const activeZones = destinations.filter(d => d.name);
    const avgRate = activeZones.length > 0 ? activeZones.reduce((s, d) => s + (d.price?.amount || 0), 0) / activeZones.length : 0;
    const freeZones = activeZones.filter(d => (d.price?.amount || 0) === 0).length;

    return (
        <Layout>
            <Container maxWidth="lg">
                <Stack spacing={2.5}>
                    {/* Header */}
                    <Card sx={{border: 'none', overflow: 'hidden', background: 'linear-gradient(135deg, #0E7490 0%, #0891B2 50%, #22D3EE 100%)', color: '#fff'}}>
                        <Box sx={{position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                        <Box sx={{position: 'absolute', bottom: -25, left: '30%', width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.04)'}}/>
                        <CardContent sx={{p: 3, position: 'relative'}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{width: 46, height: 46, bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)'}}>
                                        <LocalShippingRounded sx={{fontSize: 24}}/>
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.3rem'}}>Shipping & Delivery</Typography>
                                        <Typography sx={{fontSize: '0.82rem', opacity: 0.8}}>Set up delivery zones, rates, and shipping policies</Typography>
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <Chip label={`${activeZones.length} zones`} size="small"
                                        sx={{bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: '0.72rem'}}/>
                                    <Chip label={`Avg ${fmtGHS(avgRate)}`} size="small"
                                        sx={{bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, fontSize: '0.72rem'}}/>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>

                    {message && <Alert severity="success" onClose={() => dispatch(clearMessage())}>{message}</Alert>}
                    {error && <Alert severity="error" onClose={() => dispatch(clearError())}>{error}</Alert>}

                    {/* Stats */}
                    <Stack direction="row" spacing={2} sx={{flexWrap: 'wrap', gap: 2}}>
                        {[
                            {label: 'Delivery Zones', value: activeZones.length, color: '#0891B2'},
                            {label: 'Free Delivery', value: freeZones, color: '#10B981'},
                            {label: 'Avg Rate', value: fmtGHS(avgRate), color: '#F59E0B'},
                        ].map(s => (
                            <Card key={s.label} sx={{flex: 1, minWidth: 0, border: 'none', background: `${s.color}08`}}>
                                <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box sx={{width: 36, height: 36, borderRadius: 2, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <LocalShippingRounded sx={{fontSize: 18, color: s.color}}/>
                                        </Box>
                                        <Box>
                                            <Typography sx={{fontSize: '1.1rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.2}}>{s.value}</Typography>
                                            <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', fontWeight: 500}}>{s.label}</Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>

                    <Grid container spacing={2.5}>
                        {/* Delivery Zones */}
                        <Grid size={{xs: 12, lg: 8}}>
                            <Stack spacing={2}>
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2.5}}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Box sx={{width: 32, height: 32, borderRadius: 1.5, bgcolor: '#0891B212', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <PublicRounded sx={{fontSize: 16, color: '#0891B2'}}/>
                                                </Box>
                                                <Box>
                                                    <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary'}}>Delivery Zones</Typography>
                                                    <Typography sx={{fontSize: '0.7rem', color: 'text.secondary'}}>Add areas where you deliver and set the fee</Typography>
                                                </Box>
                                            </Stack>
                                            <Button startIcon={<AddRounded/>} onClick={addDestination} size="small" sx={{fontSize: '0.78rem'}}>Add Zone</Button>
                                        </Stack>

                                        {destinations.length === 0 ? (
                                            <Box sx={{py: 6, textAlign: 'center'}}>
                                                <LocalShippingRounded sx={{fontSize: 48, color: 'text.secondary', opacity: 0.15, mb: 1}}/>
                                                <Typography sx={{color: 'text.secondary', fontSize: '0.88rem', mb: 0.5, fontWeight: 600}}>No delivery zones yet</Typography>
                                                <Typography sx={{color: 'text.secondary', fontSize: '0.78rem', mb: 2}}>Add zones to let customers know where you deliver</Typography>
                                                <Button startIcon={<AddRounded/>} onClick={addDestination} variant="outlined" size="small">Add First Zone</Button>
                                            </Box>
                                        ) : (
                                            <Stack spacing={1.5}>
                                                {destinations.map((dest, i) => (
                                                    <Stack key={i} direction="row" spacing={2} alignItems="center"
                                                        sx={{p: 2, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', '&:hover': {bgcolor: 'rgba(8,145,178,0.03)', borderColor: '#0891B240'}, transition: 'all 0.15s'}}>
                                                        <Box sx={{width: 28, height: 28, borderRadius: 1, bgcolor: '#0891B212', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                                                            <LocationOnRounded sx={{fontSize: 16, color: '#0891B2'}}/>
                                                        </Box>
                                                        <TextField size="small" placeholder="e.g. Accra - East Legon, Kumasi - Ahodwo" value={dest.name}
                                                            onChange={(e) => updateDestination(i, 'name', e.target.value)} sx={{flex: 1}}/>
                                                        <TextField size="small" type="number" placeholder="0.00" value={dest.price?.amount || ''}
                                                            onChange={(e) => updateDestination(i, 'price', e.target.value)} sx={{width: 150}}
                                                            slotProps={{input: {startAdornment: <InputAdornment position="start"><Typography sx={{fontSize: '0.78rem', color: 'text.secondary', fontWeight: 600}}>GH₵</Typography></InputAdornment>}}}/>
                                                        <IconButton size="small" onClick={() => removeDestination(i)} sx={{color: '#EF4444'}}>
                                                            <DeleteRounded sx={{fontSize: 18}}/>
                                                        </IconButton>
                                                    </Stack>
                                                ))}

                                                <Button onClick={addDestination} startIcon={<AddRounded/>} variant="outlined" fullWidth
                                                    sx={{py: 1, borderStyle: 'dashed', fontSize: '0.82rem', mt: 1}}>
                                                    Add Another Zone
                                                </Button>
                                            </Stack>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Shipping Policy */}
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 2}}>
                                            <Box sx={{width: 32, height: 32, borderRadius: 1.5, bgcolor: '#10B98112', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <EditRounded sx={{fontSize: 16, color: '#10B981'}}/>
                                            </Box>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.92rem', color: 'text.primary'}}>Shipping Policy</Typography>
                                        </Stack>
                                        <Stack spacing={2}>
                                            <TextField size="small" fullWidth multiline rows={3} label="Shipping Policy"
                                                placeholder="Describe your shipping and delivery policy (e.g. delivery times, handling, packaging...)"
                                                value={shippingPolicy} onChange={(e) => setShippingPolicy(e.target.value)}/>
                                            <TextField size="small" fullWidth type="number" label="Free Shipping Threshold (GHS)"
                                                placeholder="Orders above this amount get free delivery"
                                                value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)}
                                                slotProps={{input: {startAdornment: <InputAdornment position="start"><Typography sx={{fontSize: '0.78rem', color: 'text.secondary', fontWeight: 600}}>GH₵</Typography></InputAdornment>}}}/>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                <Stack direction="row" justifyContent="flex-end">
                                    <Button variant="contained" onClick={handleSave} disabled={loading} startIcon={<SaveRounded/>} sx={{px: 4, py: 1}}>
                                        Save Shipping Settings
                                    </Button>
                                </Stack>
                            </Stack>
                        </Grid>

                        {/* Summary Sidebar */}
                        <Grid size={{xs: 12, lg: 4}}>
                            <Stack spacing={2}>
                                {activeZones.length > 0 && (
                                    <Card>
                                        <CardContent sx={{p: 3}}>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.88rem', color: 'text.primary', mb: 2}}>Rate Summary</Typography>
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{fontWeight: 600, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', py: 1}}>Zone</TableCell>
                                                            <TableCell align="right" sx={{fontWeight: 600, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', py: 1}}>Fee</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {activeZones.map((d, i) => (
                                                            <TableRow key={i} sx={{'&:last-child td': {border: 0}}}>
                                                                <TableCell sx={{fontSize: '0.82rem', py: 1.2}}>{d.name}</TableCell>
                                                                <TableCell align="right" sx={{fontWeight: 700, fontSize: '0.82rem', color: d.price?.amount === 0 ? '#10B981' : 'text.primary', py: 1.2}}>
                                                                    {d.price?.amount === 0 ? 'Free' : fmtGHS(d.price?.amount)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </CardContent>
                                    </Card>
                                )}

                                <Card sx={{background: 'rgba(8,145,178,0.04)'}}>
                                    <CardContent sx={{p: 3}}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 2}}>
                                            <InfoRounded sx={{fontSize: 18, color: '#0891B2'}}/>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.88rem', color: 'text.primary'}}>Tips</Typography>
                                        </Stack>
                                        <Stack spacing={1.5}>
                                            {[
                                                'Add specific areas like "Accra - Osu" rather than broad regions',
                                                'Set a GH₵ 0 fee for zones where you offer free delivery',
                                                'Use the free shipping threshold to encourage larger orders',
                                                'Keep delivery fees competitive to attract more customers',
                                            ].map((tip, i) => (
                                                <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                                                    <Box sx={{width: 4, height: 4, borderRadius: '50%', bgcolor: '#0891B2', mt: 0.8, flexShrink: 0}}/>
                                                    <Typography sx={{fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.5}}>{tip}</Typography>
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

export default ShippingSetupPage;
