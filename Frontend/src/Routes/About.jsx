import React from 'react'
import ProfileCard from '../Components/ProfileCard'

export default function About() {
    return (
        <div>
            <h1 className='text-3xl     m-3 mx-auto text-center '>Developer Insights</h1>
            <div className='flex md:flex-row flex-col md:m-3 m-2 justify-center'>
                <ProfileCard name='Madhusudan S' about='Assistant Professor' profilePhoto='https://srinivasuniverstrg.blob.core.windows.net/sit-faculty-images/Madhusudhan.jpg' socialLink='#' />
                <ProfileCard name='Adarsh S M' about='Student' profilePhoto='https://avatars.githubusercontent.com/u/120472249?v=4' socialLink='https://github.com/AdarshSavalagi' />
            </div>
        </div>
    )
}

