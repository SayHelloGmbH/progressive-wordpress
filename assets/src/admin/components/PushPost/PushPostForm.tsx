import React from 'react';
import { useForm } from 'react-hook-form';
import { __ } from '@wordpress/i18n';
import {
  Form,
  FormControls,
  FormElement,
  FormFeedback,
  InputCheckbox,
  InputText,
  NOTICE_TYPES,
} from '../../theme';
import { apiPost, pluginNamespace } from '../../utils/apiFetch';
import { PushPostSettingsTypeI, PushPostTypeI } from '../../utils/types';
import styles from './PushPostForm.css';

const PushPostForm = ({ postTypes }: { postTypes: Array<PushPostTypeI> }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');

  const form = useForm<Record<string, PushPostSettingsTypeI>>({
    defaultValues: postTypes.reduce(
      (acc, postType) => ({
        [postType.postType]: {
          active: postType.active,
          title: postType.title,
          body: postType.body,
          autoPush: postType.autoPush,
        },
        ...acc,
      }),
      {}
    ),
  });

  const formData = form.watch();

  const submit = (data) => {
    setLoading(true);
    setError('');
    console.log(data);
    const enrichedData: Record<
      string,
      PushPostSettingsTypeI
    > = postTypes.reduce(
      (acc, postType) => ({
        [postType.postType]: {
          active: data[postType.postType].active || false,
          title: data[postType.postType].title || postType.title,
          body: data[postType.postType].body || postType.body,
          autoPush:
            data[postType.postType].autoPush === undefined
              ? postType.autoPush
              : data[postType.postType].autoPush,
        },
        ...acc,
      }),
      {}
    );

    apiPost(pluginNamespace + 'push-post-types', enrichedData)
      .then(() => {})
      .catch((e) => setError(e.toString()))
      .finally(() => setLoading(false));
  };

  return (
    <Form onSubmit={form.handleSubmit(submit)}>
      {postTypes.map((postType) => (
        <div className={styles.postType}>
          <FormElement
            form={form}
            name={`${postType.postType}.active`}
            label={postType.name}
            Input={InputCheckbox}
          />
          {(formData[postType.postType]?.active || false) === true && (
            <React.Fragment>
              <FormElement
                form={form}
                name={`${postType.postType}.title`}
                label={__('Title', 'progressive-wp')}
                Input={InputText}
              />
              <FormElement
                form={form}
                name={`${postType.postType}.body`}
                label={__('Body', 'progressive-wp')}
                Input={InputText}
              />
              <FormElement
                form={form}
                name={`${postType.postType}.autoPush`}
                label={__('auto push', 'progressive-wp')}
                Input={InputCheckbox}
                Description={
                  <p>
                    {__(
                      'If this option is checked, a push notification will be sent to all users as soon as a post is published.',
                      'progressive-wp'
                    )}
                  </p>
                }
              />
            </React.Fragment>
          )}
        </div>
      ))}
      {error !== '' && (
        <FormFeedback type={NOTICE_TYPES.ERROR}>{error}</FormFeedback>
      )}
      <FormControls type="submit" disabled={loading} />
    </Form>
  );
};

export default PushPostForm;
