import React, { useState, useEffect, useCallback, useRef } from 'react';
import SettingsPanel from './components/SettingsPanel';
import AbacusGrid from './components/AbacusGrid';
import Footer from './components/Footer';
import { MAX_ROWS, MAX_COLS, keyboardMap, playSnapSound } from './constants';
import './styles/Abacus.css'; // Import styles

function App() {
    // --- State ---
    const [nRows, setNRows] = useState(1);
    const [nCols, setNCols] = useState(8);
    // Initialize registers array based on MAX_ROWS, but only use up to nRows
    const [registers, setRegisters] = useState(() => new Array(MAX_ROWS).fill(0));
    const [encoding, setEncoding] = useState(0); // 0 = Unsigned
    const [showDigits, setShowDigits] = useState(true);
    const [showKeys, setShowKeys] = useState(true); // Default to showing keys
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Interaction State
    const [keyModifier, setKeyModifier] = useState('toggle'); // 'toggle', 'set', 'unset'
    const isMouseDownRef = useRef(false); // Ref for mouse state to avoid stale closures in listeners
    const visitedBeadsRef = useRef(new WeakSet()); // Ref for tracking visited beads during swipe

    // --- Helper Functions ---
    const updateRegister = useCallback((rowIndex, colIndex, action) => {
        setRegisters(prevRegisters => {
            const currentVal = prevRegisters[rowIndex];
            const bitMask = 1 << colIndex;
            let newVal = currentVal;
            let changed = false;

            switch (action) {
                case 'set':
                    if (!(currentVal & bitMask)) { // Only change if not already set
                        newVal = currentVal | bitMask;
                        changed = true;
                    }
                    break;
                case 'unset':
                    if (currentVal & bitMask) { // Only change if not already unset
                        newVal = currentVal & ~bitMask;
                        changed = true;
                    }
                    break;
                case 'toggle':
                default:
                    newVal = currentVal ^ bitMask; // XOR toggles the bit
                    changed = true;
                    break;
            }

            if (changed) {
                playSnapSound();
                const nextRegisters = [...prevRegisters];
                nextRegisters[rowIndex] = newVal;
                return nextRegisters;
            }
            return prevRegisters; // No change, return original array
        });
    }, []); // No dependencies needed as setRegisters handles updates correctly

    // --- Event Handlers ---
    const handleRowsChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 1;
        if (value > MAX_ROWS) value = MAX_ROWS;
        setNRows(value);
    };

    const handleColsChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (isNaN(value) || value < 1) value = 1;
        if (value > MAX_COLS) value = MAX_COLS;
        setNCols(value);
         // Special case: ASCII forces 8 bits? (Optional)
         if (encoding === 6 && value !== 8) {
             // setNCols(8); // Or just let user select 8 cols
         }
         // Special case: IEEE 754 8-bit forces 8 bits
          if (encoding === 7 && value !== 8) {
             // setNCols(8); // Or maybe reset encoding? For now, just allow it.
         }
    };

    const handleEncodingChange = (e) => {
        const newEncoding = parseInt(e.target.value, 10);
        setEncoding(newEncoding);
         // Automatically set columns for specific modes if desired
         if (newEncoding === 6) { // ASCII
             // setNCols(8); // Force 8 columns for ASCII
             setShowKeys(false); // Often hide keys for ASCII typing
         } else if (newEncoding === 7) { // IEEE FP
             setNCols(8); // Force 8 columns for current implementation
             setShowKeys(true); // Show keys might be useful here
         } else {
             setShowKeys(true); // Show keys by default otherwise
         }
    };

    const handleShowDigitsChange = (e) => setShowDigits(e.target.checked);
    const handleShowKeysChange = (e) => setShowKeys(e.target.checked);
    const toggleSettings = () => setSettingsOpen(prev => !prev);

    // Bead Interaction Handlers
    const handleBeadMouseDown = useCallback((event, rowIndex, colIndex) => {
        event.preventDefault(); // Prevent text selection, etc.
        isMouseDownRef.current = true;
        visitedBeadsRef.current = new WeakSet(); // Reset visited set on new click/swipe
        visitedBeadsRef.current.add(event.target); // Mark the clicked bead as visited

        // Use right-click specifically for 'unset', otherwise use keyModifier
        const action = event.button === 2 ? 'unset' : keyModifier;
        updateRegister(rowIndex, colIndex, action);

    }, [keyModifier, updateRegister]); // Dependency on keyModifier

    const handleBeadMouseEnter = useCallback((event, rowIndex, colIndex) => {
        if (isMouseDownRef.current && !visitedBeadsRef.current.has(event.target)) {
             visitedBeadsRef.current.add(event.target);
             // Use right-click specifically for 'unset', otherwise use keyModifier (consistent with mousedown)
             // Note: Detecting which button is held during mouseenter is tricky, rely on initial action
             updateRegister(rowIndex, colIndex, keyModifier); // Use the active modifier
        }
    }, [keyModifier, updateRegister]); // Dependency on keyModifier

    const handleMouseUpGlobal = useCallback(() => {
        isMouseDownRef.current = false;
        // No need to clear visitedBeadsRef here, it's reset on mousedown
    }, []);

    const handleContextMenu = useCallback((event) => {
         event.preventDefault(); // Prevent browser context menu
    }, []);


    // --- Keyboard Handling Effect ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            // --- Modifier Keys ---
            if (e.key === 'Shift') {
                e.preventDefault(); // Prevent potential text selection issues
                setKeyModifier('set');
                return; // Don't process further
            }
            if (e.key === 'ArrowUp') {
                 e.preventDefault(); // Prevent page scrolling
                setKeyModifier('set');
                return;
            }
             if (e.key === 'Control' || e.key === 'Tab') { // Use Ctrl or Tab for unset
                 e.preventDefault(); // Prevent tabbing away
                setKeyModifier('unset');
                return;
             }
            if (e.key === 'ArrowDown') {
                 e.preventDefault(); // Prevent page scrolling
                setKeyModifier('unset');
                return;
            }


            // --- Global Action Keys ---
             if (e.key === 'Backspace') {
                 e.preventDefault();
                 setRegisters(prev => prev.map(() => 0)); // Clear all active rows
                 playSnapSound(); // Play sound once for global action
                 return;
             }
             if (e.key === '\\') { // Toggle all bits
                 e.preventDefault();
                  const mask = (1 << nCols) - 1;
                 setRegisters(prev => prev.map(reg => reg ^ mask));
                 playSnapSound();
                 return;
             }
             if (e.key === 'Enter') { // Set all bits
                  e.preventDefault();
                  const mask = (1 << nCols) - 1;
                  setRegisters(prev => prev.map(() => mask));
                  playSnapSound();
                  return;
             }

            // --- ASCII Mode Typing ---
            if (encoding === 6 && !e.ctrlKey && !e.metaKey && e.key.length === 1) {
                // Assuming ASCII mode affects the first row (index 0)
                const charCode = e.key.charCodeAt(0);
                 if (nCols === 8) { // Only works reliably for 8 cols
                     setRegisters(prev => {
                         const nextRegisters = [...prev];
                         nextRegisters[0] = charCode;
                         return nextRegisters;
                     });
                      playSnapSound();
                 }
                return; // Don't process as bead toggle
            }


            // --- Bead Toggling Keys ---
            // Find which bead the key corresponds to
             let targetRow = -1, targetCol = -1;
             const keyLower = e.key.toLowerCase();

            // If there is only one row, use QWERTY (row 1) for single row to prevent confusion
            const startRow = nRows === 1 ? 1 : 0;
            const endRow = Math.min(nRows + (nRows === 1 ? 1 : 0), keyboardMap.length);
            
            for (let r = startRow; r < endRow; r++) {
                // Calculate column offset based on nCols
                const row = nRows === 1 ? 1 : r; // Use QWERTY row for single row mode
                
                const keyColOffset = nCols > keyboardMap[row].length ? nCols - keyboardMap[row].length : 0;
                for (let c = 0; c < keyboardMap[row].length; c++) {
                    // The visual column index in the table is `keyColOffset + c`
                    const visualColIndex = keyColOffset + c;
                    // The mathematical column index (LSB=0) is `nCols - 1 - visualColIndex`
                    const mathColIndex = nCols - 1 - visualColIndex;

                    if (visualColIndex < nCols && keyboardMap[row][c] === keyLower) {
                        targetRow = nRows === 1 ? 0 : r; // Map to row 0 if single row mode
                        targetCol = mathColIndex; // Use the mathematical index for updateRegister
                        break;
                    }
                }
                if (targetRow !== -1) break;
            }

            // If a target bead was found, update its register
            if (targetRow !== -1 && targetCol !== -1) {
                e.preventDefault(); // Prevent default action if we found a match
                updateRegister(targetRow, targetCol, keyModifier);
            }
        };

        const handleKeyUp = (e) => {
             if (['Shift', 'ArrowUp', 'Control', 'Tab', 'ArrowDown'].includes(e.key)) {
                 setKeyModifier('toggle');
             }
        };

        // Add global listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('mouseup', handleMouseUpGlobal); // Listen for mouseup anywhere

        // Cleanup function
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('mouseup', handleMouseUpGlobal);
        };
    }, [nRows, nCols, keyModifier, updateRegister, encoding]); // Re-run if dimensions, modifier, or update logic change

    // --- Render ---
    return (
        <div className="App">
            {/* Use regular path to the logo instead of SVG import */}
            <img src="/assets/logo.svg" alt="Binary Abacus Logo" className="logo" />

            <SettingsPanel
                isOpen={settingsOpen}
                toggleSettings={toggleSettings}
                nRows={nRows}
                handleRowsChange={handleRowsChange}
                nCols={nCols}
                handleColsChange={handleColsChange}
                encoding={encoding}
                handleEncodingChange={handleEncodingChange}
                showDigits={showDigits}
                handleShowDigitsChange={handleShowDigitsChange}
                showKeys={showKeys}
                handleShowKeysChange={handleShowKeysChange}
            />

            <main> {/* Wrap main content */}
                 <AbacusGrid
                    nRows={nRows}
                    nCols={nCols}
                    registers={registers}
                    encoding={encoding}
                    showDigits={showDigits}
                    showKeys={showKeys}
                    onBeadMouseDown={handleBeadMouseDown}
                    onBeadMouseEnter={handleBeadMouseEnter}
                    onContextMenu={handleContextMenu} // Pass context menu handler
                 />
            </main>

            <Footer />
        </div>
    );
}

export default App;
