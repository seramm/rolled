import createClient from 'openapi-fetch';
import type { paths } from './schema';

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const client = createClient<paths>({ credentials: 'same-origin' });

client.use({
  onRequest({ request }) {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const csrftoken = getCookie('csrftoken');
      if (csrftoken) {
        request.headers.set('X-CSRFToken', csrftoken);
      }
    }
    return request;
  },
});

export default client;
