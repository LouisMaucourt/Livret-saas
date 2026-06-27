import { Button } from '@/components/ui/Button';
import { useApi } from '@/hooks/useApi';
import { QrCodeApi } from '@/service/userApi';
import { useUser } from '@/userContext';
import { ReactQRCode, ReactQRCodeRef } from '@lglab/react-qr-code';
import { useRef } from 'react';
import { useParams } from 'react-router';
import { Loading } from '@/components/Loading';
import { Error } from '@/components/Error';


export const QrCode = () => {
    
    const { id } = useParams()
    const ref = useRef<ReactQRCodeRef>(null)
    console.log(ReactQRCode)
    const {  properties } = useUser()
    const p = properties[0]

    console.log(p)

    const handleDownload = () => {
        ref.current?.download({
            name: p.title + '-qrcode',
            format: 'png',
            size: 1000,
        })
    }

    return (
        <div className="flex justify-center items-center h-full flex-col">
            <ReactQRCode
                finderPatternInnerSettings={{
                    style: 'leaf-lg',
                    color: '#4267B2',
                }}
                finderPatternOuterSettings={{
                    style: 'leaf-lg',
                    color: '#4267B2',
                }}
                marginSize={2}
                size={400}
                ref={ref}
                value={`http://localhost:3000/scan?id=${id}`}
            />
            <Button onClick={handleDownload}>Download PNG</Button>
        </div>
    )
}
