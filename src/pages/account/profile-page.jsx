import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import {
    AccountBalanceRounded,
    BadgeRounded,
    BusinessRounded,
    CalendarMonthRounded,
    EditRounded,
    EmailRounded,
    LocationOnRounded,
    PhoneRounded,
    VerifiedRounded
} from "@mui/icons-material";
import Layout from "../../components/layout/layout";
import {selectAuth} from "../../redux/features/auth/auth-slice";

const InfoItem = ({icon: Icon, label, value, color = '#10B981'}) => {
    const display = (value && typeof value === 'object') ? JSON.stringify(value) : (value || 'Not provided');
    return (
        <Stack direction="row" spacing={2} alignItems="center" sx={{py: 1.2}}>
            <Box sx={{
                width: 40, height: 40, borderRadius: 2,
                background: `${color}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <Icon sx={{fontSize: 20, color}}/>
            </Box>
            <Box sx={{flex: 1, minWidth: 0}}>
                <Typography sx={{fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                    {label}
                </Typography>
                <Typography sx={{fontSize: '0.9rem', color: 'text.primary', fontWeight: 500, mt: 0.1}}>
                    {display}
                </Typography>
            </Box>
        </Stack>
    );
};

const ProfilePage = () => {
    const {user} = useSelector(selectAuth);
    const initial = user?.fullName?.charAt(0) || user?.companyName?.charAt(0) || "R";
    const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}) : 'N/A';

    return (
        <Layout>
            <Container maxWidth="lg">
                <Stack spacing={2.5}>
                    {/* Hero Card */}
                    <Card sx={{overflow: 'hidden'}}>
                        {/* Gradient Banner */}
                        <Box sx={{
                            height: 120,
                            background: 'linear-gradient(135deg, #064E3B 0%, #059669 40%, #10B981 70%, #34D399 100%)',
                            position: 'relative',
                        }}>
                            <Box sx={{position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}}/>
                            <Box sx={{position: 'absolute', bottom: -20, left: '30%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)'}}/>
                            <Box sx={{position: 'absolute', top: 20, right: 20}}>
                                <Button
                                    component={Link} to="/settings"
                                    variant="contained"
                                    startIcon={<EditRounded sx={{fontSize: 16}}/>}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        color: '#fff',
                                        '&:hover': {bgcolor: 'rgba(255,255,255,0.25)'},
                                        fontSize: '0.78rem', px: 2
                                    }}>
                                    Edit Profile
                                </Button>
                            </Box>
                        </Box>

                        <CardContent sx={{px: 3, pb: 3, mt: -4}}>
                            <Stack direction={{xs: 'column', sm: 'row'}} alignItems={{sm: 'flex-end'}} spacing={2.5}>
                                <Avatar sx={{
                                    width: 88, height: 88,
                                    bgcolor: '#064E3B', color: '#34D399',
                                    fontSize: '2.2rem', fontWeight: 800,
                                    border: '4px solid',
                                    borderColor: 'background.paper',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                                }}>
                                    {initial}
                                </Avatar>
                                <Box sx={{pb: 0.5, flex: 1}}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 0.3}}>
                                        <Typography sx={{fontWeight: 800, fontSize: '1.5rem', color: 'text.primary', letterSpacing: '-0.02em'}}>
                                            {user?.fullName || user?.companyName || 'Vendor'}
                                        </Typography>
                                        {user?.username && (
                                            <Typography sx={{fontSize: '0.85rem', color: 'text.secondary'}}>
                                                @{user.username} {user.role ? `- ${user.role}` : ''}
                                            </Typography>
                                        )}
                                        <VerifiedRounded sx={{color: '#10B981', fontSize: 22}}/>
                                    </Stack>
                                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                                        <Chip label="Verified Vendor" size="small" sx={{
                                            height: 22, fontSize: '0.7rem', fontWeight: 700,
                                            backgroundColor: '#D1FAE5', color: '#065F46'
                                        }}/>
                                        <Typography sx={{fontSize: '0.78rem', color: 'text.secondary'}}>
                                            Member since {joinDate}
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Grid container spacing={2.5}>
                        {/* Contact */}
                        <Grid size={{xs: 12, md: 6}}>
                            <Card sx={{height: '100%'}}>
                                <CardContent sx={{p: 3}}>
                                    <Typography sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary', mb: 1}}>
                                        Contact Information
                                    </Typography>
                                    <Divider sx={{mb: 1}}/>
                                    <Stack divider={<Divider sx={{opacity: 0.5}}/>}>
                                        <InfoItem icon={EmailRounded} label="Email" value={user?.email} color="#3B82F6"/>
                                        <InfoItem icon={PhoneRounded} label="Phone" value={user?.phone} color="#8B5CF6"/>
                                        <InfoItem icon={BadgeRounded} label="License Number" value={user?.license} color="#F59E0B"/>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Address */}
                        <Grid size={{xs: 12, md: 6}}>
                            <Card sx={{height: '100%'}}>
                                <CardContent sx={{p: 3}}>
                                    <Typography sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary', mb: 1}}>
                                        Business Address
                                    </Typography>
                                    <Divider sx={{mb: 1}}/>
                                    <Stack divider={<Divider sx={{opacity: 0.5}}/>}>
                                        <InfoItem icon={LocationOnRounded} label="Street" value={user?.address?.street} color="#EF4444"/>
                                        <InfoItem icon={BusinessRounded} label="City / Region" value={user?.address ? `${user.address.city || ''}, ${user.address.region || ''}` : null} color="#10B981"/>
                                        <InfoItem icon={LocationOnRounded} label="Country" value={user?.address?.country} color="#059669"/>
                                        <InfoItem icon={CalendarMonthRounded} label="Member Since" value={joinDate} color="#6366F1"/>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Payment Details */}
                        <Grid size={{xs: 12}}>
                            <Card>
                                <CardContent sx={{p: 3}}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 1}}>
                                        <Typography sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary'}}>
                                            Payment Details
                                        </Typography>
                                        <Chip label="Mobile Money" size="small" sx={{
                                            height: 22, fontSize: '0.68rem', fontWeight: 700,
                                            backgroundColor: '#DBEAFE', color: '#1E40AF'
                                        }}/>
                                    </Stack>
                                    <Divider sx={{mb: 1}}/>
                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 12, sm: 4}}>
                                            <InfoItem icon={AccountBalanceRounded} label="Provider" value={user?.paymentDetails?.provider?.toUpperCase()} color="#059669"/>
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 4}}>
                                            <InfoItem icon={AccountBalanceRounded} label="Mobile Number" value={user?.paymentDetails?.number} color="#3B82F6"/>
                                        </Grid>
                                        <Grid size={{xs: 12, sm: 4}}>
                                            <InfoItem icon={AccountBalanceRounded} label="Account Name" value={user?.paymentDetails?.accountName} color="#8B5CF6"/>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </Layout>
    );
};

export default ProfilePage;
