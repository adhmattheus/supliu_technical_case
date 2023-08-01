const formatDuration = (duration: string): string => {
  const durationInSeconds = parseInt(duration, 10); 
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default formatDuration;