import React from 'react';

interface ModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  className: string;
  isLoading: boolean;
  errorMessage: string;
  children?: React.ReactNode;
}

const Modal = ({
  show,
  onHide,
  onConfirm,
  className,
  isLoading,
  errorMessage,
  children,
}: ModalProps) => {
  if (show) {
    return (
      <div className={className}>
        <span onClick={onHide}>&times;</span>
        {children}
        <p />
        {isLoading ? (
          <span>Confirming...</span>
        ) : (
          <span onClick={() => onConfirm()}>Confirm</span>
        )}
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    );
  }

  return null;
};

export default Modal;
