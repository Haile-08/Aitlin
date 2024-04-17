import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import { AddService, AdminDashboard, Bill, Binnacle, ClientBill, ClientBinnacle, ClientDocument, ClientNurses, Documents, ManyClient, Nurses, PasswordRequest, PasswordReset, Signin, Success } from '../pages';
import { useSelector } from 'react-redux';
import errorImage from '../assets/error.svg';

function ErrorPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError();
  
  return (
    <div id="error-page" className='w-dvw h-dvh flex justify-center items-center flex-col'>
      <img src={errorImage} alt="error" className='w-[30%]'/>
      <p className='font-thin text-3xl mt-7 font-roboto'>
        Error: {error.statusText || error.message}
      </p>
    </div>
  );
}

function Routes() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Signin/>,
      errorElement: <ErrorPage />,
    },
    {
      path: '/password/request',
      element: <PasswordRequest/>,
      errorElement: <ErrorPage />,
    },
    {
      path: '/password/reset/:token/:id',
      element: <PasswordReset/>,
      errorElement: <ErrorPage />,
    },
    {
      path: '/password/request/success',
      element: <Success link={'/'} info={'Email has been sent to you.please reset your password'}/>,
      errorElement: <ErrorPage />,
    },
    {
      path: '/password/reset/success',
      element: <Success link={'/'} info={'Password successfully changed. click on the button to go back to home page and login.'}/>,
      errorElement: <ErrorPage />,
    },
    {
      path: '/Admin/Dashboard',
      element: token ? <AdminDashboard/> : <Navigate to="/" /> ,
      errorElement: <ErrorPage />,
    },
    {
      path: '/Admin/Dashboard/Add/Service',
      element: token ? <AddService/> : <Navigate to="/" />  ,
      errorElement: <ErrorPage />,
    },
    {
      path: '/Admin/Dashboard/Documents',
      element:token ? <Documents/> : <Navigate to="/" />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "bill/",
          element: <Bill />,
        },
        {
          path: "Binnacle/",
          element: <Binnacle />,
        },
        {
          path: "Nurses/",
          element: <Nurses />,
        },
      ],
    },
    {
      path: '/Client',
      element:token ? <ManyClient/> : <Navigate to="/" />,
      errorElement: <ErrorPage />,
    },
    {
      path: '/Client/Documents',
      element:token ? <ClientDocument/> : <Navigate to="/" />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "bill/",
          element: <ClientBill />,
        },
        {
          path: "Binnacle/",
          element: <ClientBinnacle />,
        },
        {
          path: "Nurses/",
          element: <ClientNurses />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default Routes;