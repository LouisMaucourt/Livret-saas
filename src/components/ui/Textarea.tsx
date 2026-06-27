import React from 'react'
type TextareaProps = React.InputHTMLAttributes<HTMLTextAreaElement>

export const Textarea = (props:TextareaProps) => {
  return (
    <textarea rows={5} {...props} className={`border border-gray-200 p-2.5 ${props.className}`} >Textarea</textarea>
  )
}
