import {useState} from "react";
import {Link} from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import {MarkEmailReadOutlined} from "@mui/icons-material";
import logo from "./../../assets/images/logo.png";

const AccountVerificationPage = () => {
    const [loading, setLoading] = useState(false);
    const [resent, setResent] = useState(false);

    const handleResend = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        setResent(true);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#141416",
                px: 2,
                py: 4,
            }}
        >
            <Container maxWidth="sm">
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
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    bgcolor: "rgba(40,80,40,0.3)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MarkEmailReadOutlined sx={{fontSize: 40, color: "#73b56f"}}/>
                            </Box>

                            <Box sx={{textAlign: "center"}}>
                                <Typography variant="h4" sx={{color: "#fff", fontWeight: 700, mb: 1}}>
                                    Check Your Email
                                </Typography>
                                <Typography variant="body1" sx={{color: "rgba(255,255,255,0.6)", maxWidth: 400, mx: "auto", lineHeight: 1.7}}>
                                    We've sent a verification link to your email address. Please click the link to verify your account and complete your registration.
                                </Typography>
                            </Box>

                            {/* Info box */}
                            <Box
                                sx={{
                                    width: "100%",
                                    bgcolor: "rgba(40,80,40,0.15)",
                                    border: "1px solid rgba(115,181,111,0.2)",
                                    borderRadius: 2,
                                    p: 2.5,
                                }}
                            >
                                <Typography variant="body2" sx={{color: "rgba(255,255,255,0.7)", textAlign: "center"}}>
                                    Didn't receive the email? Check your spam folder or click the button below to resend.
                                </Typography>
                            </Box>

                            {/* Resent alert */}
                            {resent && (
                                <Alert severity="success" sx={{width: "100%"}}>
                                    Verification email has been resent successfully.
                                </Alert>
                            )}

                            {/* Resend button */}
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                onClick={handleResend}
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
                                {loading ? <CircularProgress size={24} sx={{color: "#73b56f"}}/> : "Resend Verification Email"}
                            </Button>

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
                                Back to Sign In
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default AccountVerificationPage;
