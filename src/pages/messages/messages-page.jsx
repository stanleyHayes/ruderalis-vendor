import {useEffect, useState} from "react";
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
    TextField,
    Typography,
} from "@mui/material";
import {Send, MailRounded, MarkunreadRounded, DraftsRounded} from "@mui/icons-material";
import {TableSkeleton} from "../../components/shared/page-skeleton";

const MiniStat = ({icon: Icon, label, value, color}) => (
    <Card sx={{border: 'none', background: `${color}08`, flex: 1, minWidth: 0}}>
        <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{width: 36, height: 36, borderRadius: 2, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon sx={{fontSize: 18, color}}/>
                </Box>
                <Box>
                    <Typography sx={{fontSize: '1.1rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.2}}>{value}</Typography>
                    <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', fontWeight: 500}}>{label}</Typography>
                </Box>
            </Stack>
        </CardContent>
    </Card>
);
import Layout from "../../components/layout/layout";
import {getMessages, sendMessage, markAsRead, selectMessages} from "../../redux/features/messages/messages-slice";

const AVATAR_COLORS = [
    '#059669', '#2563EB', '#7C3AED', '#DB2777', '#D97706', '#0891B2', '#4F46E5', '#BE185D',
];

const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const MessagesPage = () => {
    const dispatch = useDispatch();
    const {messages, loading} = useSelector(selectMessages);
    const [selectedId, setSelectedId] = useState(null);
    const [reply, setReply] = useState("");

    useEffect(() => {
        dispatch(getMessages());
    }, [dispatch]);

    const selected = messages.find(m => m._id === selectedId);

    const handleSelect = (msg) => {
        setSelectedId(msg._id);
        setReply("");
        if (!msg.read) {
            dispatch(markAsRead(msg._id));
        }
    };

    const handleSendReply = () => {
        if (!reply.trim() || !selected) return;
        dispatch(sendMessage({
            subject: `Re: ${selected.subject}`,
            body: reply,
            recipient: selected.sender._id,
        }));
        setReply("");
    };

    return (
        <Layout>
            <Box sx={{overflow: "hidden", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="xl" sx={{height: "calc(100vh - 48px)"}}>
                    <Stack spacing={2} sx={{height: "100%"}}>
                        <Typography variant="h4" sx={{color: "text.primary", fontWeight: 700}}>
                            Messages
                        </Typography>

                        {/* Stats */}
                        {messages.length > 0 && (
                            <Stack direction="row" spacing={2} sx={{flexWrap: 'wrap', gap: 2}}>
                                <MiniStat icon={MailRounded} label="Total Messages" value={messages.length.toLocaleString()} color="#3B82F6"/>
                                <MiniStat icon={MarkunreadRounded} label="Unread" value={messages.filter(m => !m.read).length.toLocaleString()} color="#EF4444"/>
                                <MiniStat icon={DraftsRounded} label="Read" value={messages.filter(m => m.read).length.toLocaleString()} color="#10B981"/>
                            </Stack>
                        )}

                        {loading && messages.length === 0 ? (
                            <TableSkeleton rows={4} />
                        ) : (
                            <Box sx={{display: "flex", gap: 2, flex: 1, minHeight: 0}}>
                                {/* Message List */}
                                <Card
                                    sx={{
                                        width: {xs: selectedId ? 0 : "100%", md: 360},
                                        minWidth: {xs: selectedId ? 0 : "100%", md: 360},
                                        display: {xs: selectedId ? "none" : "flex", md: "flex"},
                                        flexDirection: "column",
                                        overflow: "hidden",
                                    }}
                                >
                                    <CardContent sx={{p: 0, flex: 1, overflow: "auto", "&:last-child": {pb: 0}}}>
                                        {messages.map((msg, index) => {
                                            const color = getAvatarColor(msg?.sender?.name || msg?.sender?.fullName || 'Unknown');
                                            return (
                                                <Box key={msg._id}>
                                                    <Box
                                                        onClick={() => handleSelect(msg)}
                                                        sx={{
                                                            p: 2,
                                                            cursor: "pointer",
                                                            bgcolor: selectedId === msg._id ? "light.secondary" : "transparent",
                                                            "&:hover": {bgcolor: "light.secondary"},
                                                            transition: "background-color 0.2s",
                                                        }}
                                                    >
                                                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                                                            <Box sx={{position: 'relative', mt: 0.5}}>
                                                                <Avatar sx={{
                                                                    bgcolor: `${color}18`,
                                                                    color: color,
                                                                    width: 36,
                                                                    height: 36,
                                                                    fontSize: '0.8rem',
                                                                    fontWeight: 700,
                                                                }}>
                                                                    {msg?.sender?.name || msg?.sender?.fullName || 'Unknown'.charAt(0)}
                                                                </Avatar>
                                                                {!msg.read && (
                                                                    <Box sx={{
                                                                        position: 'absolute', top: -2, right: -2,
                                                                        width: 10, height: 10, borderRadius: '50%',
                                                                        bgcolor: '#10B981',
                                                                        border: '2px solid',
                                                                        borderColor: 'background.paper',
                                                                    }}/>
                                                                )}
                                                            </Box>
                                                            <Box sx={{flex: 1, minWidth: 0}}>
                                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            color: "text.primary",
                                                                            fontWeight: msg.read ? 500 : 700,
                                                                            fontSize: '0.82rem',
                                                                        }}
                                                                    >
                                                                        {msg?.sender?.name || msg?.sender?.fullName || 'Unknown'}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{color: "text.secondary", whiteSpace: "nowrap", ml: 1, fontSize: '0.68rem'}}>
                                                                        {new Date(msg.createdAt).toLocaleDateString()}
                                                                    </Typography>
                                                                </Stack>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        color: "text.primary",
                                                                        fontWeight: msg.read ? 400 : 600,
                                                                        fontSize: '0.78rem',
                                                                    }}
                                                                >
                                                                    {msg.subject}
                                                                </Typography>
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: "text.secondary",
                                                                        display: "block",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                        fontSize: '0.72rem',
                                                                    }}
                                                                >
                                                                    {msg.body}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Box>
                                                    {index < messages.length - 1 && <Divider/>}
                                                </Box>
                                            );
                                        })}
                                        {messages.length === 0 && (
                                            <Typography variant="body2" sx={{color: "text.secondary", textAlign: "center", py: 4}}>
                                                No messages
                                            </Typography>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Message Detail */}
                                <Card
                                    sx={{
                                        flex: 1,
                                        display: {xs: selectedId ? "flex" : "none", md: "flex"},
                                        flexDirection: "column",
                                        overflow: "hidden",
                                    }}
                                >
                                    {selected ? (
                                        <CardContent sx={{p: 3, flex: 1, display: "flex", flexDirection: "column", "&:last-child": {pb: 3}}}>
                                            <Button
                                                onClick={() => setSelectedId(null)}
                                                sx={{
                                                    display: {xs: "inline-flex", md: "none"},
                                                    alignSelf: "flex-start",
                                                    color: "text.secondary",
                                                    mb: 1,
                                                }}
                                            >
                                                Back
                                            </Button>

                                            <Stack direction="row" alignItems="center" spacing={2} sx={{mb: 2}}>
                                                {(() => {
                                                    const color = getAvatarColor(selected?.sender?.name || selected?.sender?.fullName || 'Unknown');
                                                    return (
                                                        <Avatar sx={{
                                                            bgcolor: `${color}18`,
                                                            color: color,
                                                            width: 42,
                                                            height: 42,
                                                            fontWeight: 700,
                                                        }}>
                                                            {selected?.sender?.name || selected?.sender?.fullName || 'Unknown'.charAt(0)}
                                                        </Avatar>
                                                    );
                                                })()}
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{color: "text.primary", fontWeight: 700}}>
                                                        {selected?.sender?.name || selected?.sender?.fullName || 'Unknown'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{color: "text.secondary"}}>
                                                        {new Date(selected.createdAt).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Typography variant="h6" sx={{color: "text.primary", fontWeight: 700, mb: 2}}>
                                                {selected.subject}
                                            </Typography>

                                            <Divider sx={{mb: 2}}/>

                                            <Typography variant="body1" sx={{color: "text.primary", flex: 1, lineHeight: 1.8}}>
                                                {selected.body}
                                            </Typography>

                                            <Divider sx={{my: 2}}/>

                                            {/* Reply Form */}
                                            <Stack direction="row" spacing={1}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Type your reply..."
                                                    value={reply}
                                                    onChange={(e) => setReply(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSendReply();
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    onClick={handleSendReply}
                                                    disabled={!reply.trim()}
                                                    sx={{bgcolor: "primary.main", minWidth: 48}}
                                                >
                                                    <Send fontSize="small"/>
                                                </Button>
                                            </Stack>
                                        </CardContent>
                                    ) : (
                                        <Box sx={{display: "flex", alignItems: "center", justifyContent: "center", flex: 1}}>
                                            <Typography variant="body1" sx={{color: "text.secondary"}}>
                                                Select a message to read
                                            </Typography>
                                        </Box>
                                    )}
                                </Card>
                            </Box>
                        )}
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default MessagesPage;
