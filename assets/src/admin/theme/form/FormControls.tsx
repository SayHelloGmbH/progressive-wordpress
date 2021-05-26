import React from 'react';
import { Button, ButtonGroup } from '../index';
import styles from './FormControls.css';

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
