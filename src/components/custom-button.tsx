import { Button, CircularProgress } from '@mui/material';
import React, { useRef } from 'react';
import { useIntl } from 'react-intl';

interface CustomButtonProps {
	loading?: boolean,
	title: string,
	onclick: () => void;
	leadingIcon?: JSX.Element
}

const CustomButton = ({loading, title, onclick, leadingIcon}: CustomButtonProps) => { 
	const intl = useIntl();
	const busyRef = useRef(false);

	const handleClick = () => {
		if (loading || busyRef.current) return;
		busyRef.current = true;
		try {
			onclick();
		} finally {
			// Allow the next click quickly; loading prop covers longer ops.
			window.setTimeout(() => {
				busyRef.current = false;
			}, 250);
		}
	};

 	return(
	<Button
		onClick={handleClick}
		disabled={!!loading}
		variant="contained"
		component="span"
		startIcon={loading ? <CircularProgress color="inherit" size={20} /> : leadingIcon}
	>
		{intl.formatMessage({ id: title })}
	</Button>
	);
};

export default CustomButton;
