import React from 'react';
import { Encodings, MAX_ROWS, MAX_COLS } from '../constants';

const SettingsPanel = ({
    isOpen,
    toggleSettings,
    nRows,
    handleRowsChange,
    nCols,
    handleColsChange,
    encoding,
    handleEncodingChange,
    showDigits,
    handleShowDigitsChange,
    showKeys,
    handleShowKeysChange,
}) => {
    return (
        <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
            <div className="settings-toggle" onClick={toggleSettings}>⚙️</div>
            <h2>Settings</h2>
            <div className="control-group">
                <label htmlFor="rows">Number of Rows (Max: {MAX_ROWS}):</label>
                <input
                    type="number"
                    id="rows"
                    min="1"
                    max={MAX_ROWS}
                    value={nRows}
                    onChange={handleRowsChange}
                />
            </div>
            <div className="control-group">
                <label htmlFor="columns">Number of Columns (Max: {MAX_COLS}):</label>
                <input
                    type="number"
                    id="columns"
                    min="1"
                    max={MAX_COLS}
                    value={nCols}
                    onChange={handleColsChange}
                />
            </div>
            <div className="control-group">
                <label htmlFor="encoding">Encoding:</label>
                <select id="encoding" value={encoding} onChange={handleEncodingChange}>
                    {Encodings.map(enc => (
                        <option key={enc.value} value={enc.value}>{enc.label}</option>
                    ))}
                </select>
            </div>
            <div className="control-group checkbox-group">
                <label htmlFor="showDigits">Show Digits (0/1):</label>
                <input
                    type="checkbox"
                    id="showDigits"
                    checked={showDigits}
                    onChange={handleShowDigitsChange}
                />
            </div>
            <div className="control-group checkbox-group">
                <label htmlFor="showKeys">Show Key Hints:</label>
                <input
                    type="checkbox"
                    id="showKeys"
                    checked={showKeys}
                    onChange={handleShowKeysChange}
                 />
            </div>
        </div>
    );
};

export default SettingsPanel;
