import React, { Children } from 'react'

type InfoSectionPros = {
    title: string,
    children:React.ReactNode
}

export const InfoSection = ({title, children}: InfoSectionPros) => {
  return (
      <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{title}</p>
         {children}
      </div>
  )
}
