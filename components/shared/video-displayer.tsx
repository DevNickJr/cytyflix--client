import { useEffect, useState } from "react";

export default function VideoDisplayer({ src }: { src: string }) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        async function loadVideo() {
            try {
                const response = await fetch(src);
                const blob = await response.blob();
                const localUrl = URL.createObjectURL(blob);
                setBlobUrl(localUrl);
            } catch (error) {
                console.error("Video load failed", error);
            }
        }
        loadVideo();

        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [src]);

    if (!blobUrl) return <div className="w-full aspect-video bg-gray-100 animate-pulse rounded-lg" />;

    return (
        <video
            src={blobUrl}
            controls
            className="w-full rounded-lg aspect-video"
            preload="metadata"
        />
    );
}
