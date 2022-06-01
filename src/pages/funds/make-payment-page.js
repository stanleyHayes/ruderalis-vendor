import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const MakePaymentPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Make Payment
                </Typography>
            </Container>
        </Layout>
    )
}

export default MakePaymentPage;