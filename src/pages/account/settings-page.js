import Layout from "../../components/layout/layout";
import {Container, Typography} from "@mui/material";

const SettingsPage = () => {

    return (
        <Layout>
            <Container maxWidth="xl">
                <Typography variant="h2" sx={{color: 'text.primary'}}>
                    Settings
                </Typography>
            </Container>
        </Layout>
    )
}

export default SettingsPage;