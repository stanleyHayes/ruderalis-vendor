import {Navigate, useLocation} from "react-router";
import {useSelector} from "react-redux";
import {selectAuth} from "../../redux/features/auth/auth-slice";

const RequireAuth = ({children}) => {
    const {token} = useSelector(selectAuth);
    const location = useLocation();

    if (!token) {
        return <Navigate to="/auth/login" state={{from: location}} replace/>;
    }

    return children;
};

export default RequireAuth;
