import { ReactNode } from "react";


export default function BaseForm({children} : {children : ReactNode}) {
    return (
        <div style={{ maxWidth: 1000 }} className="w-full p-6 bg-white rounded-2xl border-solid">
            {children}
        </div>
    )
}