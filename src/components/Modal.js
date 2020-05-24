import React from 'react';

const Modal = ({show, content, onHide, onConfirm, className, isLoading, errorMessage}) => {

    if (show) {
        return (
            <div className={className}>
                <span onClick={() => onHide()}>&times;</span>
                {content}
                <p />
                {isLoading ? <span>Confirming...</span> : <span onClick={() => onConfirm()}>Confirm</span>}
                {errorMessage && (<div>{errorMessage}</div>)}
            </div>
        );
    }

    return null;
    
};

export default Modal;