import {ChangeEvent, useEffect, useRef, useState} from 'react'
import {Button} from "react-bootstrap";
import AboutModal from "./modals/AboutModal.tsx";

import './App.css'

function App() {

    const [aboutModalVisible, setAboutModalVisible ] = useState<boolean>(false);
    const [audioFile, setAudioFile] = useState<File | undefined>();

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioFileInputRef = useRef<HTMLInputElement | null>(null);
    const audioRef = useRef<HTMLMediaElement | null>(null);
    const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const analyserNodeRef = useRef<AnalyserNode | null>(null);

    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            const canvas = canvasRef.current as HTMLCanvasElement;

            canvas.width = entry.devicePixelContentBoxSize[0].inlineSize;
            canvas.height = entry.devicePixelContentBoxSize[0].blockSize
        }
    })

    useEffect(() => {
        observer.observe(canvasRef.current as HTMLCanvasElement, { box: 'device-pixel-content-box'});
    }, []);

    function loadAudio(e: ChangeEvent<HTMLInputElement>) {
        if (e.target && e.target.files)
        {
            setAudioFile(e.target.files[0]);
        }
    }

    const handleAudioPlay = () => {
        const audioContext = new AudioContext();

        if (!audioSourceRef.current) {
            audioSourceRef.current = audioContext.createMediaElementSource(audioRef.current as HTMLAudioElement);
            analyserNodeRef.current = audioContext.createAnalyser();
            analyserNodeRef.current.fftSize = 256;
            audioSourceRef.current.connect(analyserNodeRef.current as AnalyserNode);
            analyserNodeRef.current.connect(audioContext.destination);
        }

        visualizeData();
    }

    const visualizeData = () => {
        const animationController = window.requestAnimationFrame(visualizeData);
        if (audioRef.current && audioRef.current.paused) {
            return cancelAnimationFrame(animationController);
        }
        const canvas = canvasRef.current as HTMLCanvasElement;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const analyserNode: AnalyserNode = analyserNodeRef.current as AnalyserNode;

        const songData = new Uint8Array(analyserNode.frequencyBinCount);
        analyserNode.getByteFrequencyData(songData);

        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        const barWidth = Math.floor((context.canvas.width - songData.length) / songData.length);
        const barHeight = context.canvas.height;

        context.save();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        const gradient = context.createLinearGradient(0, 0, barWidth, barHeight );
        gradient.addColorStop(0.1, "red");
        gradient.addColorStop(0.3, "yellow");
        gradient.addColorStop(0.9, "green");

        context.fillStyle = gradient;

        for (let i = 0; i < songData.length; i++) {
            const xPos = (barWidth * i) + i;
            const yPos = context.canvas.height;

            const currentBarHeight = (Math.floor(barHeight / 255) * songData[i]) * -1;

            context.fillRect(xPos + i, yPos, barWidth, currentBarHeight);
        }

        context.restore();
    };

    function onWindowResize() {
        const canvas = canvasRef.current as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function debounce(func: Function, timeout = 300) {
        let timer: any;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(args);
            }, timeout);
        };
    }

    window.addEventListener("resize", debounce(() => onWindowResize()));

    return (
        <>
            <AboutModal visible={aboutModalVisible} setVisible={setAboutModalVisible}/>
            <canvas className="visualiser" ref={canvasRef}/>

            <div className="controls">
                <Button variant="secondary" onClick={() => {
                    setAboutModalVisible(true);
                }}>About</Button>&nbsp;
                <input ref={audioFileInputRef} style={{display: "none"}} id="audiofile" type="file"
                       onChange={loadAudio}/>
                <Button variant="secondary" onClick={() => {
                    audioFileInputRef.current?.click()
                }}>Load Audio</Button>
            </div>

            <div className="player">
                <audio
                    ref={audioRef}
                    onPlay={handleAudioPlay}
                    src={audioFile && window.URL.createObjectURL(audioFile)}
                    controls
                />
            </div>
        </>
    )
}

export default App
