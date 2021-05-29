import Promise from 'any-promise';
import React from 'react';
import ReactDOM from 'react-dom';
import CreatePushNotification from './components/CreatePushNotification';
import { SettingsProvider, useSettings } from './settings';
import { Button } from './theme';
import { apiGet, pluginNamespace } from './utils/apiFetch';
import { VARS } from './utils/constants';

const app = document.querySelector('#pwp-pushpost');

type PostData = {
  title?: string;
  body?: string;
  url?: string;
  imageId?: number;
};

const PushPost = ({ postId }: { postId?: number }) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [postData, setPostData] = React.useState<PostData>({});
  const [loading, setLoading] = React.useState<boolean>(false);

  const { 'manifest-name': manifestName = { value: '' } } = useSettings([
    'manifest-name',
  ]);

  const loadData = (): void => {
    setLoading(true);
    setShowModal(false);
    apiGet<PostData>(pluginNamespace + `push-post-data/${postId}/`)
      .then((data) => {
        setPostData(data);
        setShowModal(true);
      })
      .catch(() => alert(VARS.generalError))
      .finally(() => setLoading(false));
  };

  if (!postId || postId === 0) {
    return;
  }

  return (
    <div>
      {showModal && (
        <CreatePushNotification
          onClose={() => setShowModal(false)}
          title={postData.title}
          body={postData.body}
          imageId={postData.imageId}
          url={postData.url}
        />
      )}
      <Button disabled={loading} loading={loading} onClick={() => loadData()}>
        send
      </Button>
    </div>
  );
};

if (app) {
  const postId = parseInt(app.getAttribute('data-post-id')) || 0;

  ReactDOM.render(
    <SettingsProvider>
      <PushPost postId={postId} />
    </SettingsProvider>,
    app
  );
}
