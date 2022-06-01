import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const ProductDetailPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Product Detail
                </Typography>
            </Container>
        </Layout>
    )
}

export default ProductDetailPage;