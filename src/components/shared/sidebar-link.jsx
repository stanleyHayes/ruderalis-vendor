import {Link} from "react-router-dom";
import {Stack, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import {changePath, closeDrawer} from "../../redux/features/ui/ui-slice";
import {ChevronRight} from "@mui/icons-material";

const SidebarLink = ({path, label, active, icon}) => {

    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(changePath(path));
        dispatch(closeDrawer());
    }

    return (
        <Link to={path} onClick={handleClick} style={{textDecoration: 'none'}}>
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                    px: 2,
                    py: 1.2,
                    mx: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    backgroundColor: active ? 'light.secondary' : 'transparent',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                        backgroundColor: active ? 'light.secondary' : 'light.gray',
                    }
                }}>
                {icon}
                <Typography
                    variant="body2"
                    sx={{
                        flex: 1,
                        fontWeight: active ? 600 : 400,
                        color: active ? 'secondary.main' : 'text.secondary',
                        fontSize: '0.875rem'
                    }}>
                    {label}
                </Typography>
                <ChevronRight
                    sx={{
                        color: active ? 'secondary.main' : 'text.secondary',
                        fontSize: 18,
                        opacity: 0.5
                    }}/>
            </Stack>
        </Link>
    )
}

export default SidebarLink;
