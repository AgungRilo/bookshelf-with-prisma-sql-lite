import { convertBytesToBase64, convertFileToArrayBuffer, detectMimeType } from "../src/app/utils/utils";

describe("Utility Functions", () => {
    
    // Test untuk convertFileToArrayBuffer
    test("convertFileToArrayBuffer should convert File to Uint8Array", async () => {
        const fileContent = new Blob(["Hello World"], { type: "text/plain" });
        const file = new File([fileContent], "test.txt", { type: "text/plain" });

        const result = await convertFileToArrayBuffer(file);

        expect(result).toBeInstanceOf(Uint8Array);
        expect(result.length).toBeGreaterThan(0);
    });

    // Test untuk detectMimeType
    test("detectMimeType should detect PNG correctly", () => {
        const pngBytes = new Uint8Array([137, 80, 78, 71]);
        expect(detectMimeType(pngBytes)).toBe("image/png");
    });

    test("detectMimeType should detect JPEG correctly", () => {
        const jpegBytes = new Uint8Array([255, 216, 255, 224]);
        expect(detectMimeType(jpegBytes)).toBe("image/jpeg");
    });

    test("detectMimeType should throw an error for unsupported format", () => {
        const invalidBytes = new Uint8Array([10, 20, 30, 40]);
        expect(() => detectMimeType(invalidBytes)).toThrow("Unsupported image format");
    });

    // Test untuk convertBytesToBase64
    test("convertBytesToBase64 should convert Uint8Array to Base64", () => {
        const bytes = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"
        const base64 = convertBytesToBase64(bytes);
        expect(base64).toBe(btoa("Hello"));
    });
});
