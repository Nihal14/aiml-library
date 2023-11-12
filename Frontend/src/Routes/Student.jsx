import React, { useEffect, useState } from 'react'
import Barcode from 'react-barcode';
import { useNavigate } from 'react-router-dom';
import Loading from './loading';
import axios from 'axios';

export default function StudentMainRoute() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        "user": {
            "id": null,
            "user": {
                "id": null,
                "username": null,
                "first_name": null,
                "last_name": null,
                "email": null
            },
            "sem_display": null
        },
        "book_history": [],
        "book_issued": [],
    });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const headers = {
              Authorization: `Bearer ${localStorage.getItem('access')}`,
            };
            const response = await axios.get(
              'https://librarybackend.aldoiris.online/api/student/',
              { headers }
            );
            setDashboardData(response.data);
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
              try {
                const refreshData = {
                  refresh: localStorage.getItem('refresh'),
                };
                const refreshResponse = await axios.post(
                  'https://librarybackend.aldoiris.online/api/token/refresh/',
                  refreshData
                );
                localStorage.setItem('access', refreshResponse.data.access);
                setIsLoading(false);
                return;
              } catch (refreshError) {
                console.warn(refreshError);
                navigate('/');
              }
            }
    
            console.error('API Request Error:', error);
            // Handle other error cases or provide user feedback
          }
    
          setIsLoading(false);
        };
    
        if (localStorage.getItem('access')) {
          fetchData();
        } else {
          setIsLoading(false);
        }
      }, [navigate]);
      
    const handleLogout = (e) => {
        e.preventDefault;
        localStorage.clear();
        navigate('/');
    }
    return <>
        {
            isLoading ? (
                <>
                    <Loading />
                </>
            ) : (
                <section className='container '>
                    <div className='md:flex flex-col'>
                        <div className=' md:w-4/5 md:flex flex-row mx-auto'>
                            <div className="m-3 card md:w-1/2 bg-base-100 shadow-xl ">
                                <div className="card-body ">
                                    <div className="card-actions justify-end">
                                        <button className="btn btn-square btn-sm tooltip" data-tip="Logout" onClick={handleLogout}>
                                            <svg className='pl-2' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15 17.625C14.9264 19.4769 13.3831 21.0494 11.3156 20.9988C10.8346 20.987 10.2401 20.8194 9.05112 20.484C6.18961 19.6768 3.70555 18.3203 3.10956 15.2815C3 14.723 3 14.0944 3 12.8373L3 11.1627C3 9.90561 3 9.27705 3.10956 8.71846C3.70555 5.67965 6.18961 4.32316 9.05112 3.51603C10.2401 3.18064 10.8346 3.01295 11.3156 3.00119C13.3831 2.95061 14.9264 4.52307 15 6.37501" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M21 12H10M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>


                                        </button>
                                    </div>
                                    <div className="avatar">
                                        <div className="w-24 rounded-full mx-auto ring ring-neutral ring-offset-base-100 ring-offset-2">
                                            <img src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg" />
                                        </div>
                                    </div>
                                    <h2 className="mx-auto my-0.5 card-title">{`${dashboardData.user.user.first_name}`}</h2>
                                    <div className="mx-auto badge badge-neutral gap-2">
                                        Student
                                    </div>
                                    <h5 className='mx-auto'>{dashboardData.user.sem_display} </h5>
                                    <h4 className=" mx-auto">
                                        <Barcode value={`${dashboardData.user.user.username}`} format='CODE39' width={1.5} height={50} />

                                    </h4>
                                </div>
                            </div>
                            {/* second card */}
                            <div className="m-3 card md:w-1/2 bg-base-100 shadow-xl">
                                <div className="card-body max-h-screen md:h-64">
                                    <h2 className="card-title">Books Issued</h2>

                                    <div className="overflow-x-auto">
                                        <table className="table-zebra table table-base table-pin-rows table-pin-cols">
                                            {/* head */}
                                            <thead>
                                                <tr>
                                                <th>Book ID</th>
                                                    <th>Due date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardData.book_issued.length != 0 ?
                                                    dashboardData.book_issued.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>{data.book}</td>
                                                            <td>{data.due_date}</td>
                                                        </tr>
                                                    )) : (
                                                        <tr>
                                                            <th>nothing to show here</th>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='md:w-4/5 mx-auto'>
                            <div className="m-3 card  bg-base-100 shadow-xl">
                                <div className="card-body max-h-screen md:h-5/6">
                                    <h2 className="card-title">Books History</h2>
                                    <div className="overflow-x-auto">
                                        <table className="table-zebra table table-base table-pin-rows table-pin-cols">
                                            <thead>
                                                <tr>
                                                    <th>Book ID</th>
                                                    <th>Issued date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboardData.book_history.length != 0 ?

                                                    dashboardData.book_history.map((data, index) => (

                                                        <tr key={index}>
                                                            <td>{data.book}</td>
                                                            <td>{data.issued_on}</td>
                                                        </tr>
                                                    )) : (

                                                        <tr>
                                                            <th>nothing to show here</th>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
    </>
}
