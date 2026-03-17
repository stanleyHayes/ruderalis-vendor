import {Link, useNavigate} from "react-router-dom";
import {Box, Button, Container, Stack, Typography} from "@mui/material";
import {HomeRounded, ArrowBackRounded, SpaRounded, SearchRounded} from "@mui/icons-material";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background decorative elements */}
            <Box sx={{position: 'absolute', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)'}}/>
            <Box sx={{position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)'}}/>
            <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', border: '1px solid', borderColor: 'divider', opacity: 0.3}}/>
            <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, borderRadius: '50%', border: '1px dashed', borderColor: 'divider', opacity: 0.2}}/>

            <Container maxWidth="sm" sx={{position: 'relative', zIndex: 1}}>
                <Stack spacing={4} alignItems="center" sx={{textAlign: 'center'}}>
                    {/* Animated leaf with glow */}
                    <Box sx={{position: 'relative'}}>
                        <Box sx={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: 120, height: 120, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
                            animation: 'pulse 3s ease-in-out infinite',
                            '@keyframes pulse': {
                                '0%, 100%': {transform: 'translate(-50%, -50%) scale(1)', opacity: 0.5},
                                '50%': {transform: 'translate(-50%, -50%) scale(1.3)', opacity: 0.8},
                            },
                        }}/>
                        <SpaRounded sx={{
                            fontSize: 64, color: '#22C55E',
                            filter: 'drop-shadow(0 4px 12px rgba(34,197,94,0.3))',
                            animation: 'float 4s ease-in-out infinite',
                            '@keyframes float': {
                                '0%, 100%': {transform: 'translateY(0) rotate(0deg)'},
                                '25%': {transform: 'translateY(-10px) rotate(8deg)'},
                                '75%': {transform: 'translateY(-5px) rotate(-5deg)'},
                            },
                        }}/>
                    </Box>

                    {/* 404 number */}
                    <Typography sx={{
                        fontWeight: 900,
                        fontSize: {xs: '7rem', sm: '9rem'},
                        lineHeight: 0.9,
                        background: 'linear-gradient(135deg, #14532D 0%, #166534 30%, #22C55E 60%, #4ADE80 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.06em',
                        textShadow: 'none',
                    }}>
                        404
                    </Typography>

                    {/* Message */}
                    <Stack spacing={1.5} alignItems="center">
                        <Typography variant="h4" sx={{fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em'}}>
                            Page not found
                        </Typography>
                        <Typography sx={{color: 'text.secondary', fontSize: '1rem', maxWidth: 380, lineHeight: 1.7}}>
                            Looks like this page has gone up in smoke. The page you're looking for doesn't exist or has been moved.
                        </Typography>
                    </Stack>

                    {/* Actions */}
                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={1.5} sx={{pt: 1, width: {xs: '100%', sm: 'auto'}}}>
                        <Button
                            component={Link} to="/"
                            variant="contained" size="large"
                            startIcon={<HomeRounded/>}
                            sx={{
                                background: 'linear-gradient(135deg, #14532D 0%, #22C55E 100%)',
                                px: 4, py: 1.5, fontWeight: 700, fontSize: '0.92rem',
                                boxShadow: '0 4px 16px rgba(22,101,52,0.25)',
                                '&:hover': {boxShadow: '0 6px 24px rgba(22,101,52,0.35)', background: 'linear-gradient(135deg, #14532D 0%, #16A34A 100%)'},
                            }}>
                            Go to Dashboard
                        </Button>
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outlined" size="large"
                            startIcon={<ArrowBackRounded/>}
                            sx={{
                                px: 3, py: 1.5, fontWeight: 600, fontSize: '0.92rem',
                                borderColor: 'divider', color: 'text.primary',
                                '&:hover': {borderColor: 'secondary.main', bgcolor: 'light.secondary'},
                            }}>
                            Go Back
                        </Button>
                    </Stack>

                    {/* Helpful links */}
                    <Box sx={{pt: 2, borderTop: '1px solid', borderColor: 'divider', width: '100%'}}>
                        <Typography sx={{fontSize: '0.78rem', color: 'text.secondary', mb: 1.5, fontWeight: 500}}>
                            Helpful links
                        </Typography>
                        <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" useFlexGap>
                            {[
                                {label: 'Dashboard', path: '/'},
                                {label: 'Products', path: '/products'},
                                {label: 'Orders', path: '/orders'},
                                {label: 'Shops', path: '/shops'},
                                {label: 'Settings', path: '/settings'},
                            ].map(link => (
                                <Typography
                                    key={link.path}
                                    component={Link} to={link.path}
                                    sx={{
                                        fontSize: '0.82rem', color: 'secondary.main', textDecoration: 'none', fontWeight: 600,
                                        '&:hover': {textDecoration: 'underline'},
                                    }}>
                                    {link.label}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default NotFoundPage;
