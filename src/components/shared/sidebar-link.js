import {Link} from "react-router-dom";
import {Button, Stack} from "@mui/material";
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
                sx={{
                    justifyContent: 'flex-start',
                    borderLeftWidth: active ? 3 : 0,
                    borderLeftStyle: active ? 'solid' : false,
                    borderLeftColor: active ? 'secondary.main' : false,
                    backgroundColor: active ? 'light.secondary' : false,
                    px: 2
                }}
                direction="row" spacing={1.5} justifyContent="space-between" alignItems="center">
                {icon}
                <Button
                    fullWidth={true}
                    size="large"
                    variant="text"
                    sx={{
                        borderRadius: 0,
                        justifyContent: 'flex-start',
                        color: active ? 'secondary.main' : 'text.secondary',
                        textTransform: 'capitalize',
                    }}>
                    {label}
                </Button>
                <ChevronRight
                    sx={{
                        cursor: 'pointer',
                        color: active ? 'secondary.main': 'text.secondary',
                        borderRadius: '1%',
                        padding: 1,
                        fontSize: 20,
                    }}/>
            </Stack>
        </Link>
    )
}

export default SidebarLink;