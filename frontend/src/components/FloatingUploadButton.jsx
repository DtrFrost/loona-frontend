import React, { useRef, useState } from 'react';
import './FloatingUploadButton.css';

const FloatingUploadButton = ({ onFileUpload, uploading }) => {
    const fileInputRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            files.forEach(file => onFileUpload(file));
        }
        e.target.value = null;
    };

    return (
        <>
            <button
                className={`floating-upload-btn ${uploading ? 'uploading' : ''} ${isHovered ? 'hovered' : ''}`}
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={uploading}
            >
                {uploading ? (
                    <div className="upload-spinner-small"></div>
                ) : (
                    <svg 
                        className="upload-icon" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            d="M12 16V4M8 8L12 4L16 8" 
                            stroke="white" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                        <path 
                            d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" 
                            stroke="white" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
                <span className="tooltip">
                    {uploading ? 'Загрузка...' : 'Загрузить файл'}
                </span>
            </button>
            
            <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </>
    );
};

export default FloatingUploadButton;