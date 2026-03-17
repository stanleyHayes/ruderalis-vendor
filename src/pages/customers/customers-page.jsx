import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {
    Avatar,
    Box,
    Container,
    InputAdornment,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    Card,
    CardContent,
} from "@mui/material";
import {Search, PeopleAltRounded, PersonRounded, AttachMoneyRounded, ShoppingCartRounded} from "@mui/icons-material";
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
import {getCustomers, selectCustomers} from "../../redux/features/customers/customers-slice";

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

const fmtGHS = (v) => `GH₵ ${(v || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

const STATUS_STYLES = {
    active: {bg: '#D1FAE5', text: '#065F46'},
    suspended: {bg: '#FEE2E2', text: '#991B1B'},
};

const CustomersPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {customers, loading} = useSelector(selectCustomers);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    const filtered = customers.filter(c =>
        c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    const paginatedCustomers = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack direction={{xs: "column", sm: "row"}} justifyContent="space-between" alignItems={{sm: "center"}} spacing={2}>
                            <Typography variant="h4" sx={{color: "text.primary", fontWeight: 700}}>
                                Customers
                            </Typography>
                            <TextField
                                size="small"
                                placeholder="Search customers..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                                sx={{minWidth: 280}}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search sx={{color: "text.secondary"}}/>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Stack>

                        {/* Stats */}
                        {!loading && (
                            <Stack direction="row" spacing={2} sx={{mb: 0.5, flexWrap: 'wrap', gap: 2}}>
                                <MiniStat icon={PeopleAltRounded} label="Total Customers" value={customers.length.toLocaleString()} color="#8B5CF6"/>
                                <MiniStat icon={PersonRounded} label="Active" value={customers.filter(c => c.status === 'active').length.toLocaleString()} color="#10B981"/>
                                <MiniStat icon={AttachMoneyRounded} label="Total Spent" value={fmtGHS(customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0))} color="#059669"/>
                                <MiniStat icon={ShoppingCartRounded} label="Avg Orders" value={customers.length > 0 ? (customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0) / customers.length).toFixed(1) : '0'} color="#3B82F6"/>
                            </Stack>
                        )}

                        {loading ? (
                            <TableSkeleton/>
                        ) : (
                            <Card>
                                <CardContent sx={{p: 0, "&:last-child": {pb: 0}}}>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    {["Name", "Email", "Phone", "Orders", "Spent", "Status", "Last Order"].map((h, i) => (
                                                        <TableCell
                                                            key={h}
                                                            sx={{
                                                                fontWeight: 600,
                                                                fontSize: '0.72rem',
                                                                color: 'text.secondary',
                                                                py: 1.5,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.05em',
                                                                display: i === 2 ? {xs: "none", md: "table-cell"} :
                                                                    (i === 3 || i === 4) ? {xs: "none", sm: "table-cell"} :
                                                                        i === 6 ? {xs: "none", lg: "table-cell"} : "table-cell",
                                                            }}
                                                        >
                                                            {h}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {paginatedCustomers.map((customer) => {
                                                    const color = getAvatarColor(customer.fullName || '');
                                                    const status = STATUS_STYLES[customer.status] || STATUS_STYLES.inactive;
                                                    return (
                                                        <TableRow
                                                            key={customer._id}
                                                            hover
                                                            sx={{cursor: "pointer", "&:last-child td": {borderBottom: 0}, "&:hover": {backgroundColor: "action.hover"}}}
                                                            onClick={() => navigate(`/customers/${customer._id}`)}
                                                        >
                                                            <TableCell>
                                                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                                                    <Avatar
                                                                        sx={{
                                                                            bgcolor: `${color}18`,
                                                                            color: color,
                                                                            width: 34,
                                                                            height: 34,
                                                                            fontSize: '0.8rem',
                                                                            fontWeight: 700,
                                                                        }}
                                                                    >
                                                                        {customer.fullName.charAt(0)}
                                                                    </Avatar>
                                                                    <Typography variant="body2" sx={{color: "text.primary", fontWeight: 600, fontSize: '0.82rem'}}>
                                                                        {customer.fullName}
                                                                    </Typography>
                                                                </Stack>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography variant="body2" sx={{color: "text.secondary", fontSize: '0.82rem'}}>
                                                                    {customer.email}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{display: {xs: "none", md: "table-cell"}}}>
                                                                <Typography variant="body2" sx={{color: "text.secondary", fontSize: '0.82rem'}}>
                                                                    {customer.phone}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{display: {xs: "none", sm: "table-cell"}}}>
                                                                <Typography variant="body2" sx={{color: "text.primary", fontWeight: 600, fontSize: '0.82rem'}}>
                                                                    {customer.totalOrders}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{display: {xs: "none", sm: "table-cell"}}}>
                                                                <Typography variant="body2" sx={{color: "text.primary", fontWeight: 700, fontSize: '0.82rem'}}>
                                                                    {fmtGHS(customer.totalSpent)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.75,
                                                                    px: 1.2,
                                                                    py: 0.3,
                                                                    borderRadius: 1.5,
                                                                    fontSize: '0.7rem',
                                                                    fontWeight: 700,
                                                                    textTransform: 'capitalize',
                                                                    backgroundColor: status.bg,
                                                                    color: status.text,
                                                                }}>
                                                                    <Box sx={{
                                                                        width: 6, height: 6, borderRadius: '50%',
                                                                        bgcolor: status.text,
                                                                    }}/>
                                                                    {customer.status}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell sx={{display: {xs: "none", lg: "table-cell"}}}>
                                                                <Typography variant="body2" sx={{color: "text.secondary", fontSize: '0.78rem'}}>
                                                                    {new Date(customer.lastOrder).toLocaleDateString()}
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                {filtered.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={7} sx={{textAlign: "center", py: 4}}>
                                                            <Typography variant="body2" sx={{color: "text.secondary"}}>
                                                                No customers found
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            component="div"
                                            count={filtered.length}
                                            page={page}
                                            onPageChange={(_, newPage) => setPage(newPage)}
                                            rowsPerPage={rowsPerPage}
                                            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                                            rowsPerPageOptions={[5, 10, 25]}
                                            sx={{
                                                borderTop: '1px solid',
                                                borderColor: 'divider',
                                                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                                    fontSize: '0.78rem',
                                                    color: 'text.secondary'
                                                }
                                            }}
                                        />
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                </Container>
            </Box>
        </Layout>
    );
};

export default CustomersPage;
