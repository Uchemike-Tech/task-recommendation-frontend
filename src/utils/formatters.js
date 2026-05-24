export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTimeEstimate = (hours) => {
  if (!hours) return 'N/A';
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours === 1) return '1 hour';
  if (hours < 24) return `${hours} hours`;
  const days = Math.floor(hours / 24);
  const remaining = hours % 24;
  return remaining > 0 ? `${days}d ${remaining}h` : `${days} days`;
};

export const formatConfidence = (confidence) => {
  if (!confidence) return 'N/A';
  return `${(confidence * 100).toFixed(1)}%`;
};

export const formatJoinedDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

export const getPriorityLabel = (priority) => {
  switch (priority) {
    case 1: return 'Critical';
    case 2: return 'High';
    case 3: return 'Medium';
    default: return `P${priority}`;
  }
};

export const complexityStars = (complexity) => {
  return '★'.repeat(complexity) + '☆'.repeat(5 - complexity);
};
