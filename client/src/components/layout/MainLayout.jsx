import React from 'react'
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
        <h2>Header</h2>
        <Outlet />
        <h2>Footer</h2>
    </>
  )
}

export default MainLayout