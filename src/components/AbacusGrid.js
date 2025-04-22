import React from 'react';
import AbacusHeader from './AbacusHeader';
import AbacusRow from './AbacusRow';

const AbacusGrid = ({
    nRows,
    nCols,
    registers,
    encoding,
    showDigits,
    showKeys,
    onBeadMouseDown,
    onBeadMouseEnter,
    onContextMenu // Pass down context menu handler
}) => {
    return (
        <table className="abacus-table" onContextMenu={onContextMenu}>
            <AbacusHeader nCols={nCols} encoding={encoding} />
            <tbody>
                {registers.slice(0, nRows).map((registerValue, i) => (

                    <AbacusRow
                        key={i}
                        keyboardRowIndex={nRows === 1 ? 1 : i}
                        rowIndex={i}
                        nCols={nCols}
                        registerValue={registerValue}
                        encoding={encoding}
                        showDigits={showDigits}
                        showKeys={showKeys}
                        onBeadMouseDown={onBeadMouseDown}
                        onBeadMouseEnter={onBeadMouseEnter}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default AbacusGrid;
