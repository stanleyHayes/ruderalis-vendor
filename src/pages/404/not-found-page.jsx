import {Link, useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
} from "@mui/material";
import {DashboardRounded, SpaRounded} from "@mui/icons-material";
import Layout from "../../components/layout/layout";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh"}}>
                <Container maxWidth="sm">
                    <Stack
                        spacing={3}
                        alignItems="center"
                        justifyContent="center"
                        sx={{minHeight: "100vh", textAlign: "center", py: 4}}
                    >
                        <SpaRounded
                            sx={{
                                fontSize: 80,
                                color: '#10B981',
                                '@keyframes float': {
                                    '0%': {transform: 'translateY(0px) rotate(0deg)'},
                                    '25%': {transform: 'translateY(-8px) rotate(5deg)'},
                                    '50%': {transform: 'translateY(0px) rotate(0deg)'},
                                    '75%': {transform: 'translateY(-4px) rotate(-5deg)'},
                                    '100%': {transform: 'translateY(0px) rotate(0deg)'},
                                },
                                animation: 'float 4s ease-in-out infinite',
                            }}
                        />

                        <Typography
                            variant="h1"
                            sx={{
                                fontWeight: 900,
                                fontSize: {xs: '6rem', sm: '8rem'},
                                lineHeight: 1,
                                background: 'linear-gradient(135deg, #0D6B3F 0%, #10B981 50%, #34D399 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                letterSpacing: '-0.04em',
                            }}
                        >
                            404
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                color: "text.primary",
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Page Not Found
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "text.secondary",
                                maxWidth: 400,
                                lineHeight: 1.7,
                                fontSize: '1.05rem',
                            }}
                        >
                            The page you're looking for has gone up in smoke.
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{pt: 1}}>
                            <Button
                                component={Link}
                                to="/"
                                variant="contained"
                                startIcon={<DashboardRounded/>}
                                size="large"
                                sx={{
                                    background: 'linear-gradient(135deg, #0D6B3F 0%, #10B981 100%)',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    boxShadow: '0 4px 14px rgba(13,107,63,0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0A5832 0%, #059669 100%)',
                                        boxShadow: '0 6px 20px rgba(13,107,63,0.4)',
                                    },
                                }}
                            >
                                Back to Dashboard
                            </Button>
                            <Button
                                onClick={() => navigate(-1)}
                                variant="text"
                                size="large"
                                sx={{
                                    color: 'text.secondary',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    px: 3,
                                    '&:hover': {
                                        color: '#0D6B3F',
                                        backgroundColor: 'rgba(13,107,63,0.06)',
                                    },
                                }}
                            >
                                Go Back
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default NotFoundPage;
