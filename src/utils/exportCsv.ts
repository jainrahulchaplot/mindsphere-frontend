import type { JournalEntry } from '../api/types';

export function exportJournalCsv(entries: JournalEntry[]) {
  const headers = ['Date', 'Summary', 'Emotions'];
  const rows = entries.map(entry => [
    new Date(entry.created_at).toLocaleDateString(),
    entry.summary,
    entry.emotions.join(', ')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `journals_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
