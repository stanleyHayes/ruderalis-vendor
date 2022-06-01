import './App.css';
import {CssBaseline, ThemeProvider} from "@mui/material";
import {useSelector} from "react-redux";
import {selectUI} from "./redux/features/ui/ui-slice";
import {THEMES} from "./utils/themes";
import {Route, Routes} from "react-router";
import DashboardPage from "./pages/dashboard/dashboard-page";

function App() {

    const {themeVariant} = useSelector(selectUI);
    const theme = themeVariant === 'dark' ? THEMES.darkTheme : THEMES.lightTheme;
    return (
        <ThemeProvider theme={theme}>
            <Routes>
                <Route path="/" exact={true} element={<DashboardPage/>}/>
                <Route path="/products" exact={true} element={<DashboardPage/>}/>
                <Route path="/orders" exact={true} element={<DashboardPage/>}/>
                <Route path="/shops" exact={true} element={<DashboardPage/>}/>
                <Route path="/customers" exact={true} element={<DashboardPage/>}/>
                <Route path="/funds" exact={true} element={<DashboardPage/>}/>
                <Route path="/reports" exact={true} element={<DashboardPage/>}/>
                <Route path="/revenue" exact={true} element={<DashboardPage/>}/>
                <Route path="/profile" exact={true} element={<DashboardPage/>}/>
                <Route path="/settings" exact={true} element={<DashboardPage/>}/>
                <Route path="/notifications" exact={true} element={<DashboardPage/>}/>
                <Route path="/privacy" exact={true} element={<DashboardPage/>}/>
                <Route path="/terms" exact={true} element={<DashboardPage/>}/>
                <Route path="/auth/reset-assword" exact={true} element={<DashboardPage/>}/>
                <Route path="/auth/forgot-password" exact={true} element={<DashboardPage/>}/>
                <Route path="/auth/login" exact={true} element={<DashboardPage/>}/>
                <Route path="/auth/register" exact={true} element={<DashboardPage/>}/>
                <Route path="/*" exact={true} element={<DashboardPage/>}/>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
