import cookie from 'react-cookies';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import { useEffect, useReducer, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, } from 'react-router-dom';

import './App.css';
import MyUserReducer from './reducers/MyUserReducer';
import { MyChatBoxContext, MyDispatchContext, MyReceiverContext, MyUserContext } from './configs/Contexts';

import Home from './components/Home/home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Profile from './components/Profile/Profile';
import rolesAndStatus from './utils/rolesAndStatus';
import Login from './components/Authenticate/Login';
import Register from './components/Authenticate/Register';
import ProtectedRoute from './components/Authorization/ProtectedRoute ';
import ApplicationsWatchList from './components/Profile/ApplicationsWatchList';

import JobForm from './components/Job/JobForm';
import JobPage from './components/JobPage/JobPage';
import FindJob from './components/FindJob/FindJob';
import JobDetail from './components/JobDetail/JobDetail';
import JobApplicationForm from './components/Job/JobApplicationForm';

import ListCompany from './components/Company/ListCompany';
import FindCompany from './components/FindCompany/FindCompany';
import DetailCompany from './components/Company/DetailCompany';

import ApplicationList from './components/Application/ApplicationList';
import ApplicationDetail from './components/Application/ApplicationDetail';

import ChatBox from './components/Chat/ChatBox';
import Review from './components/Review/Review';
import JobWatchList from './components/Profile/JobWatchList';
import UpdateProfile from './components/Profile/UpdateProfile';
import CompanyInfo from './components/Profile/CompanyInfor';
import { authApis, endpoints } from './configs/APIs';

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, cookie.load('user') || null);
  const [avatar, setAvatar] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiver, setReceiver] = useState(null);
  useEffect(() => {
    setLoading(true);
    const token = cookie.load("token");
    if (token) {
      authApis().get(endpoints['infor']).then(res => { dispatch({ type: 'update_user', payload: res.data }) }).catch(err => {

        dispatch({ type: 'logout' });
      });
    } else {
      dispatch({ type: 'logout' });
    }
    setLoading(false);
  }, [])

  return (
    <>
      <head >
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css' rel='stylesheet' />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"></link>
        <script src="https://kit.fontawesome.com/7c8192a424.js" crossorigin="anonymous"></script>

      </head>
      {!loading && <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MyChatBoxContext.Provider value={{ isOpen, setIsOpen }}>
            <MyReceiverContext.Provider value={{ receiver, setReceiver }}>
              <BrowserRouter>
                <div className="App">
                  <Header />
                  <Routes>

                    <Route path='/' element={<Home />} />

                    {/* <Route path='/about' element={<About />} /> */}
                    <Route path='/contact' element={<Home />} />
                    {/* <Route path='/jobs' element={<JobPage />} />
                     */}
                    <Route path='/jobs' element={<FindJob />} />
                    <Route path='/company' element={<FindCompany />} />
                    <Route path='/detail-job/:id' element={<JobDetail />} />
                    <Route path='/company' element={<ListCompany />} />
                    <Route path='/detail-company/:id' element={<DetailCompany />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/forget-password' element={<Home />} />
                    <Route path='/review' element={<Review />} />
                    <Route path='/company/job-form' element={
                      <ProtectedRoute allowedRoles={[rolesAndStatus.company]}>
                        <JobForm />
                      </ProtectedRoute>
                    } />
                    <Route path='/jobs/apply/:jobId' element={
                      <ProtectedRoute allowedRoles={[rolesAndStatus.candidate]}>
                        <JobApplicationForm />
                      </ProtectedRoute>
                    } />
                    <Route path='/company/applications' element={
                      <ProtectedRoute allowedRoles={[rolesAndStatus.company]}>
                        <ApplicationList />
                      </ProtectedRoute>
                    } />
                    <Route path='/company/applications/:id' element={
                      <ProtectedRoute allowedRoles={[rolesAndStatus.company]}>
                        <ApplicationDetail />
                      </ProtectedRoute>
                    } />
                    <Route path='/company/profile'
                      element={
                        <ProtectedRoute allowedRoles={[rolesAndStatus.company]}>
                          <CompanyInfo />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path='/candidate/profile'
                      element={
                        <ProtectedRoute allowedRoles={[rolesAndStatus.candidate]}>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route path='/candidate/profile/applications'
                      element={
                        <ProtectedRoute allowedRoles={[rolesAndStatus.candidate]}>
                          <ApplicationsWatchList />
                        </ProtectedRoute>
                      }
                    />
                    <Route path='/candidate/profile/update' element={
                      <ProtectedRoute allowedRoles={[rolesAndStatus.candidate]}>
                        <UpdateProfile />
                      </ProtectedRoute>
                    } />

                    <Route path='/company/profile/job-list' element={
                      <ProtectedRoute allowedRoles={[rolesAndStatus.company]}>
                        <JobWatchList></JobWatchList>
                      </ProtectedRoute>
                    } />
                  </Routes>

                  {/* </Container> */}

                  <ToastContainer
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                  />
                  {user && isOpen && <ChatBox user={user} receiver={receiver} />}

                  <Footer />
                </div>
              </BrowserRouter>
            </MyReceiverContext.Provider>
          </MyChatBoxContext.Provider>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>}

    </>

  );
}

export default App;
