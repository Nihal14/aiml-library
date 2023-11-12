import React from 'react'
import logo from '../assets/logo.png';

export default function NavBar() {
    return (
        <nav>
            <div className="navbar bg-neutral">
                <img className='md:ml-5' src={logo} alt="AAIE logo" width={65} />
                <a className="btn btn-ghost text-white normal-case text-xl" href='/'>AIML Library</a>
            </div>
        </nav>
    )
}
