
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

// Keyboard map without reversing (LTR mapping)
export const keyboardMap = keyboardMatrix.map(row => row.split(''));

// Audio setup - consider preloading or handling loading state
// It's often better to create the Audio object once
export const snapSoundInstance = new Audio(`${process.env.PUBLIC_URL}/assets/snap.wav`);
snapSoundInstance.volume = 0.6;

