import React from 'react';
import { __ } from '@wordpress/i18n';

import { useSettingsForm } from '../settings';
import {
  Card,
  Form,
  FormControls,
  FormElement,
  FormFeedback,
  InputCheckbox,
  InputColor,
  InputSelect,
  InputText,
  InputTextarea,
  NOTICE_TYPES,
  PageContent,
} from '../theme';
import InputOfflineContent from './offlineUsage/InputOfflineContent';
import { VARS } from '../utils/constants';

const OfflineUsageSettings = ({ settingsKeys }: { settingsKeys: string[] }) => {
  const { form, submit, error, loading } = useSettingsForm(settingsKeys);

  return (
    <Form onSubmit={submit}>
      {' '}
      <PageContent>
        <Card
          title={__('Offline Usage', 'progressive-wp')}
          canToggleKey="offline"
        >
          <p>
            <b>
              {__(
                'This feature allows you to provide offline usage for your website.',
                'progressive-wp'
              )}
            </b>
            <br />
            {__(
              'By default, a copy of each page is stored in the browser cache as the visitor views it. This allows a visitor to load any previously viewed page while they are offline. The plugin also defines a special “offline page”, which allows you to customize a message and the experience if the app is offline and the page is not in the cache. Additionally, you can define other pre-cached resources using the "offline content" feature',
              'progressive-wp'
            )}
          </p>
          <FormElement form={form} name="offline-page" Input={InputSelect} />
          <FormElement
            form={form}
            name="offline-content"
            Input={InputOfflineContent}
          />
        </Card>
        <Card
          title={__('Caching strategies', 'progressive-wp')}
          canToggleKey="caching-strategies"
        >
          <p>
            {__(
              'All network requests are cached by progressive WordPress. Here you are able to manually change the caching strategy for some request types.',
              'progressive-wp'
            )}
          </p>
          <ul>
            <li>
              <b>{__('Stale While Revalidate', 'progressive-wp')}:</b>{' '}
              {__(
                'This strategy will use a cached response for a request if it is available and update the cache in the background with a response form the network. (If it’s not cached it will wait for the network response and use that). This is a fairly safe strategy as it means users are regularly updating their cache. The downside of this strategy is that it’s always requesting an asset from the network, using up the user’s bandwidth.',
                'progressive-wp'
              )}
            </li>
            <li>
              <b>{__('Network First', 'progressive-wp')}</b>:{' '}
              {__(
                'This will try and get a request from the network first. If it receives a response, it’ll pass that to the browser and also save it to a cache. If the network request fails, the last cached response will be used.',
                'progressive-wp'
              )}
            </li>
            <li>
              <b>{__('Cache First', 'progressive-wp')}</b>:{' '}
              {__(
                'This strategy will check the cache for a response first and use that if one is available. If the request isn’t in the cache, the network will be used and any valid response will be added to the cache before being passed to the browser.',
                'progressive-wp'
              )}
            </li>
            <li>
              <b>{__('Network Only', 'progressive-wp')}</b>:{' '}
              {__(
                "This strategy won't chache anything. The network will be used and the response will be passed directly to the browser (That's how the browser would handle the request without the Service Worker).",
                'progressive-wp'
              )}
            </li>
          </ul>
          {Object.entries(VARS.cachingStrategyRoutes).map(([key, route]) => (
            <FormElement
              form={form}
              name={`offline-strategy-${key}`}
              Input={InputSelect}
            />
          ))}
        </Card>
        <Card
          title={__('Offline indicator', 'progressive-wp')}
          canToggleKey="offline-indicator"
        >
          <p>
            {__(
              'This adds a little notice which will be displayed if the device is offline.',
              'progressive-wp'
            )}
          </p>
          <FormElement
            form={form}
            name="offline-indicator"
            Input={InputCheckbox}
          />
          <FormElement
            form={form}
            name="offline-indicator-text"
            Input={InputText}
          />
          <FormElement
            form={form}
            name="offline-indicator-position"
            Input={InputSelect}
          />
          <FormElement
            form={form}
            name="offline-indicator-color-text"
            Input={InputColor}
          />
          <FormElement
            form={form}
            name="offline-indicator-color-background"
            Input={InputColor}
          />
        </Card>
        {error !== '' && (
          <FormFeedback type={NOTICE_TYPES.ERROR} message={error} />
        )}
        <FormControls type="submit" disabled={loading} />
      </PageContent>
    </Form>
  );
};

export default OfflineUsageSettings;
