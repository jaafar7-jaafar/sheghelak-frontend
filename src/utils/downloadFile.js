import { getAccessToken } from '../services/api';

/**
 * Downloads a file from a cross-origin backend URL properly.
 * The native <a download> attribute is ignored by browsers for cross-origin URLs,
 * so we fetch the file as a blob with auth headers and trigger the download manually.
 */
export async function downloadFile(url, filename = 'download') {
  const token = getAccessToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(url, { credentials: 'include', headers });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // Try to extract filename from Content-Disposition header if not provided
    const disposition = response.headers.get('content-disposition');
    if (disposition) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) filename = match[1].replace(/['"]/g, '').trim() || filename;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(objectUrl), 200);
  } catch {
    // Fallback: open in new tab (e.g. if fetch blocked by CORS on some deployments)
    window.open(url, '_blank');
  }
}
