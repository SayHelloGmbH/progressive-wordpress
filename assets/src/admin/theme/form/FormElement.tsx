import React from 'react';

import cn from '../../utils/classnames';

import styles from './FormElement.css';
import { useController } from 'react-hook-form';

const FormElement = ({
  form,
  label,
  name,
  rules = {},
  Input,
  className = '',
  inputClassName = '',
  ...inputProps
}: {
  form?: any;
  label?: string;
  name: string;
  rules?: any;
  Input?: any;
  className?: string;
  inputClassName?: string;
  [key: string]: any;
}) => {
  const { field } = useController({
    control: form.control,
    name,
    rules,
  });

  const error = React.useMemo(() =>
    name in form.errors ? form.errors[name] : null
  );

  return (
    <tr className={cn(styles.container, className)}>
      <th scope="row">
        <label htmlFor={name}>
          {label}
          {'required' in rules && '*'}
        </label>
      </th>
      <td>
        <Input
          name={name}
          className={cn(styles.input, inputClassName)}
          {...field}
          {...inputProps}
        />
        {error && <p className={styles.error}>{error.message}</p>}
      </td>
    </tr>
  );
};

export default FormElement;
