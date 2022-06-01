import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const FundsPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Funds
                </Typography>
            </Container>
        </Layout>
    )
}

export default FundsPage;