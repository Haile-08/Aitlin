import { store } from '../stores/store';
import { Provider } from 'react-redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AppProvider({ children }: any) {
  return (
    <>
      <Provider store={store}>
        {children}
      </Provider>
    </>
  );
}

export default AppProvider;