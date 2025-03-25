import { Navigate } from 'react-router';
import {useSelector } from 'react-redux'


const PrivateRoute = ({ element }) => {
        const { user } = useSelector((state) => state.auth)
        if (!user) {
            return <Navigate to = '/'/>
        }
        return element;
    };
    
// PrivateRoute.propTypes = {
//     element: PropTypes.node.isRequired, // Expect a valid React element
//   };

export default PrivateRoute