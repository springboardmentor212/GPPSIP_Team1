import React from 'react'
import { RouterProvider } from 'react-router'
import router from './app.routes'
import AuthProvider from './context/auth.context'

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
