import { useSelector } from 'react-redux'
import { NotAuthorized } from './ErrorPages/Pages/401'

const AdminDashboard = () => {
    const { currentUser } = useSelector((state) => state.user)
    const roles = currentUser?.roles;

    // If user is not an admin, redirect to 401 page
    if (!roles?.includes('admin')) {
        return <NotAuthorized />
    }

    return (
        <div>AdminDashboard</div>
    )
}

export default AdminDashboard