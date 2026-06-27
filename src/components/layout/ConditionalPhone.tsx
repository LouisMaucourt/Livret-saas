
import { useIsOwner } from '../hooks/userRole';
import { Phone } from './Phone'

export const ConditionalPhone = ({ children }: { children: React.ReactNode }) => {
    const isOwner = useIsOwner()
    return isOwner ? <Phone>{children}</Phone> : <>{children}</>
}