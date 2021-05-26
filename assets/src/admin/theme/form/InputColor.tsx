import React from 'react';
import { ColorPicker } from '@wordpress/components';
import cn from '../../utils/classnames';
import styles from './InputColor.css';

const InputColor = ({
  name,
  value = '',
  className = '',
  onChange,
  onBlur,
}: {
  name: string;
  value?: string;
  className?: string;
  onChange: Function;
  onBlur: Function;
}) => {
  const [show, setShow] = React.useState<boolean>(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <span
          className={styles.colorPreview}
          style={{ backgroundColor: value }}
        />
        <input
          name={name}
          className={cn(className, styles.input)}
          id={name}
          value={value}
          type="text"
          onFocus={() => setShow(true)}
          onBlur={() => setShow(false)}
          onChange={(e) => onChange(e)}
        />
      </div>
      {show && (
        <div className={styles.picker}>
          <ColorPicker
            disableAlpha
            onChangeComplete={(color) => {
              onChange(color.hex);
              onBlur();
            }}
            color={value}
          />
        </div>
      )}
    </div>
  );
};

export default InputColor;
