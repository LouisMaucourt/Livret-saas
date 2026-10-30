interface PhoneProps {
	children: React.ReactNode;
	className?: string;
}

export const Phone = ({ children, className = "" }: PhoneProps) => {
	return (
		<div
			className={`min-h-screen md:min-h-0 md:h-full md:flex md:items-center md:justify-center md:p-6 ${className}`}
		>
			<div
				className="relative w-full min-h-screen bg-white
				md:w-[380px] md:h-[850px] md:min-h-0 md:rounded-[42px] md:border-[10px] md:border-black md:bg-black md:shadow-xl md:overflow-hidden"
			>
				<div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20" />

				<div className="w-full min-h-screen md:min-h-0 md:h-full md:rounded-[32px] bg-white md:overflow-y-auto flex flex-col text-black no-scrollbar">
					<div className="flex flex-col w-full md:h-full">{children}</div>
				</div>
			</div>
		</div>
	);
};
