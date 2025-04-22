import React from 'react';
import Bead from './Bead';
import { calculateRowTotalDisplay } from '../utils/calculations';

// Memoize Row to prevent re-renders if its register value hasn't changed
const AbacusRow = React.memo(({
    keyboardRowIndex,
    rowIndex,
    nCols,
    registerValue,
    encoding,
    showDigits,
    showKeys,
    onBeadMouseDown,
    onBeadMouseEnter,
}) => {
    const beads = [];
    for (let j = 0; j < nCols; j++) {
        const colIndex = j; // Mathematical index (0=LSB)
        const displayColIndex = nCols - 1 - j; // Visual index (0=Leftmost)
        const isActive = (registerValue & (1 << colIndex)) !== 0;
        beads.push(
            <Bead
                key={`${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
                displayColIndex={displayColIndex}
                nCols={nCols}
                keyboardRowIndex={keyboardRowIndex}
                isActive={isActive}
                showDigits={showDigits}
                showKeys={showKeys}
                onBeadMouseDown={onBeadMouseDown}
                onBeadMouseEnter={onBeadMouseEnter}
            />
        );
    }

    // Calculate the display total for the row
    const rowTotalDisplay = calculateRowTotalDisplay(registerValue, nCols, encoding);

    return (
        <tr>
            {/* Render beads in reverse order for visual LTR layout */}
            {beads.reverse()}
            <td className="row-total">
                {rowTotalDisplay}
            </td>
        </tr>
    );
});

export default AbacusRow;
