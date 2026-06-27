import { useUser } from "@/userContext";
import { X } from "lucide-react";
import React, { useState } from "react";
import { createPortal } from "react-dom"
type DialogProps = {
    trigger?: React.ReactNode;
    title: string;
    defaultOpen?: boolean;
    children: (props: { close: () => void }) => React.ReactNode;
};

export const Dialog = ({ trigger, title, defaultOpen = false, children }: DialogProps) => {
    const { user } = useUser()
    const [open, setOpen] = useState(defaultOpen)

    const handleDialog = () => {
        setOpen((prev) => !prev);
    };

    const close = () => setOpen(false);

    return (
        <>
            {user?.role !== "guest" && (
                <div className="z-20">
                    <div onClick={handleDialog}>
                        {trigger}
                    </div>

                    {open &&
                        createPortal(
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <div
                                    onClick={handleDialog}
                                    className="absolute inset-0 bg-black/30"
                                />

                                <div className="relative z-10 w-[500px] rounded-2xl bg-white p-6 shadow-2xl">
                                    <button onClick={handleDialog} className="absolute right-3 top-3">
                                        <X size={20} />
                                    </button>

                                    <h2 className="text-xl font-bold">{title}</h2>
                                    <div className="w-full h-0.5 bg-gray-100 mb-4" />

                                    {children({ close })}
                                </div>
                            </div>,
                            document.body
                        )}
                </div>
            )}
        </>
    )
};