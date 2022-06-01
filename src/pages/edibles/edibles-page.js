import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const EdiblesPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Edibles
                </Typography>
            </Container>
        </Layout>
    )
}

export default EdiblesPage;