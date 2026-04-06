import { environment } from '../../../environments/environment';

/** API host origin without `/api/v1` (for static files under `/uploads/...`). */
export function apiPublicOrigin(): string {
  return environment.apiUrl.replace(/\/api\/v1\/?$/, '');
}

/** Turn a stored `/uploads/...` path into an absolute URL for `<a href>` / `<img src>`. */
export function fileUrlToAbsolute(fileUrl: string | null | undefined): string {
  if (!fileUrl) return '';
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) return fileUrl;
  const base = apiPublicOrigin().replace(/\/$/, '');
  const path = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
  return `${base}${path}`;
}
