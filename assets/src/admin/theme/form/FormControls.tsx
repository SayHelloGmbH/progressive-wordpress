import React from 'react';

import styles from './FormControls.css';

const FormControls = ({
  value = 'Submit',
  className = '',
  ...buttonProps
}: {
  value?: string;
  className?: string;
  [key: string]: any;
}) => (
  <div className={styles.controls}>
    <button className="button button-primary" {...buttonProps}>
      {value}
    </button>
  </div>
);

export default FormControls;
