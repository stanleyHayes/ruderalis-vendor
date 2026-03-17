import {useState, useEffect} from "react";
import {
    Badge, Box, Divider, IconButton, Menu, MenuItem, Stack, Typography, Button
} from "@mui/material";
import {
    NotificationsNoneRounded,
    LocalShipping,
    Campaign,
    MailRounded,
    Circle
} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {getMessages, markAsRead, selectMessages} from "../../redux/features/messages/messages-slice";
import {Link} from "react-router-dom";

const typeConfig = {
    order: {icon: LocalShipping, color: '#10B981', bg: 'rgba(16,185,129,0.1)'},
    message: {icon: MailRounded, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)'},
    system: {icon: Campaign, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'},
};

const getType = (msg) => {
    if (msg.sender?._id === 'admin') return 'system';
    if (msg.subject?.toLowerCase().includes('order')) return 'order';
    return 'message';
};

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const NotificationsDropdown = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const dispatch = useDispatch();
    const {messages} = useSelector(selectMessages);

    useEffect(() => {
        if (messages.length === 0) {
            dispatch(getMessages());
        }
    }, [dispatch, messages.length]);

    const unreadCount = messages.filter(m => !m.read).length;
    const recent = messages.slice(0, 5);

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleMarkRead = (id) => {
        dispatch(markAsRead(id));
    };

    return (
        <>
            <IconButton onClick={handleOpen} size="small">
                <Badge
                    badgeContent={unreadCount}
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                            fontSize: '0.6rem', minWidth: 16, height: 16,
                            fontWeight: 700
                        }
                    }}>
                    <NotificationsNoneRounded sx={{color: 'text.secondary', fontSize: 20}}/>
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                slotProps={{
                    paper: {
                        sx: {
                            width: 360, maxHeight: 440,
                            borderRadius: 3, mt: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.12)'
                        }
                    }
                }}>

                {/* Header */}
                <Box sx={{px: 2.5, py: 1.5}}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{fontWeight: 700, fontSize: '0.95rem', color: 'text.primary'}}>
                            Notifications
                        </Typography>
                        {unreadCount > 0 && (
                            <Box sx={{
                                px: 1, py: 0.2, borderRadius: 1,
                                backgroundColor: 'rgba(239,68,68,0.1)',
                                color: '#EF4444', fontSize: '0.7rem', fontWeight: 700
                            }}>
                                {unreadCount} new
                            </Box>
                        )}
                    </Stack>
                </Box>
                <Divider/>

                {/* Items */}
                {recent.length === 0 ? (
                    <Box sx={{py: 4, textAlign: 'center'}}>
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            No notifications
                        </Typography>
                    </Box>
                ) : (
                    recent.map((msg) => {
                        const type = getType(msg);
                        const config = typeConfig[type];
                        const Icon = config.icon;

                        return (
                            <MenuItem
                                key={msg._id}
                                onClick={() => {
                                    if (!msg.read) handleMarkRead(msg._id);
                                    handleClose();
                                }}
                                sx={{
                                    px: 2.5, py: 1.5,
                                    alignItems: 'flex-start',
                                    backgroundColor: msg.read ? 'transparent' : 'rgba(16,185,129,0.03)',
                                    '&:hover': {backgroundColor: 'action.hover'}
                                }}>
                                <Box sx={{position: 'relative', mr: 1.5, mt: 0.3}}>
                                    <Box sx={{
                                        width: 36, height: 36, borderRadius: 2,
                                        backgroundColor: config.bg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Icon sx={{fontSize: 18, color: config.color}}/>
                                    </Box>
                                    {!msg.read && (
                                        <Circle sx={{
                                            position: 'absolute', top: -2, right: -2,
                                            fontSize: 8, color: '#10B981'
                                        }}/>
                                    )}
                                </Box>
                                <Box sx={{flex: 1, minWidth: 0}}>
                                    <Typography sx={{
                                        fontSize: '0.82rem',
                                        fontWeight: msg.read ? 500 : 700,
                                        color: 'text.primary',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                    }}>
                                        {msg.subject}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: '0.72rem', color: 'text.secondary',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        mt: 0.2
                                    }}>
                                        {msg.body}
                                    </Typography>
                                    <Typography sx={{fontSize: '0.65rem', color: 'text.secondary', mt: 0.5, fontWeight: 500}}>
                                        {msg.sender?.name} · {timeAgo(msg.createdAt)}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        );
                    })
                )}

                <Divider/>
                <Box sx={{p: 1.5, textAlign: 'center'}}>
                    <Button
                        component={Link}
                        to="/notifications"
                        onClick={handleClose}
                        size="small"
                        sx={{fontSize: '0.78rem', color: 'secondary.main', fontWeight: 600}}>
                        View all notifications
                    </Button>
                </Box>
            </Menu>
        </>
    );
};

export default NotificationsDropdown;
