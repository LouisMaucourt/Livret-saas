
import { useIsOwner } from '../hooks/userRole';
import { Phone } from './Phone'

export const ConditionalPhone = ({ children }: { children: React.ReactNode }) => {
    const isOwner = useIsOwner()
    return isOwner
        ? <Phone>{children}</Phone>
        : <div className="flex flex-col min-h-screen">{children}</div>
}