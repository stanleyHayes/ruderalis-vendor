import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Divider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    ArrowBack,
    AttachMoneyRounded,
    AccountBalanceRounded,
    PinRounded,
    DescriptionRounded,
} from "@mui/icons-material";
import {InputAdornment} from "@mui/material";
import Layout from "../../components/layout/layout";
import {getTransactions, requestWithdrawal, selectFunds} from "../../redux/features/funds/funds-slice";
import {selectAuth} from "../../redux/features/auth/auth-slice";

const MakePaymentPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {transactions, loading, error} = useSelector(selectFunds);
    const {user} = useSelector(selectAuth);

    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch]);

    const completedSales = transactions.filter(t => t.type === "sale" && t.status === "completed").reduce((sum, t) => sum + t.amount, 0);
    const completedRefunds = transactions.filter(t => t.type === "refund" && t.status === "completed").reduce((sum, t) => sum + t.amount, 0);
    const completedWithdrawals = transactions.filter(t => t.type === "withdrawal" && t.status === "completed").reduce((sum, t) => sum + t.amount, 0);
    const availableBalance = completedSales + completedRefunds + completedWithdrawals;

    const validationSchema = Yup.object().shape({
        amount: Yup.number()
            .required("Amount is required")
            .positive("Amount must be positive")
            .max(availableBalance, `Amount cannot exceed available balance of $${availableBalance.toFixed(2)}`),
        bankName: Yup.string().required("Bank name is required"),
        accountNumber: Yup.string().required("Account number is required"),
        routingNumber: Yup.string().required("Routing number is required"),
        description: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            amount: "",
            bankName: user?.bankInfo?.bankName || "",
            accountNumber: user?.bankInfo?.accountNumber || "",
            routingNumber: user?.bankInfo?.routingNumber || "",
            description: "",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            const result = await dispatch(requestWithdrawal({
                amount: Number(values.amount),
                description: values.description || "Bank withdrawal",
            }));
            if (!result.error) {
                navigate("/funds");
            }
        },
    });

    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="sm">
                    <Stack spacing={3}>
                        <Button
                            startIcon={<ArrowBack/>}
                            onClick={() => navigate("/funds")}
                            sx={{alignSelf: "flex-start", color: "text.secondary"}}
                        >
                            Back to Funds
                        </Button>

                        <Typography variant="h4" sx={{color: "text.primary", fontWeight: 700}}>
                            Request Withdrawal
                        </Typography>

                        {/* Available Balance Card */}
                        <Card sx={{
                            border: 'none',
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
                            color: '#fff',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            <Box sx={{position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)'}}/>
                            <Box sx={{position: 'absolute', bottom: -20, right: 40, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.08)'}}/>
                            <CardContent sx={{p: 3, position: 'relative', zIndex: 1}}>
                                <Typography sx={{fontSize: '0.78rem', opacity: 0.85, fontWeight: 500, mb: 0.5}}>
                                    Available Balance
                                </Typography>
                                <Typography sx={{fontSize: '2rem', fontWeight: 800, lineHeight: 1.1}}>
                                    ${availableBalance.toFixed(2)}
                                </Typography>
                            </CardContent>
                        </Card>

                        {error && (
                            <Alert severity="error">{error}</Alert>
                        )}

                        {/* Withdrawal Form */}
                        <Card>
                            <CardContent sx={{p: 3}}>
                                <Box component="form" onSubmit={formik.handleSubmit}>
                                    <Stack spacing={3}>
                                        <Typography variant="subtitle1" sx={{color: "text.primary", fontWeight: 700}}>
                                            Withdrawal Amount
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="Amount ($)"
                                            name="amount"
                                            type="number"
                                            placeholder="0.00"
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                                            helperText={formik.touched.amount && formik.errors.amount}
                                            slotProps={{input: {startAdornment: (<InputAdornment position="start"><AttachMoneyRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                        />

                                        <Divider/>

                                        <Typography variant="subtitle1" sx={{color: "text.primary", fontWeight: 700}}>
                                            Bank Details
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="Bank Name"
                                            name="bankName"
                                            value={formik.values.bankName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                                            helperText={formik.touched.bankName && formik.errors.bankName}
                                            slotProps={{input: {startAdornment: (<InputAdornment position="start"><AccountBalanceRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Account Number"
                                            name="accountNumber"
                                            value={formik.values.accountNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                                            helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                                            slotProps={{input: {startAdornment: (<InputAdornment position="start"><PinRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Routing Number"
                                            name="routingNumber"
                                            value={formik.values.routingNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.routingNumber && Boolean(formik.errors.routingNumber)}
                                            helperText={formik.touched.routingNumber && formik.errors.routingNumber}
                                            slotProps={{input: {startAdornment: (<InputAdornment position="start"><PinRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                        />

                                        <Divider/>

                                        <TextField
                                            fullWidth
                                            label="Description / Notes"
                                            name="description"
                                            multiline
                                            rows={3}
                                            placeholder="Optional notes for this withdrawal"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            slotProps={{input: {startAdornment: (<InputAdornment position="start"><DescriptionRounded sx={{fontSize: 18, color: 'text.secondary'}}/></InputAdornment>)}}}
                                        />

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            disabled={loading}
                                            sx={{bgcolor: "primary.main", py: 1.5}}
                                        >
                                            {loading ? <CircularProgress size={24} sx={{color: "#fff"}}/> : "Submit Withdrawal Request"}
                                        </Button>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default MakePaymentPage;
