import React from 'react';
import { VARS } from '../../utils/constants';

const useWpImageUrl = (id: number = 0): string => {
  const [src, setSrc] = React.useState<string>(null);
  const url = React.useMemo(
    () => (id ? `${VARS.restBase}wp/v2/media/${id}/` : null),
    [id]
  );

  React.useEffect(() => {
    const controller = new AbortController();
    if (!url) {
      setSrc('');
      controller.abort();
    } else {
      fetch(url, {
        signal: controller.signal,
      })
        .then((resp) => {
          if (resp.status >= 300) {
            alert(`failed to load URL "${url}"`);
          } else {
            return resp.json();
          }
        })
        .then((data) => {
          setSrc(data.media_details.sizes.thumbnail.source_url);
        })
        .catch((e) => {
          //console.error(e)
        });
    }
    return () => controller.abort();
  }, [url]);

  return src;
};

export default useWpImageUrl;
