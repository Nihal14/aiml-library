import React, { useState, useEffect } from 'react';
import Loading from './loading';
import {
  Html5QrcodeScanner,
  Html5QrcodeScanType,
  Html5QrcodeSupportedFormats
} from 'html5-qrcode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../Components/AlertMessage';


export default function AdminRoute() {

  // Hooks
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [reissueDetails, setReissueDetails] = useState({});
  const [buttonLoader, setButtonLoader] = useState([false, false, { 'message': '', 'color': '' }]);
  const [reissueButton, setReissueButton] = useState([false, false, false]);
  const [fine, setFine] = useState('');
  const [rstatus, setRStatus] = useState([false]);
  const [bid, setBid] = useState('');
  const [sid, setSid] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        };

        const response = await axios.get('https://librarybackend.aldoiris.online/api/admin/', { headers });

        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Token refresh
          try {
            const refresh_data = {
              'refresh': `${localStorage.getItem('refresh')}`
            };
            const refreshResponse = await axios.post('https://librarybackend.aldoiris.online/api/token/refresh/', refresh_data);
            localStorage.setItem('access', refreshResponse.data.access);
          } catch (refreshError) {
            console.warn(refreshError);
            navigate('/');
          }
        } else {
          console.warn(error);
          navigate('/admin-dashboard');
        }
      }
    };

    fetchData();
  }, []);

  const performAdminAction = async (type, bid, sid, fine = 0) => {
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('access')}`
      };

      const data = { type, bid, sid, fine };
      const response = await axios.post('https://librarybackend.aldoiris.online/api/admin/', data, { headers });

      if (type === '0') {
        if (response.data.color === 'yellow') {
          setReissueButton([true, true, true, response.data.message]);
        } else {
          setReissueDetails(response.data);
          setReissueButton([true, true, false]);
        }
      } else {
        setReissueButton([true, true, false]);
        setRStatus([true, { 'color': response.data.color, 'message': response.data.message }]);
      }
    } catch (error) {
      setReissueButton([true, true, true, error.response?.data.message || error.message]);
      setRStatus([true, { 'color': error.response?.data.color || 'red', 'message': error.response?.data.message || error.message }]);
    }
  };

  const issueBook = (e) => {
    e.preventDefault();
    performAdminAction('1', bid, sid);
  };

  const handleFetchDetails = (e) => {
    e.preventDefault();
    performAdminAction('0', bid);
  };

  const reissue = (e) => {
    e.preventDefault();
    performAdminAction('2', bid, undefined, fine);
  };

  const returnBook = (e) => {
    e.preventDefault();
    performAdminAction('3', bid, undefined, fine);
  };

  // Bar Code Scanner Start
  const [scannerInstance, setScannerInstance] = useState(null);
  const [isScanning1, setIsScanning1] = useState(false);
  const [isScanning2, setIsScanning2] = useState(false);

  const startScanner = (num) => {
    if (num === 1) {
      console.log(isScanning1);
      const scanner = new Html5QrcodeScanner('reader1', {
        fps: 2,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], rememberLastUsedCamera: true,
        formatsToSupport: [Html5QrcodeSupportedFormats.CODE_39],
      });
      scanner.render(success1, error);
      setScannerInstance(scanner);
    } else if (num === 2) {
      console.log(isScanning2);
      const scanner = new Html5QrcodeScanner('reader2', {
        fps: 2,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], rememberLastUsedCamera: true,
        formatsToSupport: [Html5QrcodeSupportedFormats.CODE_39]
      });
      scanner.render(success2, error);
      setScannerInstance(scanner);
      console.log('working scanner ', isScanning2);
    } else if (num === 3) {
      console.log(isScanning1);
      const scanner = new Html5QrcodeScanner('reader3', {
        fps: 2,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], rememberLastUsedCamera: true,
        formatsToSupport: [Html5QrcodeSupportedFormats.CODE_39],
      });
      scanner.render(success1, error);
      setScannerInstance(scanner);
    }

  };

  const success1 = (result) => {
    if (!isScanning1) {
      console.log(result);
      setBid(result);
      document.getElementById('close1').click();
    }
    console.log(isScanning1);
  }
  const success2 = (result) => {
    if (!isScanning2) {
      console.log(result);
      setSid(result);
      document.getElementById('close1').click();
    }
  }
  const error = (result) => {
    console.warn(result);
  }

  const closeScanner = () => {
    if (scannerInstance) {
      scannerInstance.clear();
      setScannerInstance(null);
      setIsScanning1(false);
      setIsScanning2(false);
    }
  };
  // Bar Code Scanner End



  return !loading ? (
    <>
      <div className="card w-11/12 mx-auto bg-base-100 shadow-xl my-3">

        {/* stats Display start */}
        <div className="card-body">
          <h3>Stats</h3>
          <div className="stats shadow">

            <div className="stat">
              <div className="stat-title">Fine Collected</div>
              <div className="stat-value text-primary">₹ {dashboardData.user.fine_collected}</div>
              <div className="stat-desc">This month</div>
            </div>

            <div className="stat">
              <div className="stat-title">Books Issued</div>

              <div className="stat-value text-secondary">{dashboardData.user.book_issued}</div>
              <div className="stat-desc">This month</div>
            </div>

          </div>
        </div>
        {/* stats Display end */}

        {/* Issue and Reissue Button Start */}
        <div className="container flex flex-row justify-around mb-3 ">
          <button className="btn text-xs" onClick={() => document.getElementById('IssueBookModal').showModal()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12H20" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Issue Book
          </button>
          <button className="btn text-xs" onClick={() => document.getElementById('ReissueModal').showModal()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4V20" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12H20" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Return/Reissue
          </button>
        </div>
        {/* Issue and Reissue Button End  */}

        {/* Modal for Issue Book Start */}
        <dialog id="IssueBookModal" className="modal">

          <div className="modal-box">
            <div className="modal-action mt-0">
              <form method="dialog">
                <button className="btn  btn-circle" onClick={() => { setButtonLoader([false, false, { 'message': '', 'color': '' }]); setBid(''); setSid(''); }}>X</button>
              </form>
            </div>
            <form onSubmit={issueBook}>
              <div className="join my-2">
                <div>
                  <div>
                    <input className="input input-bordered join-item" placeholder="Book ID" value={bid} onChange={(e) => { setBid(e.target.value) }} />
                  </div>
                </div>
                <div className="indicator">
                  {!isScanning1 ? <button disabled={isScanning2} className="btn join-item" onClick={(w) => { w.preventDefault(); setIsScanning1(true); startScanner(1); }}>Scan</button> :
                    <button className="btn join-item" onClick={(w) => { w.preventDefault(); closeScanner(); }}>close</button>
                  }</div>
              </div>

              <button onClick={(e) => { e.preventDefault(); closeScanner(); }} className='hidden' id='close1'> </button>
              <div id='reader1'></div>
              <div className="join my-2">
                <div>
                  <div>
                    <input className="input input-bordered join-item" placeholder="Student ID" value={sid} onChange={(e) => { setSid(e.target.value) }} />
                  </div>
                </div>
                <div className="indicator">
                  {!isScanning2 ? <button disabled={isScanning1} className="btn join-item" onClick={(w) => { w.preventDefault(); setIsScanning2(true); startScanner(2); }}>Scan</button> :
                    <button className="btn join-item" onClick={(w) => { w.preventDefault(); closeScanner(); }}>close</button>
                  }</div>
              </div>
              <div id='reader2' ></div>

              <br />
              {buttonLoader[1] ? (
                <>
                  <AlertMessage color={buttonLoader[2].color} message={buttonLoader[2].message} />
                </>
              ) : (
                <button className={`my-2 btn ${buttonLoader[0] ? 'btn-disabled' : ''}`} onClick={() => { setButtonLoader([true, false], buttonLoader[2]) }}>{buttonLoader[0] ? (<>'Issuing Book' <span className="loading loading-dots loading-xs"></span></>) : 'Issue Book'}</button>
              )
              }
            </form>

          </div>
        </dialog>
        {/* Modal for Issue Book End */}

        {/* Modal for Reissue Book Start */}
        <dialog id="ReissueModal" className="modal">
          <div className="modal-box">
            <div className="modal-action mt-0">
              <form method="dialog">
                <button className="btn  btn-circle" onClick={() => { setBid(''); setSid(''); setReissueButton([false, false, false]); setRStatus([false]); }}>X</button>
              </form>
            </div>
            <form onSubmit={handleFetchDetails}>
              <div className="join my-2">
                <div>
                  <div>
                    <input className="input input-bordered join-item" placeholder="Book ID" value={bid} onChange={(e) => { setBid(e.target.value) }} />
                  </div>
                </div>
                <div className="indicator">
                  {!isScanning1 ? <button className="btn join-item" onClick={(w) => { w.preventDefault(); setIsScanning1(true); startScanner(3); }}>Scan</button> :
                    <button className="btn join-item" onClick={(w) => { w.preventDefault(); closeScanner(); }}>close</button>
                  }</div>
              </div>
              <div id='reader3'></div>
              {!reissueButton[2] ? !reissueButton[0] ? (
                <>
                  <button type='submit' onClick={() => { setReissueButton([false, true, false]); }} className={`btn join-item ${reissueButton[1] ? 'btn-disabled' : ''}`}>{reissueButton[1] ? (<>Fetching details <span className="loading loading-dots loading-xs"></span></>) : 'Fetch Details'}</button>
                </>
              ) : <>
                <div>
                  <h1>
                    Details
                  </h1>
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Student ID</th>
                          <th>Book ID</th>
                          <th>Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{reissueDetails.data.student.user.username}</td>
                          <td>{reissueDetails.data.book}</td>
                          <td>{reissueDetails.data.due_date}</td>
                        </tr>
                      </tbody>
                    </table>
                    <input className="input input-bordered join-item my-3 " placeholder="Fine if any..." value={fine} onChange={(e) => { setFine(e.target.value) }} />
                  </div>
                </div>
                {rstatus[0] ? <AlertMessage color={rstatus[1].color} message={rstatus[1].message} /> : <>
                  <button className='mr-2 mx-2 btn' onClick={reissue}>Reissue Book</button>
                  <button className='m-2 btn' onClick={returnBook}>Return</button>
                </>}
              </> : <>
                <AlertMessage message={reissueButton[3]} />
              </>}
            </form>

          </div>
        </dialog>
        {/* Modal for Reissue Book End */}

        {/* Admin Book Stats Start */}
        <div className="overflow-x-auto  max-h-screen md:h-64 w-11/12 mx-auto">
          <h1 className='text-lg font-bold'>Books issued so far</h1>
          <table className="table-zebra table table-base table-pin-rows ">
            <thead>
              <tr>
                <th></th>
                <td>Book ID</td>
                <td>Student ID</td>
                <td>Sem</td>
                <td>Fine</td>
                <td>Issued date</td>
              </tr>
            </thead>
            <tbody >


              {dashboardData.books.map((data, index) =>

                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{data.book}</td>
                  <td>{data.student.user.username}</td>
                  <td>{data.student.sem_display}</td>
                  <td>{data.fine}</td>
                  <td>{data.issued_on}</td>

                </tr>
              )}


            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <td>Book ID</td>
                <td>Student ID</td>
                <td>Sem</td>
                <td>Fine</td>
                <td>Issued date</td>


              </tr>
            </tfoot>
          </table>
        </div>
        {/* Admin Book Stats End */}

      </div>
    </>
  ) : (
    <Loading />
  )
}




