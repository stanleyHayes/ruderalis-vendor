import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const ProductsPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Products
                </Typography>
            </Container>
        </Layout>
    )
}

export default ProductsPage;