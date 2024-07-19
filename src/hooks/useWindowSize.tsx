import { useState, useEffect } from 'react';

interface WindowSize {
    width: number;
    height: number;
}

export default function useWindowSize() :WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight });

    useEffect(() => {
        const handleWindowResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        window.addEventListener("resize", handleWindowResize);

        return () => window.removeEventListener("resize", handleWindowResize);

    }, []);

    return windowSize;
}
