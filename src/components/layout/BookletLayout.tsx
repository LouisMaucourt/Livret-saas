import React from 'react'
import { Outlet } from 'react-router';
import Dashboard from './Dashboard';
import { ClientLayout } from './ClientLayout';
import { Phone } from './Phone';
import { useIsOwner } from '../hooks/userRole';

export const BookletLayout = () => {
  const isOwer = useIsOwner()
  return (
    <div className={isOwer ? `flex h-full justify-center items-center` : 'flex flex-col h-full'}>
        <Outlet />
    </div>
  )
}
