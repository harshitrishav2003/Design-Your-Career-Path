import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SignInPage from './auth/sign-in/index.jsx'
import Home from './home/index.jsx'
import Dashboard from './dashboard/index.jsx'
import EditResume from './dashboard/resume/[resumeId]/edit/index.jsx'
import ViewResume from './my-resume/[resumeId]/view/index.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

import { AuthProvider } from "./context/AuthContext";
import AboutUs from './components/custom/AboutUs.jsx'
import AdminDashboard from './components/custom/adminDashboard.jsx'
// eslint-disable-next-line no-sparse-arrays
const router=createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    element:<App/>,
    children:[
      {
        path:'/dashboard',
        element:<Dashboard/>
      },
      {
        path:'/dashboard/resume/:resumeId/edit',
        element:<EditResume/>
      },
    ]
  },
 ,
  {
    path:'/auth/sign-in',
    element:<SignInPage/>
  },
  {
    path:'/my-resume/:resumeId/view',
    element:<ViewResume/>
  },
  {
    path:'/about-us',
    element:<AboutUs/>
  },
  {
    path:'/admin',
    element:<AdminDashboard/>
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId="1099267585209-98kfrssmojtdut61hmh9gune2o5umltc.apps.googleusercontent.com">
     <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
