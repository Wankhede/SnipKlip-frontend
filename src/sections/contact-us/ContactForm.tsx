import { useState } from 'react';
import { postContact } from 'services/contact-us';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Checkbox, Grid, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { EssentialMethods } from 'utils/essentialMethods';
import { BRAND } from 'config/branding';
import _debounce from 'lodash/debounce';
// ==============================|| CONTACT US - FORM ||============================== //
const initialValues = {
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: ''
};
function ContactForm() {
    const theme = useTheme();
    const [formData, setFormData] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Debounced version of the handleSubmit function
    const debouncedSubmit = _debounce(handleSubmit, 500);
    async function handleSubmit(event: any) {
        event.preventDefault();
        setLoading(true);

        try {
            // Add form validation here (example: checking if required fields are filled)
            if (!formData.name || !formData.email) {
                EssentialMethods.showSnackbar('Please fill in all required fields', 'error');
                return;
            }

            const response = await postContact(formData);

            if (response.data.status) {
                EssentialMethods.showSnackbar(response.data.message, 'success');
                setFormData(initialValues);
            } else {
                EssentialMethods.showSnackbar(response.data.message, 'error');
            }
        } catch (error) {
            console.error('API error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{ p: { xs: 2.5, sm: 0 } }}>
            <form onSubmit={debouncedSubmit}>
                <Grid container spacing={5} justifyContent="center">
                    <Grid item xs={12} sm={10} lg={9}>
                        <Stack alignItems="center" justifyContent="center" spacing={2}>
                            <Typography color="primary">Get In touch</Typography>
                            <Typography align="center" variant="h2">
                                Contact Us
                            </Typography>
                            <Typography variant="caption" align="center" color="textSecondary" sx={{ maxWidth: '355px' }}>
                                {BRAND.COMPANY_NAME} is here to help.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={10} lg={9}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Name"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email Address"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Phone Number"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Select
                                    fullWidth
                                    name="inquiryType"
                                    value={formData.inquiryType}
                                    onChange={handleInputChange}
                                    placeholder="Inquiry Type"
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (selected === '' || selected === null || selected === undefined) {
                                            return <span>Inquiry Type</span>;
                                        }
                                        return selected;
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        Inquiry Type
                                    </MenuItem>
                                    <MenuItem value="Question">Question</MenuItem>
                                    <MenuItem value="Problem">Problem</MenuItem>
                                    <MenuItem value="Others">Others</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Message"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={10} lg={9}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={{ xs: 1 }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                        >
                            <Stack direction="row" alignItems="center" sx={{ ml: -1 }}>
                                <Checkbox sx={{ '& .css-1vjb4cj': { borderRadius: '2px' } }} defaultChecked />
                                <Typography>
                                    By submitting this, you agree to the{' '}
                                    <Typography sx={{ cursor: 'pointer' }} component="span" color={theme.palette.primary.main}>
                                        Privacy Policy
                                    </Typography>{' '}
                                    and{' '}
                                    <Typography sx={{ cursor: 'pointer' }} component="span" color={theme.palette.primary.main}>
                                        Cookie Policy
                                    </Typography>{' '}
                                </Typography>
                            </Stack>
                            <Button type="submit" variant="contained" sx={{ ml: { xs: 0 } }}>
                                Submit Now
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default ContactForm;
