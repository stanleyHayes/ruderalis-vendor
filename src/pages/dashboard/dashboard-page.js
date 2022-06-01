import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const DashboardPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl" sx={{height: '100%'}}>
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Dashboard
                </Typography>
            </Container>
        </Layout>
    )
}

export default DashboardPage;