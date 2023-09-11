import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Table from "./Table";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Table M={8} N={2} X={2}/>
  </React.StrictMode>
);
