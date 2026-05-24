import React from 'react';
import Button from '../common/Button';
import { formatConfidence } from '../../utils/formatters';
import '../../styles/RecommendationCard.css';

export default function RecommendationCard({ recommendation, onComplete, loading }) {
  if (!recommendation || !recommendation.recommended_task_name) {
    return null;
  }

  const alternatives = recommendation.top_3
    ? recommendation.top_3.slice(1, 3)
    : [];

  return (
    <div className="recommendation-card animate-slideUp">
      <div className="rec-main">
        <div className="rec-badge">
          <span className="rec-badge-dot" />
        </div>
        <div className="rec-content">
          <span className="rec-label">AI RECOMMENDATION</span>
          <h2 className="rec-task-name">{recommendation.recommended_task_name}</h2>
          <span className="rec-confidence">
            {formatConfidence(recommendation.confidence)} Confidence
          </span>
          <p className="rec-description">
            Based on completed tasks and project dependencies
          </p>
          <Button
            variant="secondary"
            size="md"
            loading={loading}
            icon="✓"
            onClick={() => onComplete(recommendation.recommended_task_id)}
            className="rec-cta"
          >
            Complete This Task
          </Button>
        </div>
      </div>

      {alternatives.length > 0 && (
        <div className="rec-alternatives">
          <span className="rec-alt-label">ALSO CONSIDER</span>
          <div className="rec-alt-list">
            {alternatives.map((task) => (
              <div key={task.task_id} className="rec-alt-item">
                <span className="rec-alt-name">{task.task_name}</span>
                <span className="rec-alt-confidence">
                  {formatConfidence(task.confidence)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
