export const convertFileToArrayBuffer = (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            console.log("ArrayBuffer Data:", arrayBuffer);
            resolve(new Uint8Array(arrayBuffer)); // Konversi ke Uint8Array
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file); // Konversi file ke ArrayBuffer
    });
};

export const detectMimeType = (bytes: Uint8Array): string => {
    const header = bytes.slice(0, 4).join(" ");
    switch (header) {
        case "137 80 78 71": // Header untuk PNG
            return "image/png";
        case "255 216 255 224": // Header untuk JPEG
        case "255 216 255 225": // Header untuk JPEG dengan EXIF
            return "image/jpeg";
        default:
            throw new Error("Unsupported image format");
    }
};

export const convertBytesToBase64 = (bytes: Uint8Array): string => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary); // Mengonversi ke Base64
};