import React, { ReactElement, useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Grid,
    Rating,
    Stack,
    TextField,
} from '@mui/material';
import MainCard from 'components/MainCard';
import Page from 'components/Page';
import { useRouter } from 'next/router';
import StarIcon from '@mui/icons-material/Star';
import { addReview, getReview } from 'services/reviews';
import { EssentialMethods } from 'utils/essentialMethods';
import { errorColor, successColor } from 'config';


const FeedbackForm = () => {
    const [rating, setRating] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>('');
    const router = useRouter();
    const bookingId = router.query.id;
    const [Hide, setHide] = useState(false);

    // Get the current URL
    const currentUrl = window.location.href;
    
    // Split the URL by '/' to get individual parts
    const urlParts = currentUrl.split('/');

    // Get the last element of the array
    const transaction_id = urlParts[urlParts.length - 1];


    useEffect(() => {
        if (transaction_id) {
            fetchTransactionData(transaction_id);
        }
    }, [transaction_id]);

    const fetchTransactionData = async (id: string | string[]) => {
        try {
            const formData = {
                invoice_id: transaction_id,
            };
            const transactionData = await getReview(formData); // Assuming this function retrieves review data based on ID
            if (transactionData.data.status === 200){
                setHide(true)
            }
        } catch (error) {
            console.error('Error fetching transaction data:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Prepare data to send to the API endpoint
            const formData = {
                invoice_id: transaction_id,
                feedback: feedback,
                rating: rating,
            };

            // Make an API request using fetch
            const response = await addReview(formData,`${transaction_id}`);
            if (response.data.status === 200){
                window.location.reload()
                EssentialMethods.showSnackbar(response.data.message, successColor)
            }else{
                EssentialMethods.showSnackbar(response.data.message, errorColor)
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            // Handle any unexpected errors during submission
        }
    }
    if (Hide) {
        return(
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div>
                    <h2>You Have Already Submitted Your Feedback!</h2>
                </div>
            </div>
        )
    }

    return (
        <Page title='Add Review'>
            <MainCard tilte='Add Review'>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box>
                            <h2>Provide Feedback for Transaction ID - #{bookingId}</h2>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">Rating:</FormLabel>
                                            <Rating
                                                name="text-feedback"
                                                value={rating}
                                                precision={1}
                                                onChange={(event, newValue) => {
                                                    setRating(newValue || 0);
                                                }}
                                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Feedback:"
                                            variant="outlined"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button type="submit" variant="contained" color="primary">
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </form>
                    </Grid>
                </Grid>
            </MainCard>
        </Page>
    );
};

FeedbackForm.getLayout = function getLayout(page: ReactElement) {
    return <FeedbackForm />;
};
export default FeedbackForm;

