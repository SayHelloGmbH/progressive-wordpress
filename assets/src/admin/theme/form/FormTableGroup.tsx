import React from 'react';

import cn from '../../utils/classnames';

import styles from './FormTableGroup.css';

const FormTableGroup = ({
	className = '',
	children,
	card = false,
	title = '',
}: {
	className?: string;
	children?: any;
	card?: boolean;
	title?: string;
}) => (
	<tbody className={cn(className, { [styles.card]: card })}>
		{title !== '' && (
			<tr>
				<td colSpan={2}>
					<h2 className={styles.title}>{title}</h2>
				</td>
			</tr>
		)}
		{children}
	</tbody>
);

export default FormTableGroup;
