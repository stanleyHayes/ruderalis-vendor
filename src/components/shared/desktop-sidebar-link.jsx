import {Link} from "react-router-dom";
import {Stack, Tooltip, Typography} from "@mui/material";
import {useDispatch} from "react-redux";
import {changePath} from "../../redux/features/ui/ui-slice";

const DesktopSidebarLink = ({path, label, active, icon, collapsed}) => {

    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(changePath(path));
    }

    if (collapsed) {
        return (
            <Tooltip title={label} placement="right" arrow>
                <Link to={path} onClick={handleClick} style={{textDecoration: 'none'}}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            width: 40, height: 40,
                            mx: 'auto',
                            my: 0.3,
                            borderRadius: 1.5,
                            cursor: 'pointer',
                            backgroundColor: active ? 'light.secondary' : 'transparent',
                            transition: 'all 0.15s ease',
                            '&:hover': {backgroundColor: active ? 'light.secondary' : 'light.gray'},
                        }}>
                        {icon}
                    </Stack>
                </Link>
            </Tooltip>
        );
    }

    return (
        <Link to={path} onClick={handleClick} style={{textDecoration: 'none'}}>
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                    px: 2,
                    py: 1,
                    mx: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    backgroundColor: active ? 'light.secondary' : 'transparent',
                    transition: 'all 0.15s ease',
                    '&:hover': {backgroundColor: active ? 'light.secondary' : 'light.gray'},
                }}>
                {icon}
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: active ? 600 : 400,
                        color: active ? 'secondary.main' : 'text.secondary',
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                    }}>
                    {label}
                </Typography>
            </Stack>
        </Link>
    )
}

export default DesktopSidebarLink;
