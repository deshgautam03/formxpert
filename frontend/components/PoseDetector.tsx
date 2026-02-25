"use client";

import { useEffect, useRef, useState } from 'react';
import { poseService } from '@/lib/pose/poseService';
import { drawPosesOnCanvas } from '@/lib/pose/drawing';
import { Maximize, Minimize } from 'lucide-react';

interface PoseDetectorProps {
    onFeedback: (feedback: string, isCorrect: boolean) => void;
    onRep?: () => void;
    exerciseType?: string;
}

export default function PoseDetector({ onFeedback, onRep, exerciseType = "Squat" }: PoseDetectorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const requestRef = useRef<number>(0);
    const isMountedRef = useRef<boolean>(true);
    const lastRepsRef = useRef(0);

    // Update exercise type in the engine
    useEffect(() => {
        poseService.setExercise(exerciseType);
        lastRepsRef.current = 0; // Reset local rep tracker when exercise changes
    }, [exerciseType]);

    // Fullscreen Logic
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error("Error toggling fullscreen:", err);
        }
    };

    useEffect(() => {
        isMountedRef.current = true;
        let stream: MediaStream | null = null;

        const loop = async () => {
            if (!isMountedRef.current) return;

            if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
                const poses = await poseService.estimatePose(videoRef.current);

                if (canvasRef.current) {
                    const posesArray = poses ? [poses] : [];
                    drawPosesOnCanvas(canvasRef.current, posesArray);
                }

                if (poses) {
                    // Process frame using the new Engine
                    const state = poseService.processFrame(poses.keypoints);

                    // Handle Reps
                    if (state.reps > lastRepsRef.current) {
                        lastRepsRef.current = state.reps;
                        if (onRep) onRep();
                    }

                    // Handle Feedback
                    // The engine returns a feedback string (phase or mistake) and isCorrect flag
                    onFeedback(state.feedback, state.isCorrect);

                    // Update Debug Overlay
                    const debugEl = document.getElementById('debug-overlay-content');
                    if (debugEl) {
                        debugEl.innerHTML = `
                            <div>State: <span style="color: ${state.phase === 'READY' ? 'yellow' : state.phase === 'IDLE' ? 'gray' : '#00ff00'}">${state.phase}</span></div>
                            <div>Reps: ${state.reps}</div>
                            <div>${state.debugInfo || ''}</div>
                        `;
                    }
                }
            }

            requestRef.current = requestAnimationFrame(loop);
        };

        const init = async () => {
            try {
                if (typeof window === 'undefined') return;

                await poseService.initialize();

                // Set initial exercise
                poseService.setExercise(exerciseType);

                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        if (videoRef.current) {
                            videoRef.current.play().catch(e => console.error("Play error:", e));

                            if (canvasRef.current) {
                                canvasRef.current.width = videoRef.current.videoWidth;
                                canvasRef.current.height = videoRef.current.videoHeight;
                                videoRef.current.width = videoRef.current.videoWidth;
                                videoRef.current.height = videoRef.current.videoHeight;
                            }

                            setIsLoading(false);
                            loop();
                        }
                    };
                }
            } catch (error) {
                console.error("Initialization error:", error);
                setIsLoading(false);
            }
        };

        init();

        return () => {
            isMountedRef.current = false;
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            poseService.reset();
        };
    }, []); // Run once on mount

    return (
        <div
            ref={containerRef}
            className={`relative w-full mx-auto bg-black rounded-2xl overflow-hidden border border-slate-800 group ${isFullscreen ? 'fixed inset-0 z-50 max-w-none h-screen rounded-none border-none' : 'max-w-2xl aspect-video'
                }`}
        >
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-white bg-black/80 z-10">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
                        <p>Loading AI Model...</p>
                    </div>
                </div>
            )}

            {/* Debug Overlay */}
            <div className="absolute top-4 left-4 z-20 bg-black/60 p-2 rounded text-xs font-mono text-white pointer-events-none">
                <div className="font-bold text-neon-green mb-1">DEBUG INFO</div>
                <div id="debug-overlay-content">
                    Waiting for data...
                </div>
            </div>

            {/* Fullscreen Toggle Button */}
            <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 z-30 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
                <video
                    ref={videoRef}
                    className={`absolute inset-0 w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'} rounded-xl`}
                    autoPlay
                    playsInline
                    muted
                />
                <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'} rounded-xl z-10`}
                />
            </div>
        </div>
    );
}
