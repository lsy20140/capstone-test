import React from 'react'
import { Outlet } from 'react-router-dom'
import StartScene from './pages/StartScene'

export default function App() {
  return (
    <>
      <Outlet />
    </>
  )
}
