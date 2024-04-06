import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import { AddService, AdminDashboard, PasswordRequest, PasswordReset, Signin, Success } from '../pages';

function ErrorPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError();
  
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

function Routes() {
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
      element: <AdminDashboard/>,
      errorElement: <ErrorPage />,
    },
    {
      path: '/Admin/Dashboard/Add/Service',
      element: <AddService/>,
      errorElement: <ErrorPage />,
    }
  ]);
  return <RouterProvider router={router} />;
}

export default Routes;