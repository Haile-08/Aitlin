import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import { PasswordRequest, PasswordReset, Signin, Success } from '../pages';

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
      path: '/password/reset',
      element: <PasswordReset/>,
      errorElement: <ErrorPage />,
    },
    {
      path: '/success',
      element: <Success/>,
      errorElement: <ErrorPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default Routes;