import React from 'react';

import styles from './FormControls.css';
import { Button } from '../index';

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
    <Button primary {...buttonProps}>
      {value}
    </Button>
  </div>
);

export default FormControls;
