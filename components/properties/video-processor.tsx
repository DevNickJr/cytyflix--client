'use client';

import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { LoadingSpinner } from '../shared/loading-spinner';
import { toast } from 'sonner';

export interface VideoProcessorProps {
    file?: File;
    onProcessComplete?: (file: File) => void;
    onCancel?: () => void;
}

export default function VideoProcessor({ file, onProcessComplete, onCancel }: VideoProcessorProps) {
    const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [videoSrc, setVideoSrc] = useState<string | null>(file ? URL.createObjectURL(file) : null);
    const [videoFile, setVideoFile] = useState<File | null>(file || null);
    const [processing, setProcessing] = useState(false);
    const [outputSrc, setOutputSrc] = useState<string | null>(null);

    // Video metadata states
    const [duration, setDuration] = useState(0);
    const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

    // Cropping States (percentages relative to video dimensions)
    const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialCrop, setInitialCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Load FFmpeg binaries on mount
    useEffect(() => {
        loadFFmpeg();
    }, []);

    const loadFFmpeg = async () => {
        const ffmpegInstance = new FFmpeg();
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        await ffmpegInstance.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });

        setFfmpeg(ffmpegInstance);
        setLoaded(true);
    };

    // Handle file select
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setVideoSrc(URL.createObjectURL(file));
            setOutputSrc(null);
        }
    };

    // Extract dimensions and enforce max duration
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const vid = videoRef.current;
            setDuration(vid.duration);
            setVideoSize({ width: vid.videoWidth, height: vid.videoHeight });

            if (vid.duration > 60) {
                toast.info("Note: This video is longer than 60 seconds. It will be automatically trimmed to the first 60 seconds.");
            }
        }
    };

    // Mouse interaction logic for the overlay crop box
    const handleMouseDown = (e: React.MouseEvent, type: 'drag' | 'resize') => {
        e.preventDefault();
        if (type === 'drag') setIsDragging(true);
        if (type === 'resize') setIsResizing(true);

        setDragStart({ x: e.clientX, y: e.clientY });
        setInitialCrop({ ...crop });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging && !isResizing) return;
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
        const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

        if (isDragging) {
            let newX = initialCrop.x + deltaX;
            let newY = initialCrop.y + deltaY;

            // Bound checking
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;
            if (newX + initialCrop.width > 100) newX = 100 - initialCrop.width;
            if (newY + initialCrop.height > 100) newY = 100 - initialCrop.height;

            setCrop((prev) => ({ ...prev, x: newX, y: newY }));
        }

        if (isResizing) {
            let newWidth = initialCrop.width + deltaX;
            let newHeight = initialCrop.height + deltaY;

            // Bound checking
            if (newWidth < 10) newWidth = 10;
            if (newHeight < 10) newHeight = 10;
            if (initialCrop.x + newWidth > 100) newWidth = 100 - initialCrop.x;
            if (initialCrop.y + newHeight > 100) newHeight = 100 - initialCrop.y;

            setCrop((prev) => ({ ...prev, width: newWidth, height: newHeight }));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    // Process video using FFmpeg
    const processVideo = async () => {
        if (!ffmpeg || !videoFile) return;
        setProcessing(true);

        try {
            // Calculate pixel coordinates from crop percentages
            let cropWidth = Math.floor((crop.width / 100) * videoSize.width);
            let cropHeight = Math.floor((crop.height / 100) * videoSize.height);
            let cropX = Math.floor((crop.x / 100) * videoSize.width);
            let cropY = Math.floor((crop.y / 100) * videoSize.height);

            // Ensure even numbers for h264
            cropWidth = cropWidth % 2 === 0 ? cropWidth : cropWidth - 1;
            cropHeight = cropHeight % 2 === 0 ? cropHeight : cropHeight - 1;

            const inputName = 'input.mp4';
            const outputName = 'output.mp4';

            // Write file to FFmpeg virtual filesystem
            await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

            // Construct FFmpeg command flags:
            // -t 60 trims to 60 seconds max
            // -vf crop=w:h:x:y applies the spatial crop matrix
            await ffmpeg.exec([
                '-i', inputName,
                '-t', '60',
                '-vf', `crop=${cropWidth}:${cropHeight}:${cropX}:${cropY}`,
                '-c:a', 'copy',
                outputName
            ]);

            const data = await ffmpeg.readFile(outputName);

            // Create a clean, safe copy that doesn't reference SharedArrayBuffer
            const dataArray = Uint8Array.from(data as Uint8Array);

            const blob = new Blob([dataArray], { type: 'video/mp4' });
            setOutputSrc(URL.createObjectURL(blob));

            if (onProcessComplete) {
                const outName = videoFile.name.replace(/\.[^/.]+$/, "") + "-cropped.mp4";
                const processedFile = new File([blob], outName, { type: 'video/mp4' });
                onProcessComplete(processedFile);
            }
        } catch (error) {
            console.error("FFmpeg execution error:", error);
            toast.error("Error processing video.");
        } finally {
            setProcessing(false);
        }
    };

    if (!loaded) return <div className="text-center p-4 py-8"><LoadingSpinner /></div>;

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {!file && (
                <div className="flex flex-col items-center border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50">
                    <input type="file" accept="video/*" onChange={handleFileChange} className="mb-2" />
                    <p className="text-xs text-gray-500">Upload any video configuration to trim and crop</p>
                </div>
            )}

            {onCancel && (
                <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700 underline">
                    Cancel processing
                </button>
            )}

            {videoSrc && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">1. Adjust Crop Area & Preview Max 60s</h3>

                    {/* Cropper UI Wrapper */}
                    <div className="flex justify-center bg-gray-50 rounded p-2 border">
                        <div
                            ref={containerRef}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className="relative select-none overflow-hidden rounded bg-black"
                        >
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                onLoadedMetadata={handleLoadedMetadata}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-auto h-auto max-w-full max-h-[500px] block object-contain"
                            />

                        {/* Absolute Transparent Dim Overlay Layer */}
                        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                        {/* Clear Crop Target Box Area */}
                        <div
                            style={{
                                position: 'absolute',
                                left: `${crop.x}%`,
                                top: `${crop.y}%`,
                                width: `${crop.width}%`,
                                height: `${crop.height}%`,
                                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                            }}
                            className="border-2 border-emerald-400 absolute cursor-move flex items-center justify-center"
                            onMouseDown={(e) => handleMouseDown(e, 'drag')}
                        >
                            {/* Resize Handle Target Anchor */}
                            <div
                                className="absolute right-0 bottom-0 w-4 h-4 bg-emerald-400 cursor-se-resize rounded-tl-sm shadow"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    handleMouseDown(e, 'resize');
                                }}
                            />
                            <span className="text-[10px] bg-emerald-400 text-black px-1 py-0.5 rounded absolute top-1 left-1 font-mono font-bold">
                                Crop Region
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={processVideo}
                        disabled={processing}
                        className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 disabled:bg-gray-400 font-medium transition"
                    >
                        {processing ? "Executing Transcode Filter..." : "Crop & Trim Video"}
                    </button>
                </div>
            )}

            {outputSrc && (
                <div className="mt-8 border-t pt-6 space-y-2">
                    <h3 className="text-lg font-semibold text-emerald-600">2. Processed Output Video</h3>
                    <video src={outputSrc} controls className="w-full rounded border bg-black shadow" />
                    <a
                        href={outputSrc}
                        download="cropped-trimmed.mp4"
                        className="inline-block text-sm text-emerald-600 underline font-semibold mt-2"
                    >
                        Download Rendered Video File
                    </a>
                </div>
            )}
        </div>
    );
}
