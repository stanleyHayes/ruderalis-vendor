import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const ShopDetailPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Shop Detail
                </Typography>
            </Container>
        </Layout>
    )
}

export default ShopDetailPage;