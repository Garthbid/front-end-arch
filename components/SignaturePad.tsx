import React, { useRef, useState, useEffect } from 'react';
import { Eraser } from 'lucide-react';

interface SignaturePadProps {
    onChange: (signatureData: string | null) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onChange }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size based on parent container
        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                // Maintain stroke style after resize
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                    ctx.strokeStyle = '#000000';
                }
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Initial setup
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000000';
        }

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { x, y } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCoordinates(e, canvas);
        ctx.lineTo(x, y);
        ctx.stroke();

        if (!hasSignature) setHasSignature(true);
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const canvas = canvasRef.current;
            if (canvas && hasSignature) {
                onChange(canvas.toDataURL());
            }
        }
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        onChange(null);
    };

    return (
        <div className="relative w-full h-40 bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            {hasSignature ? (
                <button
                    onClick={clearSignature}
                    className="absolute top-2 right-2 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
                    title="Clear Signature"
                >
                    <Eraser size={14} />
                </button>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 select-none">
                    <span className="font-display uppercase italic text-lg opacity-50">Sign Here</span>
                </div>
            )}
        </div>
    );
};

export default SignaturePad;
