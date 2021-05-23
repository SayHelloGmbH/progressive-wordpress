import React from 'react';

import styles from './FormControls.css';
import { Button, ButtonGroup } from '../index';

const FormControls = ({
  value = 'Submit',
  className = '',
  align = 'left',
  ...buttonProps
}: {
  value?: string;
  className?: string;
  align?: 'right' | 'left' | 'center';
  [key: string]: any;
}) => (
  <ButtonGroup align={align} className={styles.controls}>
    <Button buttonType="primary" {...buttonProps}>
      {value}
    </Button>
  </ButtonGroup>
);

export default FormControls;
