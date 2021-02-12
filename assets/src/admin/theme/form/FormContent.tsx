import React from 'react';

import styles from './FormContent.css';
import contentStyles from '../Content.css';

const FormContent = ({ children }: { children?: any }) => (
    <tr>
        <td colSpan={2} className={contentStyles.content}>
            {children}
        </td>
    </tr>
);

export default FormContent;
