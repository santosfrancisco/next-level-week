import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify'
import App from './App';
import Globalstyle from './components/Globalstyle';
import 'normalize.css'
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <React.StrictMode>
    <Globalstyle />
    <App />
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById('root')
);
