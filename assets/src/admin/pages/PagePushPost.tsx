import React from 'react';
import { __ } from '@wordpress/i18n';
import PushPostForm from '../components/PushPost/PushPostForm';
import {
  Card,
  Loader,
  NOTICE_TYPES,
  PageContent,
  FormFeedback,
} from '../theme';
import { apiGet, pluginNamespace } from '../utils/apiFetch';
import { PushPostTypeI } from '../utils/types';

const PagePushPost = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');
  const [postTypes, setPostTypes] = React.useState<Array<PushPostTypeI>>([]);

  const loadPushPostTypes = () => {
    setLoading(true);
    apiGet<Record<string, PushPostTypeI>>(pluginNamespace + 'push-post-types')
      .then((resp) => setPostTypes(Object.values(resp)))
      .catch(() =>
        setError(__('PostTypes could not be loaded', 'progressive-wp'))
      )
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    loadPushPostTypes();
  }, []);

  return (
    <PageContent>
      <Card title={__('Push Post', 'progressive-wp')}>
        <p>
          {__(
            'This feature allows to send push notifications for posts directly in the edit screen or even automatically.',
            'progressive-wp'
          )}
        </p>
      </Card>
      <Card title={__('Post Types', 'progressive-wp')}>
        {loading ? (
          <Loader block />
        ) : error !== '' ? (
          <FormFeedback type={NOTICE_TYPES.ERROR}>{error}</FormFeedback>
        ) : (
          <PushPostForm postTypes={postTypes} />
        )}
      </Card>
    </PageContent>
  );
};

export default PagePushPost;
