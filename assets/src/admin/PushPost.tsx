import React from 'react';
import ReactDOM from 'react-dom';
import { __ } from '@wordpress/i18n';
import CreatePushNotification from './components/CreatePushNotification';
import { SettingsProvider, useSettings } from './settings';
import { Button, ButtonGroup, ShadowBox } from './theme';
import { apiGet, pluginNamespace } from './utils/apiFetch';
import { VARS } from './utils/constants';

const app = document.querySelector('#pwp-pushpost');

type PostData = {
  title?: string;
  body?: string;
  url?: string;
  imageId?: number;
};

const PushPost = ({
  postId,
  sent: initSent,
}: {
  postId?: number;
  sent: boolean;
}) => {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [showResendModal, setShowResendModal] = React.useState<boolean>(false);
  const [postData, setPostData] = React.useState<PostData>({});
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sent, setSent] = React.useState<boolean>(initSent);

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
          postId={postId}
          onPushSent={() => setSent(true)}
        />
      )}
      {showResendModal && (
        <ShadowBox
          title={__('Send again', 'progressive-wp')}
          size="small"
          close={() => setShowResendModal(false)}
        >
          <p>
            {__(
              'Are you sure you want to send another push notification?',
              'progressive-wp'
            )}
          </p>
          <ButtonGroup>
            <Button
              buttonType="primary"
              onClick={() => {
                setShowModal(true);
                setShowResendModal(false);
              }}
            >
              {__('Yes', 'progressive-wp')}
            </Button>
            <Button onClick={() => setShowResendModal(false)}>
              {__('No', 'progressive-wp')}
            </Button>
          </ButtonGroup>
        </ShadowBox>
      )}
      {sent ? (
        <React.Fragment>
          <p>
            {__(
              'The push notification has already been sent. Do you want to send it again?',
              'progressive-wp'
            )}
          </p>
          <p>
            <Button onClick={() => setShowResendModal(true)}>
              {__('Send again', 'progressive-wp')}
            </Button>
          </p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p>
            {__(
              'This function opens the push notification modal for this post.',
              'progressive-wp'
            )}
          </p>
          <p>
            <Button
              disabled={loading}
              loading={loading}
              onClick={() => loadData()}
            >
              {__('Create push notification', 'progressive-wp')}
            </Button>
          </p>
        </React.Fragment>
      )}
    </div>
  );
};

if (app) {
  const postId = parseInt(app.getAttribute('data-post-id')) || 0;
  const sent = app.getAttribute('data-pushpost-sent') === 'true';

  ReactDOM.render(
    <SettingsProvider>
      <PushPost postId={postId} sent={sent} />
    </SettingsProvider>,
    app
  );
}
