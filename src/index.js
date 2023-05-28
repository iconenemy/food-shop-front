import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter} from 'react-router-dom'
import { theme } from './components/Theme'


import App from './App';
import { ThemeProvider } from '@emotion/react';
import Store from './store/store';


const store = new Store()
const StoreContext = createContext({store})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <StoreContext.Provider value={{store}}>
          <App />
        </StoreContext.Provider>
      </ThemeProvider>
    </BrowserRouter>
);

export default StoreContext
