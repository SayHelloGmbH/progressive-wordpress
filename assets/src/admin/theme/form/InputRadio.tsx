import React from 'react';
import cn from '../../utils/classnames';
import styles from './InputRadio.css';

const InputRadio = ({
  name,
  value = '',
  className = '',
  options = {},
  optionProps = () => ({}),
  onChange = () => ({}),
}: {
  name: string;
  value?: string;
  className?: string;
  options: Record<string, string>;
  optionProps?: (value: string, label: string) => Record<string, any>;
  onChange?: Function;
}) => (
  <div className={cn(className, styles.input)}>
    {Object.entries(options).map(([optionValue, optionLabel]) => (
      <div className={styles.element} key={optionValue}>
        <input
          type="radio"
          className={styles.input}
          id={`${name}-${optionValue}`}
          name={name}
          value={optionValue}
          checked={value === optionValue}
          onChange={(e) => onChange(optionValue)}
          {...optionProps(optionValue, optionLabel)}
        />
        <label className={styles.label} htmlFor={`${name}-${optionValue}`}>
          {optionLabel}
        </label>
      </div>
    ))}
  </div>
);

export default InputRadio;
