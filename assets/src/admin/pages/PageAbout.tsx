import React from 'react';

import cn from '../utils/classnames';

import { Card } from '../theme';

import styles from './PageAbout.css';
import { __ } from '../utils/i18n';

const PageAbout = ({ className = '' }: { className?: string }) => (
  <React.Fragment>
    <div className={cn(className, styles.intro)}>
      <Card title={__('plugin.menu.manifest')} canToggle={false}>
        <p
          dangerouslySetInnerHTML={{
            __html: __('plugin.intro.manifest.title'),
          }}
        />
        <p>{__('plugin.intro.manifest')}</p>
      </Card>
      <Card title={__('plugin.menu.offline')} canToggle={false}>
        <p
          dangerouslySetInnerHTML={{ __html: __('plugin.intro.offline.title') }}
        />
        <p>{__('plugin.intro.offline')}</p>
      </Card>
      <Card title={__('plugin.menu.push')} canToggle={false}>
        <p
          dangerouslySetInnerHTML={{ __html: __('plugin.intro.push.title') }}
        />
        <p>{__('plugin.intro.push')}</p>
      </Card>
    </div>
    <div className={styles.footer}>
      <div className={styles.credits}>
        <p>
          <b>{__('plugin.footer.thanks')}</b>
        </p>
        <p
          dangerouslySetInnerHTML={{
            __html: __('plugin.footer.credits', {
              author: '<a href="https://nico.dev">Nico Martin</a>',
            }),
          }}
        />
        <p
          dangerouslySetInnerHTML={{
            __html: __('plugin.footer.involved', {
              github:
                '<a href="https://github.com/SayHelloGmbH/progressive-wordpress">GitHub</a>',
            }),
          }}
        />
      </div>
      <div className={styles.help}>
        <p>
          <b>{__('plugin.footer.help.title')}</b>
        </p>
        <p>
          {__('plugin.footer.help.support')}:<br />
          <a href="https://caniuse.com/#feat=serviceworkers">
            https://caniuse.com/#feat=serviceworkers
          </a>
        </p>
        <p>
          {__('plugin.footer.help.contact')}:<br />
          <a href="https://wordpress.org/support/plugin/progressive-wp/">
            https://wordpress.org/support/plugin/progressive-wp/
          </a>
        </p>
      </div>
    </div>
  </React.Fragment>
);

export default PageAbout;
