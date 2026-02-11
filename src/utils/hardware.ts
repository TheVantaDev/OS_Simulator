export interface HardwareInfo {
    cpuCores: number;
    memory?: number;
    platform: string;
    gpuRenderer: string;
    screenResolution: string;
}

export const getHardwareInfo = (): HardwareInfo => {
    // defaults
    const info: HardwareInfo = {
        cpuCores: navigator.hardwareConcurrency || 4,
        platform: navigator.platform || 'The Order general consumer framework',
        gpuRenderer: 'Virtual Display Adapter',
        screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    // RAM (Chrome/Edge only)
    if ('deviceMemory' in navigator) {
        info.memory = (navigator as any).deviceMemory;
    }

    // GPU Renderer
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') as WebGLRenderingContext;
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                info.gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
    } catch (e) {
        console.warn('Failed to detect GPU', e);
    }

    return info;
};
