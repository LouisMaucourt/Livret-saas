import { ReactQRCode, ReactQRCodeRef } from '@lglab/react-qr-code';
import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
type Client = {
    id: string
    name: string
    property_id: string
    is_active: boolean
    created_at: string
    qr_token: string
}
type Props = {
    client: Client
}

export const ClientQrCode = ({ client }: Props) => {
    const ref = useRef<ReactQRCodeRef>(null)

    const handleDownload = () => {
        ref.current?.download({
            name: `${client.name}-qrcode`,
            format: 'png',
            size: 1000,
        })
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <ReactQRCode
                ref={ref}
                value={`/scan?token=${client.qr_token}`}
                size={250}
                marginSize={2}
                finderPatternInnerSettings={{ style: 'leaf-lg', color: '#4267B2' }}
                finderPatternOuterSettings={{ style: 'leaf-lg', color: '#4267B2' }}
            />
            <Button onClick={handleDownload}>Télécharger PNG</Button>
        </div>
    )
}