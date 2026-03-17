import {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    Alert, Avatar, Box, Button, Card, CardContent, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle,
    Divider, FormControl, Grid, IconButton, InputAdornment, MenuItem, Select, Stack, Step, StepLabel, Stepper, TextField, Typography,
} from "@mui/material";
import {
    PaymentRounded, AddRounded, DeleteRounded, PhoneRounded, StorefrontRounded, CheckCircleRounded, SaveRounded,
    AccountBalanceWalletRounded, InfoRounded, CreditCardRounded, CurrencyBitcoinRounded, AccountBalanceRounded,
    ContentCopyRounded, VisibilityRounded, VisibilityOffRounded, LocalAtmRounded,
} from "@mui/icons-material";
import Layout from "../../components/layout/layout";
import {updateProfile, selectAuth, clearMessage, clearError} from "../../redux/features/auth/auth-slice";

const CATEGORIES = [
    {value: 'mobile_money', label: 'Mobile Money', icon: PhoneRounded, color: '#16A34A', desc: 'MTN MoMo, Vodafone Cash, AirtelTigo'},
    {value: 'crypto', label: 'Cryptocurrency', icon: CurrencyBitcoinRounded, color: '#CA8A04', desc: 'Bitcoin, Ethereum, USDT'},
    {value: 'bank', label: 'Bank Transfer', icon: AccountBalanceRounded, color: '#2563EB', desc: 'Direct bank deposits'},
];

const MOMO_PROVIDERS = [
    {value: 'mtn', label: 'MTN Mobile Money', color: '#FFCC00'},
    {value: 'vodafone', label: 'Vodafone Cash', color: '#E60000'},
    {value: 'airtelTigo', label: 'AirtelTigo Money', color: '#E40046'},
];

const CRYPTO_CURRENCIES = [
    {value: 'BTC', label: 'Bitcoin (BTC)', color: '#F7931A'},
    {value: 'ETH', label: 'Ethereum (ETH)', color: '#627EEA'},
    {value: 'USDT', label: 'Tether (USDT)', color: '#26A17B'},
    {value: 'USDC', label: 'USD Coin (USDC)', color: '#2775CA'},
];

const CRYPTO_NETWORKS = ['TRC20', 'ERC20', 'BEP20', 'Solana', 'Bitcoin'];

const SETUP_STEPS = [
    {label: 'Choose Type', desc: 'Select your preferred payment method'},
    {label: 'Enter Details', desc: 'Provide your account information'},
    {label: 'Verify & Save', desc: 'Confirm and activate the method'},
];

const PaymentSetupPage = () => {
    const dispatch = useDispatch();
    const {user, loading, message, error} = useSelector(selectAuth);
    const [methods, setMethods] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newMethod, setNewMethod] = useState({type: '', provider: '', number: '', accountName: '', currency: '', network: '', walletAddress: '', bankName: '', accountNumber: '', branchCode: ''});

    useEffect(() => {
        const saved = user?.paymentMethods?.length ? user.paymentMethods : user?.paymentDetails ? [user.paymentDetails] : [];
        setMethods(saved);
    }, [user]);

    const removeMethod = (i) => {
        const updated = methods.filter((_, idx) => idx !== i);
        setMethods(updated);
        dispatch(updateProfile({paymentMethods: updated, paymentDetails: updated[0] || null}));
    };

    const handleAddMethod = () => {
        const m = {...newMethod};
        const updated = [...methods, m];
        setMethods(updated);
        dispatch(clearError());
        dispatch(clearMessage());
        dispatch(updateProfile({paymentMethods: updated, paymentDetails: updated[0]}));
        setDialogOpen(false);
        setNewMethod({type: '', provider: '', number: '', accountName: '', currency: '', network: '', walletAddress: '', bankName: '', accountNumber: '', branchCode: ''});
    };

    const momoCount = methods.filter(m => m.type === 'mobile_money' || m.provider === 'mtn' || m.provider === 'vodafone' || m.provider === 'airtelTigo').length;
    const cryptoCount = methods.filter(m => m.type === 'crypto').length;
    const bankCount = methods.filter(m => m.type === 'bank').length;

    const getMethodLabel = (m) => {
        if (m.type === 'crypto') return `${m.currency || 'Crypto'} - ${m.network || ''}`;
        if (m.type === 'bank') return `${m.bankName || 'Bank'} - ****${(m.accountNumber || '').slice(-4)}`;
        return `${(m.provider || 'Mobile Money').toUpperCase()} - ${m.number || ''}`;
    };

    const getMethodColor = (m) => {
        if (m.type === 'crypto') return '#F59E0B';
        if (m.type === 'bank') return '#3B82F6';
        return '#10B981';
    };

    const getMethodIcon = (m) => {
        if (m.type === 'crypto') return CurrencyBitcoinRounded;
        if (m.type === 'bank') return AccountBalanceRounded;
        return PhoneRounded;
    };

    return (
        <Layout>
            <Container maxWidth="lg">
                <Stack spacing={2.5}>
                    {/* Header */}
                    <Card sx={{border: 'none', overflow: 'hidden', background: 'linear-gradient(135deg, #14532D 0%, #166534 40%, #22C55E 100%)', color: '#fff'}}>
                        <Box sx={{position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                        <CardContent sx={{p: 3, position: 'relative'}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} justifyContent="space-between" alignItems={{sm: 'center'}} spacing={2}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{width: 46, height: 46, bgcolor: 'rgba(255,255,255,0.15)'}}><PaymentRounded sx={{fontSize: 24}}/></Avatar>
                                    <Box>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.3rem'}}>Payment Methods</Typography>
                                        <Typography sx={{fontSize: '0.82rem', opacity: 0.8}}>Configure how you receive payments from customers</Typography>
                                    </Box>
                                </Stack>
                                <Button onClick={() => setDialogOpen(true)} startIcon={<AddRounded/>} variant="contained"
                                    sx={{bgcolor: 'rgba(255,255,255,0.2)', '&:hover': {bgcolor: 'rgba(255,255,255,0.3)'}}}>
                                    Add Method
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    {message && <Alert severity="success" onClose={() => dispatch(clearMessage())}>{message}</Alert>}
                    {error && <Alert severity="error" onClose={() => dispatch(clearError())}>{error}</Alert>}

                    {/* Stats */}
                    <Stack direction="row" spacing={2} sx={{flexWrap: 'wrap', gap: 2}}>
                        {[
                            {label: 'Total Methods', value: methods.length, color: '#166534'},
                            {label: 'Mobile Money', value: momoCount, color: '#16A34A'},
                            {label: 'Crypto Wallets', value: cryptoCount, color: '#CA8A04'},
                            {label: 'Bank Accounts', value: bankCount, color: '#2563EB'},
                        ].map(s => (
                            <Card key={s.label} sx={{flex: 1, minWidth: 0, border: 'none', background: `${s.color}08`}}>
                                <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                                    <Typography sx={{fontSize: '1.1rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.2}}>{s.value}</Typography>
                                    <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', fontWeight: 500}}>{s.label}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>

                    <Grid container spacing={2.5}>
                        {/* Methods List */}
                        <Grid size={{xs: 12, lg: 8}}>
                            {methods.length === 0 ? (
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <Box sx={{textAlign: 'center', py: 6}}>
                                            <PaymentRounded sx={{fontSize: 48, color: 'text.secondary', opacity: 0.15, mb: 1}}/>
                                            <Typography sx={{fontWeight: 700, color: 'text.primary', mb: 1}}>No payment methods configured</Typography>
                                            <Typography sx={{color: 'text.secondary', fontSize: '0.85rem', mb: 2}}>Add a payment method so customers can pay you</Typography>
                                            <Button onClick={() => setDialogOpen(true)} variant="outlined" startIcon={<AddRounded/>}>Add Payment Method</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Grid container spacing={2} sx={{alignItems: 'stretch'}}>
                                    {methods.map((m, i) => {
                                        const color = getMethodColor(m);
                                        const Icon = getMethodIcon(m);
                                        const providerLabel = m.provider?.toUpperCase() || m.type?.replace('_', ' ') || 'Payment';
                                        return (
                                            <Grid key={i} size={{xs: 12, sm: 6, md: 4}}>
                                                <Card sx={{overflow: 'hidden', transition: 'all 0.2s', '&:hover': {borderColor: `${color}60`, transform: 'translateY(-2px)', boxShadow: `0 8px 24px ${color}12`}}}>
                                                    {/* Colored header bar */}
                                                    <Box sx={{height: 6, background: `linear-gradient(90deg, ${color}, ${color}80)`}}/>
                                                    <CardContent sx={{p: 2.5}}>
                                                        {/* Top row */}
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                                <Box sx={{width: 40, height: 40, borderRadius: 2, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                                    <Icon sx={{fontSize: 20, color}}/>
                                                                </Box>
                                                                <Box>
                                                                    <Typography sx={{fontWeight: 700, fontSize: '0.88rem', color: 'text.primary', textTransform: 'capitalize'}}>
                                                                        {m.type === 'crypto' ? (m.currency || 'Crypto') : providerLabel}
                                                                    </Typography>
                                                                    <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', textTransform: 'capitalize'}}>
                                                                        {m.type?.replace('_', ' ') || 'mobile money'}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                {i === 0 && <Chip label="Primary" size="small" sx={{height: 20, fontSize: '0.58rem', fontWeight: 700, bgcolor: `${color}15`, color}}/>}
                                                                <IconButton size="small" onClick={() => removeMethod(i)} sx={{color: 'text.secondary', '&:hover': {color: '#EF4444'}}}>
                                                                    <DeleteRounded sx={{fontSize: 16}}/>
                                                                </IconButton>
                                                            </Stack>
                                                        </Stack>

                                                        {/* Details — always 3 rows for consistent height */}
                                                        <Stack spacing={1.2} sx={{flex: 1}}>
                                                            <Box sx={{p: 1.5, borderRadius: 1.5, bgcolor: `${color}06`}}>
                                                                <Typography sx={{fontSize: '0.65rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.3}}>
                                                                    {m.type === 'crypto' ? 'Wallet Address' : m.type === 'bank' ? 'Account Number' : 'Mobile Number'}
                                                                </Typography>
                                                                <Typography sx={{fontSize: '0.88rem', fontWeight: 700, color: 'text.primary', fontFamily: m.type === 'crypto' ? 'monospace' : 'inherit'}}>
                                                                    {m.type === 'crypto' && m.walletAddress
                                                                        ? `${m.walletAddress.slice(0, 10)}...${m.walletAddress.slice(-6)}`
                                                                        : m.type === 'bank' ? (m.accountNumber || '—')
                                                                        : (m.number || '—')}
                                                                </Typography>
                                                            </Box>
                                                            <Stack direction="row" justifyContent="space-between" sx={{px: 0.5}}>
                                                                <Typography sx={{fontSize: '0.72rem', color: 'text.secondary'}}>Name</Typography>
                                                                <Typography sx={{fontSize: '0.72rem', fontWeight: 600, color: 'text.primary'}}>{m.accountName || '—'}</Typography>
                                                            </Stack>
                                                            <Stack direction="row" justifyContent="space-between" sx={{px: 0.5}}>
                                                                <Typography sx={{fontSize: '0.72rem', color: 'text.secondary'}}>
                                                                    {m.type === 'crypto' ? 'Network' : m.type === 'bank' ? 'Bank' : 'Provider'}
                                                                </Typography>
                                                                <Typography sx={{fontSize: '0.72rem', fontWeight: 600, color}}>
                                                                    {m.type === 'crypto' ? (m.network || '—') : m.type === 'bank' ? (m.bankName || '—') : (m.provider?.toUpperCase() || '—')}
                                                                </Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                    <Grid size={{xs: 12, sm: 6, md: 4}}>
                                        <Card onClick={() => setDialogOpen(true)} sx={{cursor: 'pointer', borderStyle: 'dashed', borderWidth: 2, transition: 'all 0.2s', '&:hover': {borderColor: 'secondary.main', bgcolor: 'light.secondary', transform: 'translateY(-2px)'}}}>
                                            <Box sx={{height: 6}}/>
                                            <CardContent sx={{p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <Stack alignItems="center" spacing={1.5} sx={{py: 2}}>
                                                    <Box sx={{width: 48, height: 48, borderRadius: 2, bgcolor: 'light.green', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                        <AddRounded sx={{fontSize: 24, color: 'secondary.main'}}/>
                                                    </Box>
                                                    <Box sx={{textAlign: 'center'}}>
                                                        <Typography sx={{fontSize: '0.88rem', fontWeight: 700, color: 'text.primary'}}>Add Method</Typography>
                                                        <Typography sx={{fontSize: '0.68rem', color: 'text.secondary'}}>Mobile money, crypto, or bank</Typography>
                                                    </Box>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>

                        {/* Instructions Sidebar */}
                        <Grid size={{xs: 12, lg: 4}}>
                            <Stack spacing={2}>
                                {/* Setup Guide */}
                                <Card sx={{background: 'rgba(139,92,246,0.04)'}}>
                                    <CardContent sx={{p: 3}}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{mb: 2}}>
                                            <InfoRounded sx={{fontSize: 18, color: '#8B5CF6'}}/>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.88rem', color: 'text.primary'}}>Setup Guide</Typography>
                                        </Stack>
                                        <Stepper orientation="vertical" activeStep={-1} sx={{'.MuiStepLabel-label': {fontSize: '0.78rem'}, '.MuiStepLabel-iconContainer .MuiSvgIcon-root': {fontSize: 20}}}>
                                            {SETUP_STEPS.map(s => (
                                                <Step key={s.label}>
                                                    <StepLabel><Typography sx={{fontWeight: 600, fontSize: '0.78rem'}}>{s.label}</Typography>
                                                        <Typography sx={{fontSize: '0.68rem', color: 'text.secondary'}}>{s.desc}</Typography>
                                                    </StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </CardContent>
                                </Card>

                                {/* Mobile Money Instructions */}
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1.5}}>
                                            <Box sx={{width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981'}}/>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.82rem', color: 'text.primary'}}>Mobile Money</Typography>
                                        </Stack>
                                        <Typography sx={{fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.6}}>
                                            Add your MTN MoMo, Vodafone Cash, or AirtelTigo number. Customers pay directly to your mobile money. Ensure the number is registered and active. The name on the account must match your vendor name.
                                        </Typography>
                                    </CardContent>
                                </Card>

                                {/* Crypto Instructions */}
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1.5}}>
                                            <Box sx={{width: 8, height: 8, borderRadius: '50%', bgcolor: '#F59E0B'}}/>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.82rem', color: 'text.primary'}}>Cryptocurrency</Typography>
                                        </Stack>
                                        <Typography sx={{fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.6}}>
                                            Accept BTC, ETH, USDT, or USDC from customers. Provide your wallet address and select the correct network (TRC20, ERC20, BEP20). Double-check the address — crypto transactions are irreversible.
                                        </Typography>
                                    </CardContent>
                                </Card>

                                {/* Bank Instructions */}
                                <Card>
                                    <CardContent sx={{p: 3}}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 1.5}}>
                                            <Box sx={{width: 8, height: 8, borderRadius: '50%', bgcolor: '#3B82F6'}}/>
                                            <Typography sx={{fontWeight: 700, fontSize: '0.82rem', color: 'text.primary'}}>Bank Transfer</Typography>
                                        </Stack>
                                        <Typography sx={{fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.6}}>
                                            Add your bank account details for direct transfers. Customers can pay via bank deposit. Include the bank name, account number, and branch code. Transfers may take 1-3 business days to reflect.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Add Payment Method Dialog */}
                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{sx: {borderRadius: 2}}}>
                        <DialogTitle sx={{fontWeight: 700}}>Add Payment Method</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2.5} sx={{pt: 1}}>
                                {/* Category Selection */}
                                <Box>
                                    <Typography sx={{fontSize: '0.78rem', fontWeight: 600, color: 'text.secondary', mb: 1.5}}>Choose payment type</Typography>
                                    <Grid container spacing={1.5}>
                                        {CATEGORIES.map(c => {
                                            const selected = newMethod.type === c.value;
                                            return (
                                                <Grid key={c.value} size={{xs: 4}}>
                                                    <Box
                                                        onClick={() => setNewMethod({...newMethod, type: c.value, provider: '', currency: '', network: ''})}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            border: '2px solid',
                                                            borderColor: selected ? c.color : 'divider',
                                                            borderRadius: 2,
                                                            p: 2,
                                                            textAlign: 'center',
                                                            background: selected ? `${c.color}0A` : 'transparent',
                                                            transition: 'all 0.2s',
                                                            '&:hover': {borderColor: `${c.color}80`, background: `${c.color}06`},
                                                            position: 'relative',
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: 1,
                                                        }}>
                                                        {selected && (
                                                            <CheckCircleRounded sx={{position: 'absolute', top: 6, right: 6, fontSize: 16, color: c.color}}/>
                                                        )}
                                                        <Box sx={{
                                                            width: 44, height: 44, borderRadius: 2,
                                                            background: `${c.color}14`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                            <c.icon sx={{fontSize: 22, color: c.color}}/>
                                                        </Box>
                                                        <Typography sx={{fontWeight: 700, fontSize: '0.82rem', color: 'text.primary'}}>{c.label}</Typography>
                                                        <Typography sx={{fontSize: '0.65rem', color: 'text.secondary', lineHeight: 1.3}}>{c.desc}</Typography>
                                                    </Box>
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                </Box>

                                {/* Mobile Money Fields */}
                                {newMethod.type === 'mobile_money' && (
                                    <>
                                        <Box>
                                            <Typography sx={{fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 1}}>Provider</Typography>
                                            <Stack direction="row" spacing={1}>
                                                {MOMO_PROVIDERS.map(p => (
                                                    <Card key={p.value} onClick={() => setNewMethod({...newMethod, provider: p.value})}
                                                        sx={{flex: 1, cursor: 'pointer', borderColor: newMethod.provider === p.value ? `${p.color}80` : 'divider', background: newMethod.provider === p.value ? `${p.color}08` : 'transparent', transition: 'all 0.2s'}}>
                                                        <CardContent sx={{p: 1.5, textAlign: 'center', '&:last-child': {pb: 1.5}}}>
                                                            <Box sx={{width: 12, height: 12, borderRadius: '50%', bgcolor: p.color, mx: 'auto', mb: 0.5}}/>
                                                            <Typography sx={{fontWeight: 600, fontSize: '0.68rem'}}>{p.label}</Typography>
                                                            {newMethod.provider === p.value && <CheckCircleRounded sx={{fontSize: 14, color: p.color, mt: 0.3}}/>}
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </Stack>
                                        </Box>
                                        <TextField size="small" fullWidth label="Mobile Money Number" placeholder="0551234567" value={newMethod.number}
                                            onChange={(e) => setNewMethod({...newMethod, number: e.target.value})}
                                            slotProps={{input: {startAdornment: <InputAdornment position="start"><PhoneRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                        <TextField size="small" fullWidth label="Account Name" placeholder="Full name on mobile money" value={newMethod.accountName}
                                            onChange={(e) => setNewMethod({...newMethod, accountName: e.target.value})}
                                            slotProps={{input: {startAdornment: <InputAdornment position="start"><StorefrontRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                    </>
                                )}

                                {/* Crypto Fields */}
                                {newMethod.type === 'crypto' && (
                                    <>
                                        <FormControl size="small" fullWidth>
                                            <Typography sx={{fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 0.5}}>Currency</Typography>
                                            <Select value={newMethod.currency} onChange={(e) => setNewMethod({...newMethod, currency: e.target.value})} displayEmpty>
                                                <MenuItem value="" disabled>Select currency...</MenuItem>
                                                {CRYPTO_CURRENCIES.map(c => (
                                                    <MenuItem key={c.value} value={c.value}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Box sx={{width: 8, height: 8, borderRadius: '50%', bgcolor: c.color}}/>
                                                            <span>{c.label}</span>
                                                        </Stack>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <FormControl size="small" fullWidth>
                                            <Typography sx={{fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', mb: 0.5}}>Network</Typography>
                                            <Select value={newMethod.network} onChange={(e) => setNewMethod({...newMethod, network: e.target.value})} displayEmpty>
                                                <MenuItem value="" disabled>Select network...</MenuItem>
                                                {CRYPTO_NETWORKS.map(n => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                        <TextField size="small" fullWidth label="Wallet Address" placeholder="0x..." value={newMethod.walletAddress}
                                            onChange={(e) => setNewMethod({...newMethod, walletAddress: e.target.value})}
                                            slotProps={{input: {startAdornment: <InputAdornment position="start"><AccountBalanceWalletRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>, sx: {fontFamily: 'monospace', fontSize: '0.85rem'}}}}/>
                                        <TextField size="small" fullWidth label="Account Name (optional)" placeholder="Your name or label" value={newMethod.accountName}
                                            onChange={(e) => setNewMethod({...newMethod, accountName: e.target.value})}/>
                                        <Alert severity="warning" sx={{fontSize: '0.75rem'}}>
                                            Double-check your wallet address. Crypto transactions are irreversible. Only send the selected currency on the correct network.
                                        </Alert>
                                    </>
                                )}

                                {/* Bank Fields */}
                                {newMethod.type === 'bank' && (
                                    <>
                                        <TextField size="small" fullWidth label="Bank Name" placeholder="e.g. GCB Bank" value={newMethod.bankName}
                                            onChange={(e) => setNewMethod({...newMethod, bankName: e.target.value})}
                                            slotProps={{input: {startAdornment: <InputAdornment position="start"><AccountBalanceRounded sx={{fontSize: 18, color: 'text.secondary', opacity: 0.6}}/></InputAdornment>}}}/>
                                        <TextField size="small" fullWidth label="Account Number" value={newMethod.accountNumber}
                                            onChange={(e) => setNewMethod({...newMethod, accountNumber: e.target.value})}/>
                                        <TextField size="small" fullWidth label="Branch / Sort Code" value={newMethod.branchCode}
                                            onChange={(e) => setNewMethod({...newMethod, branchCode: e.target.value})}/>
                                        <TextField size="small" fullWidth label="Account Holder Name" value={newMethod.accountName}
                                            onChange={(e) => setNewMethod({...newMethod, accountName: e.target.value})}/>
                                    </>
                                )}
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{px: 3, pb: 2}}>
                            <Button onClick={() => setDialogOpen(false)} sx={{color: 'text.secondary'}}>Cancel</Button>
                            <Button onClick={handleAddMethod} variant="contained" startIcon={<SaveRounded/>}
                                disabled={!newMethod.type || (newMethod.type === 'mobile_money' && (!newMethod.provider || !newMethod.number)) || (newMethod.type === 'crypto' && (!newMethod.currency || !newMethod.walletAddress)) || (newMethod.type === 'bank' && (!newMethod.bankName || !newMethod.accountNumber))}>
                                Add & Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Stack>
            </Container>
        </Layout>
    );
};

export default PaymentSetupPage;
