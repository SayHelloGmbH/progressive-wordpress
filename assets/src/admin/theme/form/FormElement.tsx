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
    <tr className={cn(styles.container, className)}>
      <th scope="row">
        <label htmlFor={name}>
          {label || setting.label}
          {'required' in rules && '*'}
        </label>
      </th>
      <td>
        <Input
          name={name}
          className={cn(styles.input, inputClassName)}
          setting={setting}
          {...field}
          {...inputProps}
          onBlur={(e) => e && field.onChange(sanitizeValue(e.target.value))}
        />
        {error && <p className={styles.error}>{error.message}</p>}
      </td>
    </tr>
  );
};

export default FormElement;
