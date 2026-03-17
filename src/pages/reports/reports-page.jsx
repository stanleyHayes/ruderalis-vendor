import {useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Snackbar,
    Alert,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {
    Assessment,
    Group,
    Inventory,
    MonetizationOn,
    ShoppingCart,
    TrendingUp,
    People,
    AttachMoney,
    CheckCircleRounded,
    PictureAsPdfRounded,
    TableChartRounded,
    SummarizeRounded,
} from "@mui/icons-material";
import Layout from "../../components/layout/layout";

const REPORT_COLORS = [
    {border: '#10B981', bg: 'rgba(16,185,129,0.08)', icon: '#059669'},
    {border: '#3B82F6', bg: 'rgba(59,130,246,0.08)', icon: '#2563EB'},
    {border: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', icon: '#7C3AED'},
    {border: '#F59E0B', bg: 'rgba(245,158,11,0.08)', icon: '#D97706'},
];

const STAT_GRADIENTS = [
    'linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)',
    'linear-gradient(135deg, #2563EB 0%, #3B82F6 50%, #60A5FA 100%)',
    'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
    'linear-gradient(135deg, #DB2777 0%, #EC4899 50%, #F472B6 100%)',
];

const MOCK_REPORT_DATA = {
    "Sales Report": {
        metrics: [
            {label: "Total Revenue", value: "$48,250.00"},
            {label: "Orders Completed", value: "312"},
            {label: "Avg Order Value", value: "$154.65"},
            {label: "Top Product", value: "Blue Dream (1oz)"},
        ],
    },
    "Products Report": {
        metrics: [
            {label: "Active Products", value: "87"},
            {label: "Out of Stock", value: "5"},
            {label: "Best Seller", value: "OG Kush"},
            {label: "Avg Price", value: "$42.50"},
        ],
    },
    "Customers Report": {
        metrics: [
            {label: "Total Customers", value: "342"},
            {label: "New This Period", value: "28"},
            {label: "Retention Rate", value: "78.4%"},
            {label: "Avg Lifetime Value", value: "$612.30"},
        ],
    },
    "Financial Report": {
        metrics: [
            {label: "Gross Revenue", value: "$152,500.00"},
            {label: "Net Profit", value: "$45,750.00"},
            {label: "Refunds Issued", value: "$3,200.00"},
            {label: "Profit Margin", value: "30.0%"},
        ],
    },
};

const ReportsPage = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [generatedReports, setGeneratedReports] = useState({});
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});

    const reports = [
        {
            title: "Sales Report",
            description: "View detailed breakdown of all sales including order volumes, revenue by product, and sales trends over time.",
            icon: <ShoppingCart sx={{fontSize: 28}}/>,
        },
        {
            title: "Products Report",
            description: "Analyze product performance including best sellers, stock levels, category breakdowns, and inventory turnover.",
            icon: <Inventory sx={{fontSize: 28}}/>,
        },
        {
            title: "Customers Report",
            description: "Review customer demographics, acquisition rates, retention metrics, and lifetime value analysis.",
            icon: <Group sx={{fontSize: 28}}/>,
        },
        {
            title: "Financial Report",
            description: "Comprehensive financial overview with revenue, expenses, withdrawals, refunds, and profit margins.",
            icon: <MonetizationOn sx={{fontSize: 28}}/>,
        },
    ];

    const summaryStats = [
        {label: "Total Sales", value: "$152,500", icon: <TrendingUp sx={{fontSize: 18}}/>, iconChar: '$'},
        {label: "Total Orders", value: "856", icon: <Assessment sx={{fontSize: 18}}/>, iconChar: '#'},
        {label: "Total Customers", value: "342", icon: <People sx={{fontSize: 18}}/>, iconChar: '@'},
        {label: "Avg Order Value", value: "$178.15", icon: <AttachMoney sx={{fontSize: 18}}/>, iconChar: '%'},
    ];

    const generatedCount = Object.keys(generatedReports).length;

    const handleGenerate = (reportTitle) => {
        setGeneratedReports(prev => ({
            ...prev,
            [reportTitle]: {
                generatedAt: new Date().toLocaleString(),
                dateRange: startDate && endDate
                    ? `${startDate} to ${endDate}`
                    : "All time",
            },
        }));
        setSnackbar({open: true, message: `${reportTitle} generated successfully!`, severity: "success"});
    };

    const handleDownload = (format) => {
        setSnackbar({open: true, message: `${format} download started`, severity: "info"});
    };

    return (
        <Layout>
            <Box sx={{overflow: "auto", maxHeight: "100vh", py: 3}}>
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Typography variant="h4" sx={{color: "text.primary", fontWeight: 700}}>
                            Reports
                        </Typography>

                        {/* Report Stats Bar */}
                        <Stack direction="row" spacing={2}>
                            <Card sx={{flex: 1, background: 'rgba(13,107,63,0.06)', border: '1px solid rgba(13,107,63,0.15)'}}>
                                <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box sx={{width: 36, height: 36, borderRadius: 2, bgcolor: 'rgba(13,107,63,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <SummarizeRounded sx={{fontSize: 18, color: '#0D6B3F'}}/>
                                        </Box>
                                        <Box>
                                            <Typography sx={{fontSize: '1.1rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.2}}>4</Typography>
                                            <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', fontWeight: 500}}>Total Reports Available</Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card sx={{flex: 1, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)'}}>
                                <CardContent sx={{p: 2, '&:last-child': {pb: 2}}}>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Box sx={{width: 36, height: 36, borderRadius: 2, bgcolor: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <CheckCircleRounded sx={{fontSize: 18, color: '#10B981'}}/>
                                        </Box>
                                        <Box>
                                            <Typography sx={{fontSize: '1.1rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.2}}>{generatedCount}</Typography>
                                            <Typography sx={{fontSize: '0.68rem', color: 'text.secondary', fontWeight: 500}}>Generated This Session</Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>

                        {/* Date Range Picker */}
                        <Card>
                            <CardContent sx={{p: 3}}>
                                <Typography variant="subtitle1" sx={{color: "text.primary", fontWeight: 700, mb: 2}}>
                                    Date Range
                                </Typography>
                                <Stack direction={{xs: "column", sm: "row"}} spacing={2} alignItems={{sm: "center"}}>
                                    <TextField
                                        type="date"
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        slotProps={{inputLabel: {shrink: true}}}
                                        size="small"
                                        sx={{minWidth: 200}}
                                    />
                                    <TextField
                                        type="date"
                                        label="End Date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        slotProps={{inputLabel: {shrink: true}}}
                                        size="small"
                                        sx={{minWidth: 200}}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Summary Stats with Gradients */}
                        <Grid container spacing={2}>
                            {summaryStats.map((stat, i) => (
                                <Grid size={{xs: 12, sm: 6, md: 3}} key={stat.label}>
                                    <Card sx={{
                                        border: 'none',
                                        borderRadius: 3,
                                        background: STAT_GRADIENTS[i],
                                        color: '#fff',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minHeight: 140,
                                    }}>
                                        <Box sx={{position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)'}}/>
                                        <Box sx={{position: 'absolute', bottom: -30, right: 30, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.08)'}}/>
                                        <CardContent sx={{p: 2.5, position: 'relative', zIndex: 1}}>
                                            <Box sx={{
                                                width: 36, height: 36, borderRadius: 2,
                                                background: 'rgba(255,255,255,0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                mb: 1.5, fontSize: '1.1rem', fontWeight: 800,
                                            }}>
                                                {stat.iconChar}
                                            </Box>
                                            <Typography sx={{fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.1, mb: 0.5}}>
                                                {stat.value}
                                            </Typography>
                                            <Typography sx={{fontSize: '0.78rem', opacity: 0.85, fontWeight: 500}}>
                                                {stat.label}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Report Cards with Colored Left Border */}
                        <Grid container spacing={2}>
                            {reports.map((report, i) => {
                                const colors = REPORT_COLORS[i];
                                const isGenerated = Boolean(generatedReports[report.title]);
                                const reportData = generatedReports[report.title];
                                return (
                                    <Grid size={{xs: 12, sm: 6}} key={report.title}>
                                        <Card sx={{
                                            height: "100%",
                                            borderLeft: `4px solid ${colors.border}`,
                                        }}>
                                            <CardContent sx={{p: 3}}>
                                                <Stack spacing={2} sx={{height: "100%"}}>
                                                    <Box sx={{
                                                        width: 48, height: 48, borderRadius: 2.5,
                                                        bgcolor: colors.bg, color: colors.icon,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        {report.icon}
                                                    </Box>
                                                    <Typography variant="subtitle1" sx={{color: "text.primary", fontWeight: 700}}>
                                                        {report.title}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{color: "text.secondary", flex: 1, lineHeight: 1.6}}>
                                                        {report.description}
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleGenerate(report.title)}
                                                        sx={{
                                                            bgcolor: "primary.main",
                                                            alignSelf: "flex-start",
                                                            px: 3,
                                                        }}
                                                    >
                                                        {isGenerated ? "Regenerate Report" : "Generate Report"}
                                                    </Button>

                                                    {/* Generated Report Results */}
                                                    {isGenerated && (
                                                        <Box sx={{
                                                            mt: 2,
                                                            p: 2.5,
                                                            borderRadius: 2,
                                                            bgcolor: 'rgba(16,185,129,0.04)',
                                                            border: '1px solid rgba(16,185,129,0.15)',
                                                        }}>
                                                            <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 2}}>
                                                                <CheckCircleRounded sx={{fontSize: 20, color: '#10B981'}}/>
                                                                <Typography sx={{fontWeight: 700, fontSize: 14, color: 'text.primary'}}>
                                                                    Report Generated
                                                                </Typography>
                                                            </Stack>
                                                            <Typography sx={{fontSize: 12, color: 'text.secondary', mb: 2}}>
                                                                Date range: {reportData.dateRange}
                                                            </Typography>
                                                            <Grid container spacing={1.5} sx={{mb: 2}}>
                                                                {MOCK_REPORT_DATA[report.title].metrics.map((metric) => (
                                                                    <Grid size={{xs: 6}} key={metric.label}>
                                                                        <Box sx={{p: 1.5, borderRadius: 1.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider'}}>
                                                                            <Typography sx={{fontSize: 11, color: 'text.secondary', fontWeight: 500}}>
                                                                                {metric.label}
                                                                            </Typography>
                                                                            <Typography sx={{fontSize: 15, fontWeight: 700, color: 'text.primary'}}>
                                                                                {metric.value}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                ))}
                                                            </Grid>
                                                            <Stack direction="row" spacing={1.5}>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    startIcon={<PictureAsPdfRounded sx={{fontSize: 16}}/>}
                                                                    onClick={() => handleDownload("PDF")}
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: 600,
                                                                        fontSize: 12,
                                                                        borderColor: 'divider',
                                                                        color: 'text.primary',
                                                                        borderRadius: '8px',
                                                                        '&:hover': {borderColor: '#0D6B3F', color: '#0D6B3F'},
                                                                    }}
                                                                >
                                                                    Download PDF
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    startIcon={<TableChartRounded sx={{fontSize: 16}}/>}
                                                                    onClick={() => handleDownload("CSV")}
                                                                    sx={{
                                                                        textTransform: 'none',
                                                                        fontWeight: 600,
                                                                        fontSize: 12,
                                                                        borderColor: 'divider',
                                                                        color: 'text.primary',
                                                                        borderRadius: '8px',
                                                                        '&:hover': {borderColor: '#0D6B3F', color: '#0D6B3F'},
                                                                    }}
                                                                >
                                                                    Download CSV
                                                                </Button>
                                                            </Stack>
                                                        </Box>
                                                    )}
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Stack>
                </Container>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                    severity={snackbar.severity}
                    sx={{borderRadius: '8px', fontWeight: 600}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Layout>
    );
};

export default ReportsPage;
