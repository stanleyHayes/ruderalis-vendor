import {Link} from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import {CheckCircleOutline} from "@mui/icons-material";
import logo from "./../../assets/images/logo.png";

const VerificationAcknowledgmentPage = () => {
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

                            {/* Success icon */}
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
                                <CheckCircleOutline sx={{fontSize: 48, color: "#73b56f"}}/>
                            </Box>

                            <Box sx={{textAlign: "center"}}>
                                <Typography variant="h4" sx={{color: "#fff", fontWeight: 700, mb: 1}}>
                                    Account Verified
                                </Typography>
                                <Typography variant="body1" sx={{color: "rgba(255,255,255,0.6)", maxWidth: 400, mx: "auto", lineHeight: 1.7}}>
                                    Your email has been successfully verified and your account is now active.
                                    You can proceed to sign in and start managing your vendor dashboard.
                                </Typography>
                            </Box>

                            {/* Success details box */}
                            <Box
                                sx={{
                                    width: "100%",
                                    bgcolor: "rgba(40,80,40,0.15)",
                                    border: "1px solid rgba(115,181,111,0.2)",
                                    borderRadius: 2,
                                    p: 2.5,
                                    textAlign: "center",
                                }}
                            >
                                <Typography variant="body2" sx={{color: "#73b56f", fontWeight: 600, mb: 0.5}}>
                                    What's next?
                                </Typography>
                                <Typography variant="body2" sx={{color: "rgba(255,255,255,0.6)"}}>
                                    Sign in to set up your shop profile, add products, and start receiving orders.
                                </Typography>
                            </Box>

                            {/* Proceed to login button */}
                            <Button
                                component={Link}
                                to="/auth/login"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: "#285028",
                                    color: "#fff",
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    textTransform: "none",
                                    borderRadius: 2,
                                    "&:hover": {bgcolor: "#1e3e1e"},
                                }}
                            >
                                Proceed to Sign In
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default VerificationAcknowledgmentPage;
