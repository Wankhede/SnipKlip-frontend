import { useEffect, useState } from 'react';

// next
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, CardContent, CardMedia, Chip, Divider, Grid, Rating, Stack, Typography } from '@mui/material';

// types
import { ProductCardProps } from 'types/cart';

// project import
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SkeletonProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';
import { useDispatch, useSelector } from 'store';
import { addProduct } from 'store/reducers/cart';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

// ==============================|| PRODUCT CARD ||============================== //

const ProductCard = ({
  id,
  color,
  name,
  brand,
  offer,
  isStock,
  image,
  description,
  offerPrice,
  salePrice,
  rating,
  open
}: ProductCardProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const prodProfile = image && `/assets/images/e-commerce/${image}`;
  const [productRating] = useState<number | undefined>(rating);
  const [wishlisted, setWishlisted] = useState<boolean>(false);
  const cart = useSelector((state) => state.cart);

  const addCart = () => {
    dispatch(addProduct({ id, name, image, salePrice, offerPrice, color, size: 8, quantity: 1, description }, cart.checkout.products));
    dispatch(
      openSnackbar({
        open: true,
        message: 'Add To Cart Success',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
  };

  const addToFavourite = () => {
    setWishlisted(!wishlisted);
    dispatch(
      openSnackbar({
        open: true,
        message: 'Added to favourites',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
  };

  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonProductPlaceholder />
      ) : (
        <MainCard
          content={false}
          boxShadow
          sx={{
            '&:hover': {
              transform: 'scale3d(1.02, 1.02, 1)',
              transition: 'all .4s ease-in-out'
            }
          }}
        >
          <NextLink href={`/apps/job/job-application/${id}`} passHref>
            <Box sx={{ width: 250, m: 'auto' }}>
              {/* <CardMedia sx={{ cursor: 'pointer', height: 250, textDecoration: 'none', opacity: isStock ? 1 : 0.25 }} image={prodProfile} /> */}
            </Box>
          </NextLink>

          <Divider />
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack>
                  <NextLink href={`/apps/job/job-application/${id}`} passHref>
                    <Typography
                      color="textPrimary"
                      variant="h5"
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', cursor: 'pointer' }}
                    >
                      {name}
                    </Typography>
                  </NextLink>
                  <Typography variant="h6" color="textSecondary">
                    {brand}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h5">${offerPrice}</Typography>
                      {salePrice && (
                        <Typography variant="h6" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
                          ${salePrice}
                        </Typography>
                      )}
                    </Stack>
                    <Stack direction="row" alignItems="flex-start">
                      <Rating precision={0.5} name="size-small" value={productRating} size="small" readOnly />
                      <Typography variant="caption">({productRating?.toFixed(1)})</Typography>
                    </Stack>
                  </Stack>

                  <Button variant="contained" onClick={addCart} disabled={!isStock}>
                    {!isStock ? 'Sold Out' : 'Add to Cart'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

export default ProductCard;
