import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
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
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {Visibility, VisibilityOff, LockRounded, PersonRounded, PinRounded, ArrowBackRounded} from "@mui/icons-material";
import {login, verifyOtp, resendOtp, selectAuth, clearError, clearMessage, resetOtpFlow} from "../../redux/features/auth/auth-slice";
import loginBackground from "./../../assets/images/login-background.jpg";
import logo from "./../../assets/images/logo.png";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, error, token, message, otpRequired, tempToken} = useSelector(selectAuth);
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState('');

    useEffect(() => {
        dispatch(clearError());
        dispatch(clearMessage());
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token, navigate]);

    const loginFormik = useFormik({
        initialValues: {
            usernameOrEmailOrPhone: "",
            password: "",
        },
        validationSchema: Yup.object({
            usernameOrEmailOrPhone: Yup.string().required("Email, username, or phone is required"),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: (values) => {
            dispatch(clearError());
            dispatch(login(values));
        },
    });

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        dispatch(clearError());
        dispatch(verifyOtp({token: tempToken, otp}));
    };

    const handleResendOtp = () => {
        dispatch(clearError());
        dispatch(resendOtp({token: tempToken}));
    };

    const handleBackToLogin = () => {
        dispatch(resetOtpFlow());
        dispatch(clearError());
        dispatch(clearMessage());
        setOtp('');
    };

    return (
        <Box sx={{minHeight: "100vh", display: "flex"}}>
            {/* Left side */}
            <Box
                sx={{
                    display: {xs: "none", md: "flex"},
                    flex: 1,
                    backgroundImage: `url(${loginBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, rgba(6,78,59,0.9) 0%, rgba(17,19,21,0.75) 100%)",
                    },
                }}>
                <Box sx={{position: "relative", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center", px: 6}}>
                    <Typography variant="h3" sx={{color: "#fff", fontWeight: 800, mb: 2, letterSpacing: '-0.02em'}}>
                        Welcome Back
                    </Typography>
                    <Typography variant="h6" sx={{color: "rgba(255,255,255,0.75)", fontWeight: 400, maxWidth: 420, lineHeight: 1.6}}>
                        Manage your cannabis vendor operations with the industry's most trusted platform.
                    </Typography>
                </Box>
            </Box>

            {/* Right side */}
            <Box
                sx={{
                    flex: {xs: 1, md: "0 0 520px"},
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.default",
                    px: {xs: 2, sm: 4},
                    py: 4,
                }}>
                <Container maxWidth="sm">
                    <Card sx={{p: {xs: 3, sm: 4}, border: 'none'}}>
                        <CardContent sx={{p: 0, "&:last-child": {pb: 0}}}>
                            <Stack spacing={3} alignItems="center">
                                {/* Logo */}
                                <Box component="img" src={logo} alt="Ruderalis" sx={{height: 48, mb: 1}}/>

                                {/* OTP Step */}
                                {otpRequired ? (
                                    <>
                                        <Box sx={{textAlign: "center"}}>
                                            <Typography variant="h5" sx={{color: "text.primary", fontWeight: 800, mb: 0.5}}>
                                                Verify OTP
                                            </Typography>
                                            <Typography variant="body2" sx={{color: "text.secondary"}}>
                                                We sent a verification code to your email. Enter it below.
                                            </Typography>
                                        </Box>

                                        {error && (
                                            <Alert severity="error" sx={{width: "100%"}} onClose={() => dispatch(clearError())}>{error}</Alert>
                                        )}
                                        {message && (
                                            <Alert severity="info" sx={{width: "100%"}} onClose={() => dispatch(clearMessage())}>{message}</Alert>
                                        )}

                                        <Box component="form" onSubmit={handleOtpSubmit} sx={{width: "100%"}}>
                                            <Stack spacing={2.5}>
                                                <TextField
                                                    fullWidth
                                                    label="OTP Code"
                                                    placeholder="Enter 6-digit code"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    size="medium"
                                                    autoFocus
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PinRounded sx={{fontSize: 20, color: 'text.secondary'}}/>
                                                                </InputAdornment>
                                                            ),
                                                            sx: {letterSpacing: '0.3em', fontWeight: 700, fontSize: '1.1rem'}
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    disabled={loading || otp.length < 4}
                                                    sx={{py: 1.5, fontWeight: 700, fontSize: "0.95rem"}}>
                                                    {loading ? <CircularProgress size={24} sx={{color: "#fff"}}/> : "Verify & Sign In"}
                                                </Button>

                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Button
                                                        onClick={handleBackToLogin}
                                                        startIcon={<ArrowBackRounded sx={{fontSize: 16}}/>}
                                                        sx={{color: 'text.secondary', fontSize: '0.82rem'}}>
                                                        Back
                                                    </Button>
                                                    <Button
                                                        onClick={handleResendOtp}
                                                        disabled={loading}
                                                        sx={{color: 'secondary.main', fontSize: '0.82rem', fontWeight: 600}}>
                                                        Resend Code
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </>
                                ) : (
                                    <>
                                        {/* Login Step */}
                                        <Box sx={{textAlign: "center"}}>
                                            <Typography variant="h5" sx={{color: "text.primary", fontWeight: 800, mb: 0.5}}>
                                                Sign In
                                            </Typography>
                                            <Typography variant="body2" sx={{color: "text.secondary"}}>
                                                Enter your credentials to access your dashboard
                                            </Typography>
                                        </Box>

                                        {error && (
                                            <Alert severity="error" sx={{width: "100%"}} onClose={() => dispatch(clearError())}>{error}</Alert>
                                        )}

                                        <Box component="form" onSubmit={loginFormik.handleSubmit} sx={{width: "100%"}}>
                                            <Stack spacing={2.5}>
                                                <TextField
                                                    fullWidth
                                                    label="Email, Username, or Phone"
                                                    name="usernameOrEmailOrPhone"
                                                    placeholder="you@company.com"
                                                    value={loginFormik.values.usernameOrEmailOrPhone}
                                                    onChange={loginFormik.handleChange}
                                                    onBlur={loginFormik.handleBlur}
                                                    error={loginFormik.touched.usernameOrEmailOrPhone && Boolean(loginFormik.errors.usernameOrEmailOrPhone)}
                                                    helperText={loginFormik.touched.usernameOrEmailOrPhone && loginFormik.errors.usernameOrEmailOrPhone}
                                                    size="medium"
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PersonRounded sx={{fontSize: 20, color: 'text.secondary'}}/>
                                                                </InputAdornment>
                                                            )
                                                        }
                                                    }}
                                                />
                                                <TextField
                                                    fullWidth
                                                    label="Password"
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    value={loginFormik.values.password}
                                                    onChange={loginFormik.handleChange}
                                                    onBlur={loginFormik.handleBlur}
                                                    error={loginFormik.touched.password && Boolean(loginFormik.errors.password)}
                                                    helperText={loginFormik.touched.password && loginFormik.errors.password}
                                                    size="medium"
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <LockRounded sx={{fontSize: 20, color: 'text.secondary'}}/>
                                                                </InputAdornment>
                                                            ),
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                                        {showPassword ? <VisibilityOff sx={{fontSize: 20}}/> : <Visibility sx={{fontSize: 20}}/>}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        },
                                                    }}
                                                />

                                                <Stack direction="row" justifyContent="flex-end">
                                                    <Typography
                                                        component={Link}
                                                        to="/auth/forgot-password"
                                                        variant="body2"
                                                        sx={{color: "secondary.main", textDecoration: "none", fontWeight: 600, fontSize: '0.82rem', "&:hover": {textDecoration: "underline"}}}>
                                                        Forgot password?
                                                    </Typography>
                                                </Stack>

                                                <Button
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    disabled={loading}
                                                    sx={{py: 1.5, fontWeight: 700, fontSize: "0.95rem"}}>
                                                    {loading ? <CircularProgress size={24} sx={{color: "#fff"}}/> : "Sign In"}
                                                </Button>
                                            </Stack>
                                        </Box>

                                        <Typography variant="body2" sx={{color: "text.secondary"}}>
                                            Don't have an account?{" "}
                                            <Typography
                                                component={Link}
                                                to="/auth/register"
                                                variant="body2"
                                                sx={{color: "secondary.main", textDecoration: "none", fontWeight: 700, "&:hover": {textDecoration: "underline"}}}>
                                                Create Account
                                            </Typography>
                                        </Typography>
                                    </>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Box>
    );
};

export default LoginPage;
