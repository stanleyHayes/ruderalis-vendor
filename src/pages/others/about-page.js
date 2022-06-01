import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const AboutPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    About
                </Typography>
            </Container>
        </Layout>
    )
}

export default AboutPage;