import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const OrderDetailPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Order Detail
                </Typography>
            </Container>
        </Layout>
    )
}

export default OrderDetailPage;