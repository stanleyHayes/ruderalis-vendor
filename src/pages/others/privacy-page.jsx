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
        title: "1. Information We Collect",
        content: "We collect information you provide directly to us, including your name, email address, phone number, business license information, banking details, and any other information you choose to provide. We also collect information automatically when you use our platform, including log data, device information, and usage analytics."
    },
    {
        title: "2. How We Use Your Information",
        content: "We use the information we collect to provide, maintain, and improve our services; process transactions and send related information; send you technical notices, updates, security alerts, and administrative messages; respond to your comments, questions, and customer service requests; and monitor and analyze trends, usage, and activities in connection with our services."
    },
    {
        title: "3. Information Sharing",
        content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as described in this policy. We may share information with trusted third parties who assist us in operating our platform, conducting our business, or serving our users, so long as those parties agree to keep this information confidential."
    },
    {
        title: "4. Data Security",
        content: "We implement a variety of security measures to maintain the safety of your personal information. All sensitive information, including banking details and medical license data, is encrypted using industry-standard SSL technology. Access to personal data is restricted to authorized personnel only."
    },
    {
        title: "5. HIPAA Compliance",
        content: "As a medical marijuana vendor platform, we are committed to protecting the privacy of health-related information. We comply with applicable HIPAA regulations and state-specific medical marijuana privacy laws. Patient information connected to orders is handled with the highest level of confidentiality."
    },
    {
        title: "6. Data Retention",
        content: "We retain your personal information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements, including maintaining records as required by cannabis regulatory agencies."
    },
    {
        title: "7. Your Rights",
        content: "You have the right to access, update, or delete your personal information at any time through your account settings. You may also opt out of certain communications. If you wish to have your account and data permanently deleted, please contact our support team."
    },
    {
        title: "8. Changes to This Policy",
        content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the effective date. You are advised to review this policy periodically for any changes."
    },
];

const PrivacyPage = () => {
    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="md">
                    <Stack spacing={3}>
                        <Typography variant="h4" sx={{color: "text.primary", fontWeight: 700}}>
                            Privacy Policy
                        </Typography>
                        <Typography variant="body2" sx={{color: "text.secondary"}}>
                            Last updated: March 2026
                        </Typography>

                        <Card sx={{bgcolor: "background.paper", borderRadius: 4}}>
                            <CardContent sx={{p: 3}}>
                                <Typography variant="body1" sx={{color: "text.secondary", lineHeight: 1.8, mb: 3}}>
                                    Ruderalis Vendor ("we", "our", or "us") is committed to protecting your privacy.
                                    This Privacy Policy explains how we collect, use, disclose, and safeguard your
                                    information when you use our vendor dashboard platform.
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
                                    If you have any questions about this Privacy Policy, please contact us at
                                    privacy@ruderalis.com.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default PrivacyPage;
