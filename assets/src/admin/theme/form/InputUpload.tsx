import React from 'react';

import cn from '../../utils/classnames';

import FormElement, { Input } from './FormElement';
import { Image } from '../index';

import './InputUpload.css';

const InputUpload = ({
  form,
  name,
  label,
  rules = {},
  count = 1,
  title = 'Select Images',
  frame = 'select',
  library = {
    order: 'DESC',
    orderby: 'date',
    type: 'image',
    search: null,
    uploadedTo: null,
  },
  buttonText = 'Select',
  imageSize = 80,
}: {
  form: any;
  name: string;
  label: string;
  rules?: {};
  count?: number;
  title?: string;
  frame?: 'select' | 'post' | 'image' | 'audio' | 'video';
  library?: Object;
  buttonText?: string;
  imageSize?: number;
}) => {
  const customMediaLibrary = React.useMemo(
    () =>
      // @ts-ignore
      window.wp.media({
        frame,
        title,
        multiple: count > 1,
        library,
        button: {
          text: buttonText,
        },
      }),
    []
  );

  const Input = ({ id, className, field, value }: Input) => {
    const [images, setImages] = React.useState<number[]>(
      value
        .toString()
        .split(',')
        .map((i) => parseInt(i))
        .filter((i) => !!i)
    );

    React.useEffect(() => {
      customMediaLibrary.on('select', () =>
        setImages(
          customMediaLibrary
            .state()
            .get('selection')
            .toJSON()
            .map(({ id }) => id)
            .slice(0, count)
        )
      );
    }, [customMediaLibrary]);

    React.useEffect(() => {
      customMediaLibrary.on('open', () => {
        const selection = customMediaLibrary.state().get('selection');
        images.map((id) => {
          //@ts-ignore
          selection.add(wp.media.attachment(id));
        });
      });
    }, [customMediaLibrary, images]);

    React.useEffect(() => {
      field.onChange(images.join(','));
    }, [images]);

    return (
      <div className={cn(className, 'input-upload')}>
        {images.map((imageId) => (
          <div className="input-upload__element">
            <Image
              className="input-upload__image"
              id={imageId}
              size={imageSize}
            />
            <button
              type="button"
              className="input-upload__remove"
              onClick={() => setImages(images.filter((i) => i !== imageId))}
            >
              remove
            </button>
          </div>
        ))}
        {images.length < count && (
          <button
            className={cn('input-upload__element', 'input-upload__add')}
            type="button"
            onClick={() => customMediaLibrary.open()}
            style={{ width: imageSize, height: imageSize }}
          >
            add image
          </button>
        )}
        <br />
        <input {...field} id={id} type="hidden" value={value} />
      </div>
    );
  };

  return (
    <FormElement
      form={form}
      Input={Input}
      label={label}
      name={name}
      rules={rules}
    />
  );
};

export default InputUpload;
