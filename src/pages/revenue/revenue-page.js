import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const RevenuePage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Revenue
                </Typography>
            </Container>
        </Layout>
    )
}

export default RevenuePage;