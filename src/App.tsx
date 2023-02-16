import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Views/Home2';
import Transfer from './Views/Transfer';
import './App.css';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: "transfer",
      element: <Transfer />
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
