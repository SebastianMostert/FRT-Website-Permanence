import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { NotAuthorized} from '../../pages/index'

export default function PrivateRoute() {
    const { currentUser } = useSelector(state => state.user)
    const isAdmin = currentUser?.roles.includes('admin');

    return isAdmin ? <Outlet /> : <NotAuthorized />
}
