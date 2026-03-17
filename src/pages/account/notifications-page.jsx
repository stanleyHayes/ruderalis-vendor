import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import {
    DoneAll,
    Info,
    LocalShipping,
    Message,
    Notifications,
} from "@mui/icons-material";
import Layout from "../../components/layout/layout";
import {getMessages, markAsRead, selectMessages} from "../../redux/features/messages/messages-slice";
import {TableSkeleton} from "../../components/shared/page-skeleton";

const NotificationsPage = () => {
    const dispatch = useDispatch();
    const {messages, loading} = useSelector(selectMessages);

    useEffect(() => {
        dispatch(getMessages());
    }, [dispatch]);

    const handleMarkAllRead = () => {
        messages.filter(m => !m.read).forEach(m => {
            dispatch(markAsRead(m._id));
        });
    };

    const getIcon = (subject) => {
        const lower = subject.toLowerCase();
        if (lower.includes("order") || lower.includes("delivery")) {
            return {icon: <LocalShipping sx={{fontSize: 18}}/>, bg: 'rgba(16,185,129,0.08)', color: '#059669'};
        }
        if (lower.includes("license") || lower.includes("reminder")) {
            return {icon: <Info sx={{fontSize: 18}}/>, bg: 'rgba(245,158,11,0.08)', color: '#D97706'};
        }
        return {icon: <Message sx={{fontSize: 18}}/>, bg: 'rgba(59,130,246,0.08)', color: '#2563EB'};
    };

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="md">
                    <Stack spacing={3}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Typography variant="h4" sx={{color: "text.primary", fontWeight: 700}}>
                                    Notifications
                                </Typography>
                                {unreadCount > 0 && (
                                    <Box
                                        sx={{
                                            bgcolor: '#059669',
                                            borderRadius: 2,
                                            px: 1.2,
                                            py: 0.2,
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography variant="caption" sx={{color: "#fff", fontWeight: 700, fontSize: '0.7rem'}}>
                                            {unreadCount}
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                            {unreadCount > 0 && (
                                <Button
                                    startIcon={<DoneAll/>}
                                    onClick={handleMarkAllRead}
                                    sx={{color: "secondary.main"}}
                                >
                                    Mark all as read
                                </Button>
                            )}
                        </Stack>

                        {loading ? (
                            <TableSkeleton rows={4}/>
                        ) : (
                            <Card>
                                <CardContent sx={{p: 0, "&:last-child": {pb: 0}}}>
                                    {messages.length === 0 ? (
                                        <Stack alignItems="center" spacing={2} sx={{py: 8}}>
                                            <Box sx={{
                                                width: 56, height: 56, borderRadius: 3,
                                                bgcolor: 'light.secondary',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Notifications sx={{color: "text.secondary", fontSize: 28}}/>
                                            </Box>
                                            <Typography variant="body1" sx={{color: "text.secondary"}}>
                                                No notifications
                                            </Typography>
                                        </Stack>
                                    ) : (
                                        messages.map((notification, index) => {
                                            const iconInfo = getIcon(notification.subject);
                                            return (
                                                <Box key={notification._id}>
                                                    <Box
                                                        sx={{
                                                            p: 2.5,
                                                            bgcolor: notification.read ? "transparent" : "light.secondary",
                                                            transition: "background-color 0.2s",
                                                            "&:hover": {bgcolor: "light.secondary"},
                                                        }}
                                                    >
                                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: iconInfo.bg,
                                                                    color: iconInfo.color,
                                                                    width: 38,
                                                                    height: 38,
                                                                }}
                                                            >
                                                                {iconInfo.icon}
                                                            </Avatar>
                                                            <Box sx={{flex: 1, minWidth: 0}}>
                                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            color: "text.primary",
                                                                            fontWeight: notification.read ? 500 : 700,
                                                                            fontSize: '0.85rem',
                                                                        }}
                                                                    >
                                                                        {notification.subject}
                                                                    </Typography>
                                                                    <Stack direction="row" alignItems="center" spacing={1} sx={{flexShrink: 0, ml: 1}}>
                                                                        {!notification.read && (
                                                                            <Box
                                                                                sx={{
                                                                                    width: 8,
                                                                                    height: 8,
                                                                                    borderRadius: "50%",
                                                                                    bgcolor: "#10B981",
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <Typography variant="caption" sx={{color: "text.secondary", whiteSpace: "nowrap", fontSize: '0.7rem'}}>
                                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                                        </Typography>
                                                                    </Stack>
                                                                </Stack>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: "text.secondary",
                                                                        mt: 0.5,
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        display: "-webkit-box",
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: "vertical",
                                                                        fontSize: '0.82rem',
                                                                        lineHeight: 1.5,
                                                                    }}
                                                                >
                                                                    {notification.body}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{color: "text.secondary", mt: 0.5, display: "block", fontSize: '0.72rem'}}>
                                                                    From: {notification?.sender?.name || notification?.sender?.fullName || 'Unknown'}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                    {index < messages.length - 1 && <Divider/>}
                                                </Box>
                                            );
                                        })
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default NotificationsPage;
