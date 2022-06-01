import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const NotFoundPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Not Found
                </Typography>
            </Container>
        </Layout>
    )
}

export default NotFoundPage;