import React from 'react';
import { __ } from '@wordpress/i18n';

import cn from '../utils/classnames';
import { Link } from '../utils/router';

import { Card } from '../theme';

import styles from './PageAbout.css';

const PageAbout = ({ className = '' }: { className?: string }) => (
  <React.Fragment>
    <div className={cn(className, styles.intro)}>
      <Card title={__('Add to Homescreen', 'progressive-wp')}>
        <p
          dangerouslySetInnerHTML={{
            __html: __(
              'Provide an <b>integrated</b> user experience!',
              'progressive-wp'
            ),
          }}
        />
        <p>
          {__(
            "Progressive WordPress makes it easy to encourage users to add your website to their homescreen. But that's not all. It also allows you to control the display behaviour of your website so it will be shown without any browser elements. Just like a native app.",
            'progressive-wp'
          )}
        </p>
        <p>
          <Link to="manifest" isButton>
            {__('configure', 'progressive-wp')}
          </Link>
        </p>
      </Card>
      <Card title={__('Offline usage', 'progressive-wp')}>
        <p
          dangerouslySetInnerHTML={{
            __html: __(
              'Make your website <b>reliable</b>. Even on flaky internet connections!',
              'progressive-wp'
            ),
          }}
        />
        <p>
          {__(
            "No connection? No problem. Progressive WordPress pre-caches all critical assets of your website, as well as all visited resources. So if there's no internet connection it will serve the resources from the local storage. No more error downasaur!",
            'progressive-wp'
          )}
        </p>
      </Card>
      <Card title={__('Push Notifications', 'progressive-wp')}>
        <p
          dangerouslySetInnerHTML={{
            __html: __(
              'Keep your users <b>engaged</b> by sending push notifications!',
              'progressive-wp'
            ),
          }}
        />
        <p>
          {__(
            'You just published new content and you want to let everyone know? Why not send a push notification? Progressive WordPress has an integrated connection to Firebase that lets you manage registered devices and send push notifications to all or selected devices!',
            'progressive-wp'
          )}
        </p>
      </Card>
    </div>
    <div className={styles.footer}>
      <div className={styles.credits}>
        <p>
          <b>
            {__(
              'Thank you for using Progressive WordPress (PWA)!',
              'progressive-wp'
            )}
          </b>
        </p>
        <p
          dangerouslySetInnerHTML={{
            __html: __(
              'This plugin was developed by {author} to use progressive web app features for your WordPress website.',
              'progressive-wp'
            ),
          }}
        />
        <p
          dangerouslySetInnerHTML={{
            __html: __(
              'If you like this plugin feel free to get involved with the development on {github}',
              'progressive-wp'
            ),
          }}
        />
      </div>
      <div className={styles.help}>
        <p>
          <b>{__('Need Help?', 'progressive-wp')}</b>
        </p>
        <p>
          {__(
            'Please make sure your device supports Progressive Web Apps.',
            'progressive-wp'
          )}
          :<br />
          <a href="https://caniuse.com/#feat=serviceworkers">
            https://caniuse.com/#feat=serviceworkers
          </a>
        </p>
        <p>
          {__(
            'Still not working? Please visit the support forum.',
            'progressive-wp'
          )}
          :<br />
          <a href="https://wordpress.org/support/plugin/progressive-wp/">
            https://wordpress.org/support/plugin/progressive-wp/
          </a>
        </p>
      </div>
    </div>
  </React.Fragment>
);

export default PageAbout;
