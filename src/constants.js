export const Encodings = [
    { value: 0, label: "Unsigned" },
    { value: 1, label: "2s Complement" },
    // { value: 2, label: "1s Complement" }, // Example if added later
    // { value: 3, label: "Sign Bit" },
    // { value: 4, label: "Endianness" },
    // { value: 5, label: "Hexadecimal" },
    { value: 6, label: "ASCII" },
    { value: 7, label: "IEEE Floating Point" },
    // { value: 8, label: "RGB" },
];

export const MAX_ROWS = 32;
export const MAX_COLS = 32;

export const keyboardMatrix = [
    "1234567890",
    "qwertyuiop",
    "asdfghjkl;'",
    "zxcvbnm,./",
];

// Reverse each row for mapping LTR keys to RTL bits
export const keyboardMap = keyboardMatrix.map(row => row.split(''));

// Audio setup - consider preloading or handling loading state
// It's often better to create the Audio object once
let snapSoundInstance = null;
export const getSnapSound = () => {
    if (!snapSoundInstance && typeof Audio !== 'undefined') {
        try {
            snapSoundInstance = new Audio('/assets/snap.wav');
            snapSoundInstance.volume = 1.0;
        } catch (error) {
            console.error("Failed to load snap sound:", error);
            // Provide a dummy object if Audio fails (e.g., in SSR)
            snapSoundInstance = { play: () => {}, currentTime: 0 };
        }
    } else if (!snapSoundInstance) {
        snapSoundInstance = { play: () => {}, currentTime: 0 };
    }
    return snapSoundInstance;
};

export const playSnapSound = () => {
    const sound = getSnapSound();
    sound.currentTime = 0; // Reset playback
    sound.play().catch(e => console.warn("Audio play failed:", e)); // Handle potential play errors
};
