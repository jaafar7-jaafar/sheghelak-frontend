import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Sheghelak` : 'Sheghelak';
    return () => { document.title = 'Sheghelak'; };
  }, [title]);
}
