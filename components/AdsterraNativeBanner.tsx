import Script from 'next/script';

interface AdsterraNativeBannerProps {
    className?: string;
}

export default function AdsterraNativeBanner({ className = "" }: AdsterraNativeBannerProps) {
    return (
        <div className={`w-full my-4 ${className}`}>
            {/* Native Banner Adstera */}
            <Script
                async
                data-cfasync="false"
                src="//weptnastyturmoil.com/17ff9c6569cbd48e106a4c3250b9972f/invoke.js"
                strategy="afterInteractive"
            />
            <div id="container-17ff9c6569cbd48e106a4c3250b9972f"></div>
        </div>
    );
}