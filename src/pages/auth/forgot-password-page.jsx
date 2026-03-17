import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
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
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {KeyboardArrowLeft, LockResetOutlined} from "@mui/icons-material";
import {forgotPassword, selectAuth, clearError, clearMessage} from "../../redux/features/auth/auth-slice";
import forgotPasswordBackground from "./../../assets/images/forgot-password-background.jpg";
import logo from "./../../assets/images/logo.png";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
});

const ForgotPasswordPage = () => {
    const dispatch = useDispatch();
    const {loading, error, message} = useSelector(selectAuth);

    useEffect(() => {
        dispatch(clearError());
        dispatch(clearMessage());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema,
        onSubmit: (values) => {
            dispatch(forgotPassword({email: values.email}));
        },
    });

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(${forgotPasswordBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                px: 2,
                py: 4,
                "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(20,20,22,0.92) 0%, rgba(40,80,40,0.85) 100%)",
                },
            }}
        >
            <Container maxWidth="sm" sx={{position: "relative", zIndex: 1}}>
                <Card
                    elevation={0}
                    sx={{
                        bgcolor: "#24252e",
                        borderRadius: 4,
                        p: {xs: 3, sm: 5},
                    }}
                >
                    <CardContent sx={{p: 0, "&:last-child": {pb: 0}}}>
                        <Stack spacing={3} alignItems="center">
                            {/* Logo */}
                            <Box
                                component="img"
                                src={logo}
                                alt="Ruderalis Vendor"
                                sx={{height: 56, mb: 1}}
                            />

                            {/* Icon */}
                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: "50%",
                                    bgcolor: "rgba(40,80,40,0.3)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <LockResetOutlined sx={{fontSize: 32, color: "#73b56f"}}/>
                            </Box>

                            <Box sx={{textAlign: "center"}}>
                                <Typography variant="h4" sx={{color: "#fff", fontWeight: 700, mb: 1}}>
                                    Forgot Password?
                                </Typography>
                                <Typography variant="body2" sx={{color: "rgba(255,255,255,0.5)", maxWidth: 360, mx: "auto"}}>
                                    No worries. Enter the email address associated with your account and we'll send you a link to reset your password.
                                </Typography>
                            </Box>

                            {/* Error alert */}
                            {error && (
                                <Alert severity="error" sx={{width: "100%"}} onClose={() => dispatch(clearError())}>
                                    {error}
                                </Alert>
                            )}

                            {/* Success message */}
                            {message && (
                                <Alert severity="success" sx={{width: "100%"}} onClose={() => dispatch(clearMessage())}>
                                    {message}
                                </Alert>
                            )}

                            {/* Form */}
                            <Box component="form" onSubmit={formik.handleSubmit} sx={{width: "100%"}}>
                                <Stack spacing={2.5}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        placeholder="you@company.com"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                        size="medium"
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        sx={{
                                            bgcolor: "#285028",
                                            color: "#fff",
                                            py: 1.5,
                                            fontWeight: 600,
                                            fontSize: "1rem",
                                            textTransform: "none",
                                            borderRadius: 2,
                                            "&:hover": {bgcolor: "#1e3e1e"},
                                            "&.Mui-disabled": {bgcolor: "rgba(40,80,40,0.5)", color: "rgba(255,255,255,0.5)"},
                                        }}
                                    >
                                        {loading ? <CircularProgress size={24} sx={{color: "#73b56f"}}/> : "Send Reset Link"}
                                    </Button>
                                </Stack>
                            </Box>

                            <Typography
                                component={Link}
                                to="/auth/login"
                                variant="body2"
                                sx={{
                                    color: "#73b56f",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    "&:hover": {textDecoration: "underline"},
                                }}
                            >
                                <KeyboardArrowLeft fontSize="small"/>
                                Back to Sign In
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ForgotPasswordPage;
