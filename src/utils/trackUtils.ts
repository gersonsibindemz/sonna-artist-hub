
export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved': return 'CheckCircle';
    case 'rejected': return 'XCircle';
    default: return 'Clock';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'approved': return 'Aprovada';
    case 'rejected': return 'Rejeitada';
    default: return 'Pendente';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'text-green-400';
    case 'rejected': return 'text-red-400';
    default: return 'text-yellow-400';
  }
};
