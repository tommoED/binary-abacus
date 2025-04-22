import React from 'react';
import { keyboardMap } from '../constants';

// Memoize Bead to prevent re-renders if props haven't changed
const Bead = React.memo(({
    rowIndex,
    colIndex, // This is the mathematical index (0 for LSB)
    displayColIndex, // This is the visual index (0 for leftmost column)
    nCols,
    keyboardRowIndex,
    isActive,
    showDigits,
    showKeys,
    onBeadMouseDown,
    onBeadMouseEnter,
}) => {

    const handleMouseDown = (event) => {
        onBeadMouseDown(event, rowIndex, colIndex);
    };

    const handleMouseEnter = (event) => {
        onBeadMouseEnter(event, rowIndex, colIndex);
    };

    // Determine keyboard key hint
    let keyHint = '';

    const keyColOffset = nCols > keyboardMap[keyboardRowIndex]?.length
        ? nCols - keyboardMap[keyboardRowIndex].length
        : 0;

    // Override if multiple rows (use rowIndex for keyboard map)
    if (keyboardMap[keyboardRowIndex]?.[displayColIndex - keyColOffset]){
        keyHint = keyboardMap[keyboardRowIndex][displayColIndex - keyColOffset];
    }


    // CSS Variables for dynamic styling
    const beadStyle = {
        '--col-index': colIndex, // Use mathematical index for color calculation
        '--total-columns': nCols,
    };

     const cellStyle = {
         '--show-keys': showKeys ? 'flex' : 'none', // Control key visibility via cell
    };

    return (
        <td style={cellStyle} > {/* Add key display style here */}
            <div
                className={`bead ${isActive ? 'active' : ''}`}
                style={beadStyle}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                role="button" // Accessibility hint
                aria-pressed={isActive}
                aria-label={`Bead Row ${rowIndex + 1} Column ${colIndex + 1} (Value ${isActive ? 1 : 0})`}
             >
                <span
                    className="bead-value"
                    style={{ '--show-digits': showDigits ? 'block' : 'none' }}
                >
                    {isActive ? 1 : 0}
                </span>
            </div>
             {keyHint && ( // Conditionally render keyboard key
                <div className="keyboard-key">
                    {keyHint.toUpperCase()}
                </div>
            )}
        </td>
    );
});

export default Bead;
