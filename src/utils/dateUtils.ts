/**
 * Formats a date as a localized string with date and time
 * @param date The date to format (Date object or ISO string)
 * @returns A formatted date string
 */
export function formatDate(date: Date | string): string {
  // Convert to Date object if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Returns a relative time string (e.g., "2 hours ago")
 * @param date The date to format (Date object or ISO string)
 * @returns A relative time string
 */
export function getRelativeTimeString(date: Date | string): string {
  // Convert to Date object if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  
  // Convert to seconds
  const diffInSecs = Math.floor(diffInMs / 1000);
  
  if (diffInSecs < 60) {
    return diffInSecs === 1 ? '1 second ago' : `${diffInSecs} seconds ago`;
  }
  
  // Convert to minutes
  const diffInMins = Math.floor(diffInSecs / 60);
  
  if (diffInMins < 60) {
    return diffInMins === 1 ? '1 minute ago' : `${diffInMins} minutes ago`;
  }
  
  // Convert to hours
  const diffInHours = Math.floor(diffInMins / 60);
  
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }
  
  // Convert to days
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays < 30) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }
  
  // For older dates, return the formatted date
  return formatDate(dateObj);
}