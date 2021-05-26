import React from 'react';
import { __ } from '@wordpress/i18n';
import cn from '../../utils/classnames';
import { VARS } from '../../utils/constants';
import { untrailingSlashIt } from '../../utils/helpers';
import styles from './InputOfflineContent.css';

const InputOfflineContent = ({
  name,
  value = '',
  className = '',
  rows = 4,
  onChange,
  ...props
}: {
  name: string;
  value?: string;
  className?: string;
  onChange: Function;
  rows?: number;
}) => {
  const [addUrl, setAddUrl] = React.useState<string>('');
  const urls = React.useMemo<Array<string>>(
    () => value.split('\n').filter((e) => Boolean(e)),
    [value]
  );

  const removeURL = (url: string): void => {
    onChange(urls.filter((e) => e !== url).join('\n'));
  };

  const addURL = (): void => {
    if (!isValid) {
      return;
    }
    onChange(
      (urls.indexOf(addUrl) === -1 ? [...urls, addUrl] : urls).join('\n')
    );
    setAddUrl('');
  };

  const isValid = React.useMemo(() => {
    if (addUrl === '') {
      return true;
    }
    let url;
    try {
      url = new URL(addUrl);
    } catch (_) {
      return false;
    }

    return addUrl.indexOf(untrailingSlashIt(VARS.homeUrl)) === 0;
  }, [addUrl]);

  return (
    <React.Fragment>
      <ul className={cn(styles.list)}>
        {urls.map((url) => (
          <li className={cn(styles.listEntry)}>
            <span className={cn(styles.url)}>{url}</span>
            <button
              type="button"
              className={cn(styles.buttonRemove)}
              onClick={() => removeURL(url)}
            >
              {__('remove URL', 'progressive-wp')}
            </button>
          </li>
        ))}
      </ul>
      <div className={cn(styles.addUrlContainer)}>
        <div className={cn(styles.addUrl)}>
          <input
            type="text"
            id={`${name}-add`}
            name={`${name}-add`}
            value={addUrl}
            className={cn(styles.addUrlInput)}
            placeholder={__('Add URL', 'progressive-wp')}
            onChange={(e) => setAddUrl(e.target.value)}
          />
          <button
            className={cn(styles.buttonAdd)}
            type="button"
            onClick={() => addURL()}
            disabled={!isValid}
          >
            {__('Add URL', 'progressive-wp')}
          </button>
        </div>
        {!isValid && (
          <p className={cn(styles.addUrlError)}>
            {__('has to be a valid URL and start with', 'progressive-wp') +
              ' ' +
              untrailingSlashIt(VARS.homeUrl)}
          </p>
        )}
      </div>
    </React.Fragment>
  );
};

export default InputOfflineContent;
