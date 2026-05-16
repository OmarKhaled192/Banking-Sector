export function formatDate(dateStr: string): string {
  if (!dateStr) return '';

  const date = new Date(dateStr);

  return date.toLocaleDateString('en-GB');
}

export function isSameMonthYear(
  dateStr: string,
  reference: Date = new Date()
): boolean {
  const date = new Date(dateStr);

  return (
    date.getMonth() === reference.getMonth() &&
    date.getFullYear() === reference.getFullYear()
  );
}
