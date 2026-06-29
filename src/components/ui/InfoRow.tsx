import { LucideIcon } from "lucide-react";

type InfoRowProps = {
    icon?: LucideIcon;
    nameRow?: string;
    valueRow: string |null;
    classNameIcon?:string
};
export const InfoRow = ({ icon: Icon, nameRow, valueRow, children, classNameIcon }: InfoRowProps & { children?: React.ReactNode }) => {
    return (
        <div className="min-h-8 flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2 text-sm">
            <div className="flex items-center gap-2 flex-1">
                {Icon && <Icon className={`w-4 h-4 text-gray-400 shrink-0 ${classNameIcon}`} />}
                {nameRow && <span className="text-xs text-gray-400 flex-1 capitalize">{nameRow}</span>}
                <span className="font-medium">{valueRow}</span>
            </div>
            {children}
        </div>
    );
};