import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const UpdateShopPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Update Shop
                </Typography>
            </Container>
        </Layout>
    )
}

export default UpdateShopPage;