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
    Checkbox,
    CircularProgress,
    Container,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {register, selectAuth, clearError, clearMessage} from "../../redux/features/auth/auth-slice";
import registerBackground from "./../../assets/images/register-background-man.jpg";
import logo from "./../../assets/images/logo.png";

const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(2, "At least 2 characters").required("First name is required"),
    lastName: Yup.string().min(2, "At least 2 characters").required("Last name is required"),
    username: Yup.string().min(3, "At least 3 characters").required("Username is required"),
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    phone: Yup.string().min(10, "At least 10 digits").required("Phone number is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Must contain a lowercase letter")
        .matches(/[A-Z]/, "Must contain an uppercase letter")
        .matches(/[0-9]/, "Must contain a number")
        .required("Password is required"),
    pin: Yup.string().min(4, "PIN must be at least 4 digits").max(6, "PIN max 6 digits").required("PIN is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the terms"),
});

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, error, message} = useSelector(selectAuth);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        dispatch(clearError());
        dispatch(clearMessage());
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            navigate("/auth/login");
        }
    }, [message, navigate]);

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            phone: "",
            password: "",
            pin: "",
            confirmPassword: "",
            agreeToTerms: false,
        },
        validationSchema,
        onSubmit: (values) => {
            dispatch(register({
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username,
                email: values.email,
                phone: values.phone,
                password: values.password,
                pin: values.pin,
            }));
        },
    });

    return (
        <Box sx={{minHeight: "100vh", display: "flex"}}>
            {/* Left side - Background image */}
            <Box
                sx={{
                    display: {xs: "none", md: "flex"},
                    flex: 1,
                    backgroundImage: `url(${registerBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, rgba(40,80,40,0.85) 0%, rgba(20,20,22,0.7) 100%)",
                    },
                }}
            >
                <Box sx={{position: "relative", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "center", px: 6}}>
                    <Typography variant="h3" sx={{color: "#fff", fontWeight: 700, mb: 2}}>
                        Join Ruderalis
                    </Typography>
                    <Typography variant="h6" sx={{color: "rgba(255,255,255,0.8)", fontWeight: 400, maxWidth: 420}}>
                        Register your cannabis business and start managing your operations on the most trusted vendor platform.
                    </Typography>
                </Box>
            </Box>

            {/* Right side - Register form */}
            <Box
                sx={{
                    flex: {xs: 1, md: "0 0 560px"},
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#141416",
                    px: {xs: 2, sm: 4},
                    py: 4,
                    overflowY: "auto",
                }}
            >
                <Container maxWidth="sm">
                    <Card
                        elevation={0}
                        sx={{
                            bgcolor: "#24252e",
                            borderRadius: 4,
                            p: {xs: 3, sm: 4},
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

                                <Box sx={{textAlign: "center"}}>
                                    <Typography variant="h4" sx={{color: "#fff", fontWeight: 700, mb: 0.5}}>
                                        Create Account
                                    </Typography>
                                    <Typography variant="body2" sx={{color: "rgba(255,255,255,0.5)"}}>
                                        Register your vendor account to get started
                                    </Typography>
                                </Box>

                                {/* Error alert */}
                                {error && (
                                    <Alert severity="error" sx={{width: "100%"}} onClose={() => dispatch(clearError())}>
                                        {error}
                                    </Alert>
                                )}

                                {/* Form */}
                                <Box component="form" onSubmit={formik.handleSubmit} sx={{width: "100%"}}>
                                    <Stack spacing={2.5}>
                                        <Stack direction="row" spacing={2}>
                                            <TextField fullWidth label="First Name" name="firstName" placeholder="John"
                                                value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                                helperText={formik.touched.firstName && formik.errors.firstName} size="medium"/>
                                            <TextField fullWidth label="Last Name" name="lastName" placeholder="Doe"
                                                value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                                helperText={formik.touched.lastName && formik.errors.lastName} size="medium"/>
                                        </Stack>
                                        <TextField fullWidth label="Username" name="username" placeholder="johndoe"
                                            value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                            error={formik.touched.username && Boolean(formik.errors.username)}
                                            helperText={formik.touched.username && formik.errors.username} size="medium"/>
                                        <TextField fullWidth label="Email Address" name="email" type="email" placeholder="you@company.com"
                                            value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                            error={formik.touched.email && Boolean(formik.errors.email)}
                                            helperText={formik.touched.email && formik.errors.email} size="medium"/>
                                        <TextField fullWidth label="Phone Number" name="phone" type="tel" placeholder="+233 55 123 4567"
                                            value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                                            helperText={formik.touched.phone && formik.errors.phone} size="medium"/>
                                        <TextField fullWidth label="PIN" name="pin" type="password" placeholder="4-6 digit PIN"
                                            value={formik.values.pin} onChange={formik.handleChange} onBlur={formik.handleBlur}
                                            error={formik.touched.pin && Boolean(formik.errors.pin)}
                                            helperText={formik.touched.pin && formik.errors.pin} size="medium"
                                            slotProps={{input: {sx: {letterSpacing: '0.2em'}}}}/>
                                        <TextField
                                            fullWidth
                                            label="Password"
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
                                        <TextField
                                            fullWidth
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter your password"
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

                                        <Box>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        name="agreeToTerms"
                                                        checked={formik.values.agreeToTerms}
                                                        onChange={formik.handleChange}
                                                        sx={{
                                                            color: "rgba(255,255,255,0.3)",
                                                            "&.Mui-checked": {color: "#73b56f"},
                                                        }}
                                                        size="small"
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2" sx={{color: "rgba(255,255,255,0.7)"}}>
                                                        I agree to the{" "}
                                                        <Typography
                                                            component={Link}
                                                            to="/terms"
                                                            variant="body2"
                                                            sx={{color: "#73b56f", textDecoration: "none", "&:hover": {textDecoration: "underline"}}}
                                                        >
                                                            Terms of Service
                                                        </Typography>
                                                        {" "}and{" "}
                                                        <Typography
                                                            component={Link}
                                                            to="/privacy"
                                                            variant="body2"
                                                            sx={{color: "#73b56f", textDecoration: "none", "&:hover": {textDecoration: "underline"}}}
                                                        >
                                                            Privacy Policy
                                                        </Typography>
                                                    </Typography>
                                                }
                                            />
                                            {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                                                <FormHelperText error sx={{ml: 2}}>
                                                    {formik.errors.agreeToTerms}
                                                </FormHelperText>
                                            )}
                                        </Box>

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
                                            {loading ? <CircularProgress size={24} sx={{color: "#73b56f"}}/> : "Create Account"}
                                        </Button>
                                    </Stack>
                                </Box>

                                <Typography variant="body2" sx={{color: "rgba(255,255,255,0.5)"}}>
                                    Already have an account?{" "}
                                    <Typography
                                        component={Link}
                                        to="/auth/login"
                                        variant="body2"
                                        sx={{
                                            color: "#73b56f",
                                            textDecoration: "none",
                                            fontWeight: 600,
                                            "&:hover": {textDecoration: "underline"},
                                        }}
                                    >
                                        Sign In
                                    </Typography>
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </Box>
    );
};

export default RegisterPage;
