import React from 'react';

import cn from '../../utils/classnames';

const Form = ({
                  className = '',
                  children,
                  onSubmit,
              }: {
    className?: string;
    children?: any;
    onSubmit: Function;
}) => (
    <form className={cn('pwp-form', className)} onSubmit={onSubmit}>
        <table className="form-table">
            <tbody>{children}</tbody>
        </table>
    </form>
);

export default Form;
