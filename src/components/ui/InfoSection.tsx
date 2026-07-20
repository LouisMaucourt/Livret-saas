type InfoSectionPros = {
    className?:string
    title: string,
    children:React.ReactNode
}

export const InfoSection = ({title, children, className}: InfoSectionPros) => {
  return (
      <div className={`flex flex-col gap-2 ${className}`}>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{title}</p>
         {children}
      </div>
  )
}
