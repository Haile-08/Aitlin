import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from '../stores/store';
import { Provider } from 'react-redux';

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  },
});

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