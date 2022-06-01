import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const CreateShopPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Create Shop
                </Typography>
            </Container>
        </Layout>
    )
}

export default CreateShopPage;