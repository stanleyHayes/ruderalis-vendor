import './App.css';
import {CssBaseline, ThemeProvider} from "@mui/material";
import {useSelector} from "react-redux";
import {selectUI} from "./redux/features/ui/ui-slice";
import {THEMES} from "./utils/themes";
import {Route, Routes} from "react-router";
import RequireAuth from "./components/shared/require-auth";
import DashboardPage from "./pages/dashboard/dashboard-page";
import ProductsPage from "./pages/products/products-page";
import ProductDetailPage from "./pages/products/product-detail-page";
import CreateProductPage from "./pages/products/create-product-page";
import UpdateProductPage from "./pages/products/update-product-page";
import OrdersPage from "./pages/orders/orders-page";
import OrderDetailPage from "./pages/orders/order-detail-page";
import ShopsPage from "./pages/shops/shops-page";
import ShopDetailPage from "./pages/shops/shop-detail-page";
import CreateShopPage from "./pages/shops/create-shop-page";
import UpdateShopPage from "./pages/shops/update-shop-page";
import ShopManagePage from "./pages/shops/shop-manage-page";
import CustomersPage from "./pages/customers/customers-page";
import CustomerDetailPage from "./pages/customers/customer-detail-page";
import FundsPage from "./pages/funds/funds-page";
import MakePaymentPage from "./pages/funds/make-payment-page";
import ReportsPage from "./pages/reports/reports-page";
import RevenuePage from "./pages/revenue/revenue-page";
import EdiblesPage from "./pages/edibles/edibles-page";
import MessagesPage from "./pages/messages/messages-page";
import SettingsPage from "./pages/account/settings-page";
import ProfilePage from "./pages/account/profile-page";
import NotificationsPage from "./pages/account/notifications-page";
import PaymentSetupPage from "./pages/account/payment-setup-page";
import ShippingSetupPage from "./pages/account/shipping-setup-page";
import LoginPage from "./pages/auth/login-page";
import RegisterPage from "./pages/auth/register-page";
import ForgotPasswordPage from "./pages/auth/forgot-password-page";
import ResetPasswordPage from "./pages/auth/reset-password-page";
import AccessoriesPage from "./pages/accessories/accessories-page";
import DisputesPage from "./pages/disputes/disputes-page";
import DisputeDetailPage from "./pages/disputes/dispute-detail-page";
import PromotionsPage from "./pages/promotions/promotions-page";
import AboutPage from "./pages/others/about-page";
import PrivacyPage from "./pages/others/privacy-page";
import TermsPage from "./pages/others/terms-page";
import NotFoundPage from "./pages/404/not-found-page";
import {SnackbarProvider} from "notistack";

const P = ({children}) => <RequireAuth>{children}</RequireAuth>;

function App() {

    const {themeVariant} = useSelector(selectUI);
    const theme = themeVariant === 'dark' ? THEMES.darkTheme : THEMES.lightTheme;
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                autoHideDuration={3000}>
                <Routes>
                    {/* Dashboard */}
                    <Route path="/" element={<P><DashboardPage/></P>}/>

                    {/* Products */}
                    <Route path="/products" element={<P><ProductsPage/></P>}/>
                    <Route path="/products/new" element={<P><CreateProductPage/></P>}/>
                    <Route path="/products/:id" element={<P><ProductDetailPage/></P>}/>
                    <Route path="/products/:id/edit" element={<P><UpdateProductPage/></P>}/>

                    {/* Orders */}
                    <Route path="/orders" element={<P><OrdersPage/></P>}/>
                    <Route path="/orders/:id" element={<P><OrderDetailPage/></P>}/>

                    {/* Shops */}
                    <Route path="/shops" element={<P><ShopsPage/></P>}/>
                    <Route path="/shops/new" element={<P><CreateShopPage/></P>}/>
                    <Route path="/shops/:id" element={<P><ShopDetailPage/></P>}/>
                    <Route path="/shops/:id/edit" element={<P><UpdateShopPage/></P>}/>
                    <Route path="/shops/:id/manage" element={<P><ShopManagePage/></P>}/>

                    {/* Customers */}
                    <Route path="/customers" element={<P><CustomersPage/></P>}/>
                    <Route path="/customers/:id" element={<P><CustomerDetailPage/></P>}/>

                    {/* Funds */}
                    <Route path="/funds" element={<P><FundsPage/></P>}/>
                    <Route path="/funds/withdraw" element={<P><MakePaymentPage/></P>}/>

                    {/* Reports & Revenue */}
                    <Route path="/reports" element={<P><ReportsPage/></P>}/>
                    <Route path="/revenue" element={<P><RevenuePage/></P>}/>
                    <Route path="/edibles" element={<P><EdiblesPage/></P>}/>
                    <Route path="/accessories" element={<P><AccessoriesPage/></P>}/>
                    <Route path="/promotions" element={<P><PromotionsPage/></P>}/>

                    {/* Messages */}
                    <Route path="/messages" element={<P><MessagesPage/></P>}/>

                    {/* Disputes */}
                    <Route path="/disputes" element={<P><DisputesPage/></P>}/>
                    <Route path="/disputes/:id" element={<P><DisputeDetailPage/></P>}/>

                    {/* Account */}
                    <Route path="/profile" element={<P><ProfilePage/></P>}/>
                    <Route path="/settings" element={<P><SettingsPage/></P>}/>
                    <Route path="/payment-setup" element={<P><PaymentSetupPage/></P>}/>
                    <Route path="/shipping-setup" element={<P><ShippingSetupPage/></P>}/>
                    <Route path="/notifications" element={<P><NotificationsPage/></P>}/>

                    {/* Auth (public) */}
                    <Route path="/auth/login" element={<LoginPage/>}/>
                    <Route path="/auth/register" element={<RegisterPage/>}/>
                    <Route path="/auth/forgot-password" element={<ForgotPasswordPage/>}/>
                    <Route path="/auth/reset-password" element={<ResetPasswordPage/>}/>

                    {/* Info (public) */}
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="/privacy" element={<PrivacyPage/>}/>
                    <Route path="/terms" element={<TermsPage/>}/>

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
