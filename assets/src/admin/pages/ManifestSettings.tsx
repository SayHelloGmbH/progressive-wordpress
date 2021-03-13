import React from 'react';

import { __ } from '@wordpress/i18n';

import {
  Card,
  Form,
  FormControls,
  FormElement,
  FormFeedback,
  InputColor,
  InputSelect,
  InputText,
  InputTextarea,
  NOTICE_TYPES,
  PageContent,
} from '../theme';
import { useTempSettings, useSettingsForm } from '../settings';
import { VARS } from '../utils/constants';

import styles from './ManifestSettings.css';

const ManifestSettings = ({ settingsKeys }: { settingsKeys: string[] }) => {
  const { form, submit, error, loading } = useSettingsForm(settingsKeys);
  const trackingKeys = VARS.trackingParamKeys;
  const trackingSettings = trackingKeys
    ? useTempSettings(
        trackingKeys.map((key) => `manifest-tracking-starturl-${key}`)
      )
    : [];

  const { ['installable-mode']: mode } = form.watch(['installable-mode']);

  const gtmTrackingString = React.useMemo(
    () =>
      trackingKeys
        ? trackingKeys
            .map((key) => {
              if (
                trackingSettings[`manifest-tracking-starturl-${key}`] &&
                trackingSettings[`manifest-tracking-starturl-${key}`].value
              ) {
                return (
                  `utm_${key}=` +
                  trackingSettings[`manifest-tracking-starturl-${key}`].value
                );
              }
            })
            .filter((e) => !!e)
            .join('&')
        : '',
    [trackingSettings]
  );

  return (
    <Form onSubmit={submit}>
      <PageContent>
        <Card
          title={__('Add to homescreen', 'progressive-wp')}
          canToggleKey="a2h"
        >
          <p>
            <b>{__('Make your website installable!', 'progressive-wp')}</b>
            <br />
            {__(
              'With this feature you are able to display an "add to homescreen" prompt. This way your website gets a prominent place on the users home screen right next to the native apps.',
              'progressive-wp'
            )}
          </p>
          <ul>
            <li>
              <b>{__('Normal', 'progressive-wp')}</b>:{' '}
              {__(
                'The browser will show a mini-infobar which opens the install promt',
                'progressive-wp'
              )}
            </li>
            <li>
              <b>{__('On element click', 'progressive-wp')}</b>:{' '}
              {__(
                'Define an element as an install-prompt trigger',
                'progressive-wp'
              )}
            </li>
            <li>
              <b>{__('Never', 'progressive-wp')}</b>:{' '}
              {__(
                'This will override the display mode to `browser`, so the browser will not try to add an install-prompt',
                'progressive-wp'
              )}
            </li>
          </ul>
          <FormElement
            form={form}
            name="installable-mode"
            rules={{
              required: 'This value is required',
            }}
            Input={InputSelect}
          />
          {mode === 'trigger' && (
            <FormElement
              form={form}
              name="installable-onclick"
              rules={{
                required: 'This value is required',
              }}
              Input={InputText}
            />
          )}
        </Card>
        <Card
          title={__('Homescreen values', 'progressive-wp')}
          canToggleKey="homescreen"
        >
          <p>
            {__(
              'This values are used to create a manifest.json file, which then controls the appearance of you progressive web app.',
              'progressive-wp'
            )}
            <br />
            {__('Read all about the web app manifest:', 'progressive-wp')}{' '}
            <a
              href="https://developer.mozilla.org/de/docs/Web/Manifest"
              target="_blank"
            >
              https://developer.mozilla.org/de/docs/Web/Manifest
            </a>
          </p>
          <FormElement
            form={form}
            name="manifest-name"
            rules={{
              required: 'This value is required',
            }}
            Input={InputText}
          />
          <FormElement
            form={form}
            name="manifest-short-name"
            rules={{
              required: 'This value is required',
            }}
            Input={InputText}
          />
          <FormElement
            form={form}
            name="manifest-starturl"
            rules={{
              required: 'This value is required',
            }}
            Input={InputSelect}
          />
          <FormElement
            form={form}
            name="manifest-description"
            rules={{
              required: 'This value is required',
            }}
            Input={InputTextarea}
          />
          <FormElement
            form={form}
            name="manifest-display"
            rules={{
              required: 'This value is required',
            }}
            Input={InputSelect}
          />
          <FormElement
            form={form}
            name="manifest-orientation"
            rules={{
              required: 'This value is required',
            }}
            Input={InputSelect}
          />
          <FormElement
            form={form}
            name="manifest-theme-color"
            rules={{
              required: 'This value is required',
            }}
            Input={InputColor}
          />
          <FormElement
            form={form}
            name="manifest-background-color"
            rules={{
              required: 'This value is required',
            }}
            Input={InputColor}
          />
        </Card>
        {!!trackingKeys && (
          <Card
            title={__('Tracking', 'progressive-wp')}
            canToggleKey="starturl-tracking"
          >
            <p>
              {__(
                'A query string will be added to the start URL',
                'progressive-wp'
              )}
            </p>
            {gtmTrackingString !== '' && (
              <p>
                <code className={styles.gtmTrackingCode}>
                  {gtmTrackingString}
                </code>
              </p>
            )}
            {trackingKeys.map((key) => (
              <FormElement
                form={form}
                name={`manifest-tracking-starturl-${key}`}
                Input={InputText}
                sanitizeValue={(value) => encodeURIComponent(value)}
              />
            ))}
          </Card>
        )}
        {error !== '' && (
          <FormFeedback type={NOTICE_TYPES.ERROR} message={error} />
        )}
        <FormControls type="submit" disabled={loading} />
      </PageContent>
    </Form>
  );
};

export default ManifestSettings;
