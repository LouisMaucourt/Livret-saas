import React from 'react'

type ContentInputProps = {
  children: React.ReactNode,
  className?:string
}
export const ContentInput = ({children, className}:ContentInputProps) => {
  return (
      <div className={`flex flex-col gap-1.5 ${className}`}>{children}</div>
  )
}
