import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const ShopsPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Shops
                </Typography>
            </Container>
        </Layout>
    )
}

export default ShopsPage;