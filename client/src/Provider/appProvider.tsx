import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from '../stores/store';
import { Provider } from 'react-redux';

const queryClient = new QueryClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AppProvider({ children }: any) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          {children}
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default AppProvider;