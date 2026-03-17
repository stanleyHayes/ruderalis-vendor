import {
    Box,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import {Email, Gavel, Phone, Security} from "@mui/icons-material";
import Layout from "../../components/layout/layout";

const AboutPage = () => {
    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="md">
                    <Stack spacing={3}>
                        <Typography variant="h4" sx={{color: "text.primary", fontWeight: 700}}>
                            About Ruderalis Vendor
                        </Typography>

                        {/* Mission Statement */}
                        <Card sx={{bgcolor: "background.paper", borderRadius: 4}}>
                            <CardContent sx={{p: 3}}>
                                <Typography variant="h6" sx={{color: "text.primary", fontWeight: 600, mb: 2}}>
                                    Our Mission
                                </Typography>
                                <Divider sx={{mb: 2}}/>
                                <Typography variant="body1" sx={{color: "text.secondary", lineHeight: 1.8}}>
                                    Ruderalis Vendor is dedicated to empowering medical marijuana vendors with
                                    a comprehensive, compliant, and easy-to-use platform for managing their dispensary
                                    operations. We believe in providing a transparent, secure, and efficient marketplace
                                    that connects licensed vendors with patients who depend on medical cannabis for their
                                    health and well-being.
                                </Typography>
                                <Typography variant="body1" sx={{color: "text.secondary", lineHeight: 1.8, mt: 2}}>
                                    Our platform streamlines inventory management, order processing, customer relationships,
                                    and financial reporting, so vendors can focus on what matters most: providing
                                    high-quality medical cannabis products to those in need.
                                </Typography>
                            </CardContent>
                        </Card>

                        {/* Key Features */}
                        <Grid container spacing={3}>
                            {[
                                {icon: <Security sx={{color: "secondary.main", fontSize: 32}}/>, title: "Compliance First", desc: "Built with state and federal regulations in mind, ensuring your operations stay compliant at all times."},
                                {icon: <Gavel sx={{color: "secondary.main", fontSize: 32}}/>, title: "Licensed Vendors Only", desc: "We verify all vendor licenses to maintain the integrity and trust of our marketplace."},
                            ].map((feature) => (
                                <Grid size={{xs: 12, sm: 6}} key={feature.title}>
                                    <Card sx={{bgcolor: "background.paper", borderRadius: 4, height: "100%"}}>
                                        <CardContent sx={{p: 3}}>
                                            <Box sx={{bgcolor: "light.secondary", borderRadius: 3, p: 1.5, display: "inline-flex", mb: 2}}>
                                                {feature.icon}
                                            </Box>
                                            <Typography variant="subtitle1" sx={{color: "text.primary", fontWeight: 600, mb: 1}}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{color: "text.secondary"}}>
                                                {feature.desc}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Version & Contact */}
                        <Card sx={{bgcolor: "background.paper", borderRadius: 4}}>
                            <CardContent sx={{p: 3}}>
                                <Typography variant="h6" sx={{color: "text.primary", fontWeight: 600, mb: 2}}>
                                    Platform Information
                                </Typography>
                                <Divider sx={{mb: 2}}/>
                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" sx={{color: "text.secondary"}}>Version</Typography>
                                        <Typography variant="body2" sx={{color: "text.primary", fontWeight: 500}}>1.0.0</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" sx={{color: "text.secondary"}}>Platform</Typography>
                                        <Typography variant="body2" sx={{color: "text.primary", fontWeight: 500}}>Ruderalis Vendor Dashboard</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" sx={{color: "text.secondary"}}>Last Updated</Typography>
                                        <Typography variant="body2" sx={{color: "text.primary", fontWeight: 500}}>March 2026</Typography>
                                    </Stack>

                                    <Divider/>

                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        <Email sx={{color: "text.secondary", fontSize: 18}}/>
                                        <Typography variant="body2" sx={{color: "text.primary"}}>
                                            support@ruderalis.com
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        <Phone sx={{color: "text.secondary", fontSize: 18}}/>
                                        <Typography variant="body2" sx={{color: "text.primary"}}>
                                            +1-800-RUD-VENDOR
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default AboutPage;
