import React from 'react';

import cn from '../../utils/classnames';

import styles from './FormElement.css';
import { useController } from 'react-hook-form';
import { useSettings } from '../../settings';

const FormElement = ({
  form,
  label,
  name,
  rules = {},
  Input,
  className = '',
  inputClassName = '',
  sanitizeValue = (value) => value,
  ...inputProps
}: {
  form?: any;
  label?: string;
  name: string;
  rules?: any;
  Input?: any;
  className?: string;
  inputClassName?: string;
  sanitizeValue?: Function;
  [key: string]: any;
}) => {
  const { field } = useController({
    control: form.control,
    name,
    rules,
  });
  const { [name]: setting } = useSettings([name]);

  /**
   *
   */

  const error = React.useMemo(
    () => (name in form.errors ? form.errors[name] : null),
    [form.errors, name]
  );

  return (
    <div className={cn(styles.container, className)}>
      <label htmlFor={name} className={styles.label}>
        {label || setting.label}
        {'required' in rules && '*'}
      </label>
      <div className={styles.content}>
        <Input
          name={name}
          className={cn(styles.input, inputClassName)}
          setting={setting}
          {...field}
          {...inputProps}
          onBlur={(e) => e && field.onChange(sanitizeValue(e.target.value))}
        />
        {error && <p className={styles.error}>{error.message}</p>}
      </div>
    </div>
  );
};

export default FormElement;
