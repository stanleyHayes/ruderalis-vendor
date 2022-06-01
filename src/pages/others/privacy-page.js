import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const PrivacyPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Privacy
                </Typography>
            </Container>
        </Layout>
    )
}

export default PrivacyPage;