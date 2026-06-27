interface PhoneProps {
    children: React.ReactNode
    className?: string;
}

export const Phone = ({ children, className }: PhoneProps) => {
    return (
        <div className={`flex items-center justify-center p-6 ${className} scale-110`}>
            <div className="relative w-[340px] h-[750px] rounded-[42px] border-[10px] border-black bg-black shadow-xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20" />
                <div className="w-full h-full rounded-[32px] bg-white overflow-y-auto flex flex-col text-black no-scrollbar">
                    <div className="flex flex-col w-full h-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}