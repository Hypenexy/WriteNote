// UA

var useragent = new UAParser(navigator.userAgent);

const device = {
    Browser: useragent.getBrowser(),
    CPU: useragent.getCPU(),
    Device: useragent.getDevice(),
    Engine: useragent.getEngine(),
    OS: useragent.getOS()
};

device["CPU"].cores = navigator.hardwareConcurrency;

function getGPU(){
    var canvas = document.createElement('canvas');
    var gl;
    var debugInfo;
    var vendor;
    var renderer;

    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } 
    catch (e) {}

    if (gl) {
        debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    }

    return renderer;
}

device["GPU"] = getGPU();