import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const UpdateProductPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    UpdateProduct
                </Typography>
            </Container>
        </Layout>
    )
}

export default UpdateProductPage;