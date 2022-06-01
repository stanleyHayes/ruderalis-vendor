import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const OrdersPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Orders
                </Typography>
            </Container>
        </Layout>
    )
}

export default OrdersPage;