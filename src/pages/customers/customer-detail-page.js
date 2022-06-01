import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const CustomerDetailPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Customer Detail
                </Typography>
            </Container>
        </Layout>
    )
}

export default CustomerDetailPage;