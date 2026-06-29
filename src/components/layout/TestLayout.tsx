import React from 'react'
import { ClientLayout } from './ClientLayout';

export const TestLayout = ({ children }: {children:React.ReactNode}) => {
  return (
    <div className="w-full h-screen">
      {children}
    </div>
  )
}
