import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useSearchParams} from "react-router-dom";
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
    LinearProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {LockOutlined, Visibility, VisibilityOff} from "@mui/icons-material";
import {resetPassword, selectAuth, clearError, clearMessage} from "../../redux/features/auth/auth-slice";
import resetPasswordBackground from "./../../assets/images/reset-password-background.jpg";
import logo from "./../../assets/images/logo.png";

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Must contain at least one uppercase letter")
        .matches(/[0-9]/, "Must contain at least one number")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
});

const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return {score: 0, label: "", color: "transparent"};
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) return {score: 20, label: "Weak", color: "#f44336"};
    if (score <= 3) return {score: 40, label: "Fair", color: "#ff9800"};
    if (score <= 4) return {score: 60, label: "Good", color: "#ffeb3b"};
    if (score <= 5) return {score: 80, label: "Strong", color: "#73b56f"};
    return {score: 100, label: "Very Strong", color: "#285028"};
};

const ResetPasswordPage = () => {
    const dispatch = useDispatch();
    const {loading, error, message} = useSelector(selectAuth);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        dispatch(clearError());
        dispatch(clearMessage());
    }, [dispatch]);

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: (values) => {
            dispatch(resetPassword({token, password: values.password}));
        },
    });

    const passwordStrength = useMemo(
        () => getPasswordStrength(formik.values.password),
        [formik.values.password]
    );

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(${resetPasswordBackground})`,
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
                                <LockOutlined sx={{fontSize: 32, color: "#73b56f"}}/>
                            </Box>

                            <Box sx={{textAlign: "center"}}>
                                <Typography variant="h4" sx={{color: "#fff", fontWeight: 700, mb: 1}}>
                                    Reset Password
                                </Typography>
                                <Typography variant="body2" sx={{color: "rgba(255,255,255,0.5)", maxWidth: 360, mx: "auto"}}>
                                    Enter your new password below. Make sure it's strong and secure.
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
                                <Alert severity="success" sx={{width: "100%"}}>
                                    {message}{" "}
                                    <Typography
                                        component={Link}
                                        to="/auth/login"
                                        variant="body2"
                                        sx={{color: "#285028", fontWeight: 600, textDecoration: "none", "&:hover": {textDecoration: "underline"}}}
                                    >
                                        Sign in now
                                    </Typography>
                                </Alert>
                            )}

                            {/* Form */}
                            {!message && (
                                <Box component="form" onSubmit={formik.handleSubmit} sx={{width: "100%"}}>
                                    <Stack spacing={2.5}>
                                        <Box>
                                            <TextField
                                                fullWidth
                                                label="New Password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Min. 8 characters"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.password && Boolean(formik.errors.password)}
                                                helperText={formik.touched.password && formik.errors.password}
                                                size="medium"
                                                slotProps={{
                                                    input: {
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                    edge="end"
                                                                    sx={{color: "rgba(255,255,255,0.5)"}}
                                                                >
                                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                            />
                                            {/* Password strength indicator */}
                                            {formik.values.password && (
                                                <Box sx={{mt: 1.5}}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={passwordStrength.score}
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 3,
                                                            bgcolor: "rgba(255,255,255,0.1)",
                                                            "& .MuiLinearProgress-bar": {
                                                                borderRadius: 3,
                                                                bgcolor: passwordStrength.color,
                                                            },
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: passwordStrength.color,
                                                            mt: 0.5,
                                                            display: "block",
                                                            textAlign: "right",
                                                        }}
                                                    >
                                                        {passwordStrength.label}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        <TextField
                                            fullWidth
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter your new password"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                                            size="medium"
                                            slotProps={{
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                edge="end"
                                                                sx={{color: "rgba(255,255,255,0.5)"}}
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
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
                                            {loading ? <CircularProgress size={24} sx={{color: "#73b56f"}}/> : "Reset Password"}
                                        </Button>
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default ResetPasswordPage;
