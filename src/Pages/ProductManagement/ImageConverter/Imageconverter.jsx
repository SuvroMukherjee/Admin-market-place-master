import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Imageconverter = () => {
    const [value, setValue] = useState('');
    const [copied, setCopied] = useState(false);

    return (
        <div>
            <input
                value={value}
                onChange={({ target: { value } }) => setValue(value, setCopied(false))}
            />

            <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
                <span>Copy to clipboard with span</span>
            </CopyToClipboard>

            <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
                <button>Copy to clipboard with button</button>
            </CopyToClipboard>

            {copied ? <span style={{ color: 'red' }}>Copied.</span> : null}
        </div>
    );
};

export default Imageconverter;
