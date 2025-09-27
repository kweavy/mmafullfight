import Script from 'next/script';

interface AdsterraBannerProps {
    className?: string;
}

export default function AdsterraBanner({ className = "" }: AdsterraBannerProps) {
    return (
        <div className={`w-full flex justify-center my-4 ${className}`}>
            {/* Banner Adstera 728x90 */}
            <div className="max-w-full overflow-hidden">
                <Script
                    id="adstera-banner-config"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
              atOptions = {
                'key' : 'bf10227b0c62864d2cd4a5a2f8477de9',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            `,
                    }}
                />
                <Script
                    strategy="afterInteractive"
                    src="//weptnastyturmoil.com/bf10227b0c62864d2cd4a5a2f8477de9/invoke.js"
                />
            </div>
        </div>
    );
}