import {Box, Grid, Skeleton, Stack} from "@mui/material";

export const DashboardSkeleton = () => (
    <Stack spacing={2.5}>
        <Skeleton variant="text" width={200} height={32}/>
        <Skeleton variant="text" width={280} height={18}/>
        <Grid container spacing={2}>
            {[0,1,2,3].map(i => (
                <Grid key={i} size={{xs: 12, sm: 6, lg: 3}}>
                    <Skeleton variant="rounded" height={130} sx={{borderRadius: 2}}/>
                </Grid>
            ))}
        </Grid>
        <Grid container spacing={2}>
            <Grid size={{xs: 12, lg: 7}}>
                <Skeleton variant="rounded" height={280} sx={{borderRadius: 2}}/>
            </Grid>
            <Grid size={{xs: 12, lg: 5}}>
                <Skeleton variant="rounded" height={280} sx={{borderRadius: 2}}/>
            </Grid>
        </Grid>
    </Stack>
);

export const TableSkeleton = ({rows = 5, cols = 5}) => (
    <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width={160} height={32}/>
            <Skeleton variant="rounded" width={120} height={36} sx={{borderRadius: 1}}/>
        </Stack>
        <Stack direction="row" spacing={2} sx={{mb: 1}}>
            {[0,1,2,3].map(i => (
                <Skeleton key={i} variant="rounded" width={100} height={28} sx={{borderRadius: 1}}/>
            ))}
        </Stack>
        <Skeleton variant="rounded" width="100%" height={44} sx={{borderRadius: 1}}/>
        <Skeleton variant="rounded" height={40} sx={{borderRadius: 1, opacity: 0.7}}/>
        {Array.from({length: rows}).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={52} sx={{borderRadius: 1, opacity: 1 - (i * 0.12)}}/>
        ))}
    </Stack>
);

export const DetailSkeleton = () => (
    <Stack spacing={2.5}>
        <Skeleton variant="text" width={140} height={20}/>
        <Skeleton variant="rounded" height={140} sx={{borderRadius: 2}}/>
        <Stack direction="row" spacing={2}>
            {[0,1,2,3,4].map(i => (
                <Skeleton key={i} variant="rounded" height={80} sx={{flex: 1, borderRadius: 2}}/>
            ))}
        </Stack>
        <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 6}}>
                <Skeleton variant="rounded" height={200} sx={{borderRadius: 2}}/>
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
                <Skeleton variant="rounded" height={200} sx={{borderRadius: 2}}/>
            </Grid>
        </Grid>
    </Stack>
);

export const CardGridSkeleton = ({count = 6}) => (
    <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width={160} height={32}/>
            <Skeleton variant="rounded" width={120} height={36} sx={{borderRadius: 1}}/>
        </Stack>
        <Grid container spacing={2}>
            {Array.from({length: count}).map((_, i) => (
                <Grid key={i} size={{xs: 12, sm: 6, lg: 4}}>
                    <Skeleton variant="rounded" height={220} sx={{borderRadius: 2}}/>
                </Grid>
            ))}
        </Grid>
    </Stack>
);
