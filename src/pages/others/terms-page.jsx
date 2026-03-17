import {
    Box,
    Card,
    CardContent,
    Container,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import Layout from "../../components/layout/layout";

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: "By accessing and using the Ruderalis Vendor platform, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, you should not use this platform."
    },
    {
        title: "2. Vendor Eligibility",
        content: "To use our platform, you must be a licensed medical marijuana vendor in your state of operation. You agree to provide accurate, current, and complete license information and to maintain the accuracy of such information. We reserve the right to suspend or terminate accounts that fail to maintain valid licenses."
    },
    {
        title: "3. Account Responsibilities",
        content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We are not liable for any loss arising from unauthorized use of your account."
    },
    {
        title: "4. Product Listings",
        content: "All products listed on the platform must comply with applicable state and local cannabis regulations. You are solely responsible for ensuring that your product descriptions, THC/CBD content labels, pricing, and images are accurate and compliant with all applicable laws. Misrepresentation of product information may result in account suspension."
    },
    {
        title: "5. Orders and Payments",
        content: "When a customer places an order, you agree to fulfill it in a timely manner according to the stated delivery or pickup terms. Payment processing is handled through our secure payment system. Funds from completed orders will be available for withdrawal according to our standard settlement schedule."
    },
    {
        title: "6. Fees and Commissions",
        content: "We charge a commission on each completed sale processed through the platform. The current commission rate is disclosed in your vendor agreement. We reserve the right to modify our fee structure with 30 days notice. All fees will be automatically deducted from your sales proceeds."
    },
    {
        title: "7. Refunds and Disputes",
        content: "You agree to our refund policy for customer disputes. In the event of a customer complaint or return, we will work with both parties to reach a fair resolution. Refund amounts may be deducted from your available balance."
    },
    {
        title: "8. Prohibited Activities",
        content: "You agree not to: sell products to minors or non-qualified patients; list products that do not comply with state regulations; engage in price manipulation or deceptive practices; use the platform for any illegal purpose; attempt to circumvent our security measures or payment system."
    },
    {
        title: "9. Intellectual Property",
        content: "The Ruderalis Vendor platform, including its design, features, and content, is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any part of the platform without our express written consent."
    },
    {
        title: "10. Limitation of Liability",
        content: "Ruderalis Vendor shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use or inability to use the platform."
    },
    {
        title: "11. Termination",
        content: "We may terminate or suspend your account at any time, with or without cause, with or without notice. Upon termination, your right to use the platform will immediately cease. Any pending balances will be settled according to our standard procedures, less any applicable fees or deductions."
    },
    {
        title: "12. Changes to Terms",
        content: "We reserve the right to modify these terms at any time. We will provide notice of significant changes via email or through the platform. Your continued use of the platform after changes constitute acceptance of the updated terms."
    },
];

const TermsPage = () => {
    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="md">
                    <Stack spacing={3}>
                        <Typography variant="h4" sx={{color: "text.primary", fontWeight: 700}}>
                            Terms of Service
                        </Typography>
                        <Typography variant="body2" sx={{color: "text.secondary"}}>
                            Last updated: March 2026
                        </Typography>

                        <Card sx={{bgcolor: "background.paper", borderRadius: 4}}>
                            <CardContent sx={{p: 3}}>
                                <Typography variant="body1" sx={{color: "text.secondary", lineHeight: 1.8, mb: 3}}>
                                    Please read these Terms of Service carefully before using the Ruderalis Vendor
                                    platform. These terms govern your use of the platform and constitute a legally
                                    binding agreement between you and Ruderalis Vendor.
                                </Typography>

                                <Divider sx={{mb: 3}}/>

                                <Stack spacing={3}>
                                    {sections.map((section) => (
                                        <Box key={section.title}>
                                            <Typography variant="h6" sx={{color: "text.primary", fontWeight: 600, mb: 1, fontSize: 16}}>
                                                {section.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{color: "text.secondary", lineHeight: 1.8}}>
                                                {section.content}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>

                                <Divider sx={{my: 3}}/>

                                <Typography variant="body2" sx={{color: "text.secondary"}}>
                                    If you have any questions about these Terms of Service, please contact us at
                                    legal@ruderalis.com.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default TermsPage;
