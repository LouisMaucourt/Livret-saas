export const NavSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="mt-3">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-black/35 px-2 mb-1">
            {label}
        </p>
        {children}
    </div>
)