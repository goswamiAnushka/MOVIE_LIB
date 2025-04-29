import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';  
import { GoogleOAuthProvider } from '@react-oauth/google';  // Google OAuth provider
import App from './App';
import store from './redux/store';  // Import your Redux store
import "react-toastify/dist/ReactToastify.css";

const clientId = "YOUR_GOOGLE_CLIENT_ID";  // Replace with your Google Client ID

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Provider store={store}>  {/* Wrap the app with the Redux Provider */}
      <GoogleOAuthProvider clientId={clientId}>  {/* Wrap with GoogleOAuthProvider */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </GoogleOAuthProvider>
    </Provider>

);
