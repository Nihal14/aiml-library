import React from 'react'

export default function ProfileCard(props) {
    return (
        <div className="w-full mt-3 md:mt-0 md:ml-3 mx-auto md:mx-2 max-w-sm bg-white border border-gray-200 rounded-lg shadow  dark:border-gray-700">
            <div className="flex flex-col items-center pb-10 mt-6">
                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src={props.profilePhoto} alt={`${props.name} image`} />
                <h5 className="mb-1 text-xl font-medium text-gray-900 ">{props.name}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-500">{props.about}</span>
                <div className="flex mt-4 md:mt-6">
                    <a href={props.socialLink} target='_blank' className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Github</a>
                </div>
            </div>
        </div>
    )
}
