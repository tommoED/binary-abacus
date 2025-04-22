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
    soundOn,
    handleSoundChange,
    exitSettings,
}) => {
    return (
        <div className={`settings-panel ${isOpen ? 'open' : ''}`} onBlur={exitSettings}>
            <div className="toggle-buttons">
                <button className={`toggle-button ${soundOn ? 'active' : 'disabled'}`}
                    onClick={handleSoundChange}
                    title="Sound"
                >
                    {soundOn ? '🔊' : '🔈'}
                </button>
                <button 
                    className={`toggle-button ${showDigits ? 'active' : 'disabled'}`}
                    onClick={handleShowDigitsChange}
                    title="Show Digits (0/1)"
                >
                    {showDigits ? '🔢' : <span>🔢<span>❌</span></span>}
                </button>
                <button 
                    className={`toggle-button ${showKeys ? 'active' : 'disabled'}`}
                    onClick={handleShowKeysChange}
                    title="Show Key Hints"
                >
                    {showKeys ? '⌨️' : <span>⌨️<span>❌</span></span>}
                </button>
                 <button className="toggle-button" onClick={toggleSettings}>🎛️</button>
            </div>
            
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
        </div>
    );
};

export default SettingsPanel;
