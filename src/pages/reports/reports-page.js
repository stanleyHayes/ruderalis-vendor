import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const ReportsPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Reports
                </Typography>
            </Container>
        </Layout>
    )
}

export default ReportsPage;