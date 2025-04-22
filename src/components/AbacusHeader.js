import React from 'react';
import { getHeaderValues } from '../utils/calculations';

const AbacusHeader = React.memo(({ nCols, encoding }) => {
    if (nCols <= 0) return <thead className="abacus-header"></thead>;

    // Special case for IEEE 754 8-bit
    if (encoding === 7 && nCols === 8) {
        const headerStyle = (colIndex) => ({
             '--col-index': colIndex,
             '--total-columns': nCols,
         });
        return (
            <thead className="abacus-header">
                <tr className="ieee-row">
                    {/* Remember: Table is visually LTR, but cols are indexed RTL mathmatically */}
                    {/* We need colspan reversed */}
                    <th className="ieee-mantissa" style={headerStyle(0)} colSpan="4">Mantissa</th>
                    <th className="ieee-exponent" style={headerStyle(4)} colSpan="3">Exponent</th>
                    <th className="ieee-sign" style={headerStyle(7)} colSpan="1">Sign</th>
                </tr>
                <tr className="ieee-row">
                    {/* Values also need reversing relative to the labels above */}
                     {/* Mantissa bits (4 bits) - Indices 0, 1, 2, 3 */}
                     {[3, 2, 1, 0].map(m => (
                        <td key={`man-${m}`} style={headerStyle(m)}>
                            2<sup>-{4-m}</sup>
                        </td>
                    ))}
                    {/* Exponent bits (3 bits) - Indices 4, 5, 6 */}
                    {[6, 5, 4].map(e => (
                         <td key={`exp-${e}`} style={headerStyle(e)}>
                            2<sup>{6-e}</sup>
                        </td>
                     ))}
                    {/* Sign bit - Index 7 */}
                    <td key="sign" style={headerStyle(7)}>+/-</td>
                </tr>
            </thead>
        );
    }

    // Default header generation
    const headerValues = getHeaderValues(nCols, encoding); // Returns LTR math values (LSB first)

    return (
        <thead className="abacus-header">
            <tr>
                {/* Reverse headerValues for LTR display */}
                {headerValues.reverse().map((value, displayIndex) => {
                    const colIndex = nCols - 1 - displayIndex; // Calculate mathematical index (RTL)
                     const thStyle = {
                         '--col-index': colIndex,
                         '--total-columns': nCols,
                     };
                    return (
                         <th key={displayIndex} style={thStyle}>
                            {value}
                        </th>
                    )
                    })}
            </tr>
        </thead>
    );
});

export default AbacusHeader;
