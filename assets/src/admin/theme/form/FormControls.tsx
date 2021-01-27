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
  <tr className={styles.controls}>
    <td colSpan={2}>
      <button className="button button-primary" {...buttonProps}>
        {value}
      </button>
    </td>
  </tr>
);

export default FormControls;
