// Helper function to calculate the displayed value for a row
export const calculateRowTotalDisplay = (registerValue, nCols, encoding) => {
    switch (encoding) {
        case 1: // 2s Complement
            const msb = 1 << (nCols - 1);
            const value = registerValue & msb
                ? -( (~registerValue & (msb - 1)) + 1 ) // Calculate negative value
                : registerValue & (msb - 1);             // Positive value
            // Handle the edge case of the most negative number
            return (registerValue === msb && nCols > 0) ? -msb : value;
        case 6: // ASCII
            if (registerValue >= 32 && registerValue <= 126) {
                return `'${String.fromCharCode(registerValue)}' (${registerValue})`;
            }
             if (registerValue === 0) return "'\\0' (0)";
             if (registerValue === 10) return "'\\n' (10)";
             if (registerValue === 13) return "'\\r' (13)";
             // Add other common non-printable chars if desired
            return `Code ${registerValue}`;
        case 7: // IEEE Floating Point (Example for 8-bit E3M4)
            if (nCols === 8) {
                const bias8 = 3; // 2^(3-1) - 1

                if (registerValue === 0x00) return "+0";
                if (registerValue === 0x80) return "-0";
                if (registerValue === 0x7F) return "+Infinity"; // All exp bits 1, mantissa 0
                if (registerValue === 0xFF) return "-Infinity"; // Sign 1, all exp bits 1, mantissa 0
                // Simplified NaN check (any case with all exponent bits 1 and non-zero mantissa)
                 if ((registerValue & 0x70) === 0x70 && (registerValue & 0x0F) !== 0) return "NaN";


                const signBit8 = (registerValue & 0x80) >>> 7;
                const exponentBits8 = (registerValue & 0x70) >>> 4;
                const mantissaBits8 = registerValue & 0x0F;
                const sign8 = (signBit8 === 1) ? -1 : 1;

                let floatValue8;
                if (exponentBits8 === 0b000) { // Zero or Denormalized
                    if (mantissaBits8 === 0) {
                        floatValue8 = sign8 * 0; // Handled above, but safe here
                    } else {
                        // Denormalized: value = sign * 0.MMMM * 2^(1-bias)
                        floatValue8 = sign8 * (mantissaBits8 / 16.0) * Math.pow(2, 1 - bias8);
                    }
                } else { // Normalized number (Exponent > 0 and not all 1s)
                    // value = sign * 1.MMMM * 2^(exponent - bias)
                    const actualExponent8 = exponentBits8 - bias8;
                    floatValue8 = sign8 * (1 + mantissaBits8 / 16.0) * Math.pow(2, actualExponent8);
                }
                 // Format the output
                const signChar = sign8 > 0 ? '+' : '-';
                const expStr = `2^(${exponentBits8}-${bias8})`;
                const manStr = exponentBits8 === 0 ? `0.${mantissaBits8.toString(2).padStart(4, '0')}` : `1.${mantissaBits8.toString(2).padStart(4, '0')}`;
                const manValue = exponentBits8 === 0 ? mantissaBits8/16.0 : 1 + mantissaBits8/16.0;

                // Try toPrecision, fallback to fixed if needed
                 let displayValue;
                 try {
                     displayValue = floatValue8.toPrecision(4);
                 } catch {
                     displayValue = floatValue8.toFixed(4);
                 }

                 // Check for very small/large numbers that might become 0 or Infinity
                 if (Math.abs(floatValue8) > 0 && parseFloat(displayValue) === 0) {
                    displayValue = floatValue8.toExponential(2);
                 } else if (Math.abs(floatValue8) < Infinity && parseFloat(displayValue) === (sign8 * Infinity)) {
                     displayValue = floatValue8.toExponential(2);
                 }


                return `${signChar} ${expStr} * ${manValue.toFixed(4)} = ${displayValue}`;

            } else {
                return `FP-${nCols} (unsupported)`; // Placeholder for other sizes
            }
        case 0: // Unsigned
        default:
            return registerValue.toString();
    }
};

// Helper to get header values based on encoding
export const getHeaderValues = (nCols, encoding) => {
    let values = [];
    switch (encoding) {
        case 1: // 2s Complement
            if (nCols > 0) {
                values[0] = -Math.pow(2, nCols - 1);
                for (let i = 1; i < nCols; i++) {
                    values.push(Math.pow(2, nCols - i - 1));
                }
            }
            break;
        case 0: // Unsigned
        case 6: // ASCII (uses unsigned place values)
        default:
            for (let i = 0; i < nCols; i++) {
                values.push(Math.pow(2, nCols - i - 1));
            }
            break;
        // Note: IEEE 754 header is handled specially in the AbacusHeader component
    }
    // Reverse the array because we build the table RTL visually but calculate LTR mathematically
    return values.reverse();
};
