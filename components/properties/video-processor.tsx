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
    
    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(60);

    const videoRef = useRef<HTMLVideoElement>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setVideoSrc(URL.createObjectURL(file));
            setStartTime(0);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const vid = videoRef.current;
            setDuration(vid.duration);
            setEndTime(Math.min(vid.duration, 60));

            if (vid.duration > 60) {
                toast.info("Note: This video is longer than 60 seconds. It will be automatically trimmed.");
            }
        }
    };

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = Number(e.target.value);
        if (val < 0) val = 0;
        if (val >= endTime - 20) val = endTime - 20;
        setStartTime(val);
        if (videoRef.current) {
            videoRef.current.currentTime = val;
        }
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = Number(e.target.value);
        if (val > duration) val = duration;
        if (val <= startTime + 20) val = startTime + 20;
        if (val - startTime > 60) val = startTime + 60;
        setEndTime(val);
        if (videoRef.current) {
            videoRef.current.currentTime = val;
        }
    };

    const processVideo = async () => {
        if (!ffmpeg || !videoFile) return;
        
        const trimDuration = endTime - startTime;
        if (trimDuration < 20 || trimDuration > 60) {
            toast.error("Video duration must be between 20 and 60 seconds.");
            return;
        }

        setProcessing(true);

        try {
            const inputName = 'input.mp4';
            const outputName = 'output.mp4';

            await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

            await ffmpeg.exec([
                '-ss', startTime.toString(),
                '-i', inputName,
                '-t', trimDuration.toString(),
                '-c:v', 'copy',
                '-c:a', 'copy',
                outputName
            ]);

            const data = await ffmpeg.readFile(outputName);
            const dataArray = Uint8Array.from(data as Uint8Array);
            const blob = new Blob([dataArray], { type: 'video/mp4' });

            if (onProcessComplete) {
                const outName = videoFile.name.replace(/\.[^/.]+$/, "") + "-trimmed.mp4";
                const processedFile = new File([blob], outName, { type: 'video/mp4' });
                onProcessComplete(processedFile);
            } else {
                toast.success("Video processed successfully!");
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
        <div className="max-w-2xl mx-auto p-4 space-y-6 bg-white border rounded-lg shadow-sm mt-4">
            {!file && (
                <div className="flex flex-col items-center border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50">
                    <input type="file" accept="video/*" onChange={handleFileChange} className="mb-2" />
                    <p className="text-xs text-gray-500">Upload a video to trim</p>
                </div>
            )}

            {onCancel && (
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Trim Video</h3>
                    <button type="button" onClick={onCancel} className="text-sm text-red-500 hover:text-red-700 font-medium">
                        Cancel
                    </button>
                </div>
            )}

            {videoSrc && (
                <div className="space-y-6">
                    <div className="relative bg-black rounded-lg overflow-hidden flex justify-center border">
                        <video
                            ref={videoRef}
                            src={videoSrc}
                            onLoadedMetadata={handleLoadedMetadata}
                            controls
                            playsInline
                            className="w-full max-h-[400px] object-contain"
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Start Time (sec)</span>
                            <span>End Time (sec)</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <input
                                type="number"
                                min={0}
                                max={Math.max(0, endTime - 20)}
                                value={Math.round(startTime)}
                                onChange={handleStartTimeChange}
                                className="w-24 p-2 border rounded"
                            />
                            
                            <div className="flex-1 px-4 relative h-10 flex items-center">
                                {/* Visual representation of the trim duration */}
                                <div className="absolute w-full h-2 bg-gray-200 rounded-full left-0"></div>
                                {duration > 0 && (
                                    <div 
                                        className="absolute h-2 bg-emerald-500 rounded-full"
                                        style={{
                                            left: `${(startTime / duration) * 100}%`,
                                            width: `${((endTime - startTime) / duration) * 100}%`
                                        }}
                                    ></div>
                                )}
                            </div>

                            <input
                                type="number"
                                min={startTime + 20}
                                max={duration}
                                value={Math.round(endTime)}
                                onChange={handleEndTimeChange}
                                className="w-24 p-2 border rounded"
                            />
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Total Length: {duration.toFixed(1)}s</span>
                            <span className="font-semibold text-emerald-600">Trimmed Length: {(endTime - startTime).toFixed(1)}s</span>
                        </div>
                    </div>

                    <button
                        onClick={processVideo}
                        disabled={processing}
                        className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 font-medium transition shadow-sm"
                    >
                        {processing ? "Processing Video..." : "Trim & Upload Video"}
                    </button>
                </div>
            )}
        </div>
    );
}
