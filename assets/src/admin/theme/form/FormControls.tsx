import React from 'react';

const FormControls = ({
  value = 'Submit',
  className = '',
  ...buttonProps
}: {
  value?: string;
  className?: string;
  [key: string]: any;
}) => (
  <tr>
    <td colSpan={2}>
      <button className="button button-primary" {...buttonProps}>
        {value}
      </button>
    </td>
  </tr>
);

export default FormControls;
