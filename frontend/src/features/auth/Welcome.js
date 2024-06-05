import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'

const Welcome = () => {
    const [today, setToday] = useState(new Date())
    const { username, isAdmin, isManager } = useAuth()

    useTitle(`techNotes: ${username}`)

    useEffect(() => {
        const timer = setInterval(() => {
            setToday(new Date())
        }, 1000);

        return () => clearInterval(timer)
    }, []);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'long'
    }).format(today)

    return (
        <section className="welcome">

            <p>{formattedDate}</p>

            <h1>Welcome!</h1>

            <p><Link to="/dash/notes">View techNotes</Link></p>

            <p><Link to="/dash/notes/new">Add New techNote</Link></p>

            {(isAdmin || isManager) && <p><Link to="/dash/users">View User Settings</Link></p>}

            {(isAdmin || isManager) && <p><Link to="/dash/users/new">Add New User</Link></p>}

        </section>
    )
};

export default Welcome;