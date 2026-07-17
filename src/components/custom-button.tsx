import { Button, CircularProgress } from '@mui/material';
import React from 'react';
import { useIntl } from 'react-intl';
import _debounce from 'lodash/debounce';

interface CustomButtonProps {
	loading?: boolean,
	title: string,
	onclick: () => void;
	leadingIcon?: JSX.Element
}

const CustomButton = ({loading, title, onclick, leadingIcon}: CustomButtonProps) => { 
	const intl = useIntl();
	const debouncedClickHandler = _debounce(onclick, 500);
 	return(
	<Button onClick={debouncedClickHandler} variant="contained" component="span" startIcon={loading ? <CircularProgress color="inherit" size={20} /> : leadingIcon}>
		{intl.formatMessage({ id: title })}
	</Button>
	);
};

export default CustomButton;