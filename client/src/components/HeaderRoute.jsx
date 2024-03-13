import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function HeaderRoute() {

    // Display header
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}
