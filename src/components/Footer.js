import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="footer">
            <p>
                {currentYear} Tommo Chung (<a href="https://tommo.page" target="_blank" rel="noopener noreferrer">tommo.page</a>) {' | '} CC-BY-SA 
                {' | '}
                <a href="https://github.com/tommoED/binary-abacus" target="_blank" rel="noopener noreferrer">source code</a>
                
            </p>
        </footer>
    );
};

export default Footer;
