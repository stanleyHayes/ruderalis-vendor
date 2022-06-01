import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const TermsPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Terms
                </Typography>
            </Container>
        </Layout>
    )
}

export default TermsPage;