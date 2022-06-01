import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const CreateProductPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Create Product
                </Typography>
            </Container>
        </Layout>
    )
}

export default CreateProductPage;