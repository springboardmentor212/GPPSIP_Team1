import React from 'react'
import { RouterProvider } from 'react-router'
import router from './app.routes'
import AuthProvider from './context/auth.context'
import { ToastProvider } from './hooks/useToast'

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
