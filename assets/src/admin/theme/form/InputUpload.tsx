import React from 'react';
import cn from '../../utils/classnames';
import { Image } from '../index';
import styles from './InputUpload.css';

const InputUpload = ({
  name,
  value = '',
  className = '',
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
  onChange = () => ({}),
}: {
  name: string;
  value?: string;
  className?: string;
  count?: number;
  title?: string;
  frame?: 'select' | 'post' | 'image' | 'audio' | 'video';
  library?: Object;
  buttonText?: string;
  imageSize?: number;
  onChange?: Function;
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
          .map(({ id }) => parseInt(id))
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
    onChange(images.join());
  }, [images]);

  return (
    <div className={cn(className, styles.container)}>
      {images.map((imageId) => (
        <div key={imageId} className={styles.element}>
          <Image className={styles.image} id={imageId} size={imageSize} />
          <button
            type="button"
            className={styles.remove}
            onClick={() => setImages(images.filter((i) => i !== imageId))}
          >
            remove
          </button>
        </div>
      ))}
      {images.length < count && (
        <button
          className={cn(styles.element, styles.add)}
          type="button"
          onClick={() => customMediaLibrary.open()}
          style={{ width: imageSize, height: imageSize }}
        >
          add image
        </button>
      )}
      <br />
      <input name={name} id={name} type="hidden" value={value} />
    </div>
  );
};

export default InputUpload;
