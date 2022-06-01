import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const CustomersPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Customers
                </Typography>
            </Container>
        </Layout>
    )
}

export default CustomersPage;