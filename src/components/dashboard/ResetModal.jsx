import React from 'react';
import Button from '../common/Button';
import '../../styles/ResetModal.css';

export default function ResetModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay animate-fadeIn" onClick={onCancel}>
      <div
        className="modal-card animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
      >
        <div className="modal-icon-line" />
        <h2 id="reset-modal-title" className="modal-title">Reset All Tasks?</h2>
        <p className="modal-description">
          This will mark all tasks as pending again. You can't undo this action.
        </p>
        <div className="modal-actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
