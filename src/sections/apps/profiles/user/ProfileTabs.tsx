import React, { useEffect, useState, ChangeEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, FormLabel, Grid, TextField, Stack, Typography } from '@mui/material';

// project import
import useUser from 'hooks/useUser';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import ProfileTab from './ProfileTab';
import { facebookColor, linkedInColor, twitterColor } from 'config';

// assets
import { FacebookFilled, LinkedinFilled, TwitterSquareFilled, CameraOutlined } from '@ant-design/icons';
import { useUserProfile } from 'pages/apps/user-provider';

// ==============================|| USER PROFILE - TAB CONTENT ||============================== //

interface Props {
  focusInput: () => void;
}

const ProfileTabs = ({ focusInput }: Props) => {
  const theme = useTheme();
  const user = useUser();
  const userData = useUserProfile();
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [avatar, setAvatar] = useState<string | undefined>(user ? user.thumb : '');

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <MainCard>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Stack spacing={2.5} alignItems="center">
            <FormLabel
              htmlFor="change-avtar"
              sx={{
                position: 'relative',
                borderRadius: '50%',
                overflow: 'hidden',
                '&:hover .MuiBox-root': { opacity: 1 },
                cursor: 'pointer'
              }}
            >
              {user && <Avatar alt={user.username} src={avatar} sx={{ width: 124, height: 124, border: '1px dashed' }} />}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Stack spacing={0.5} alignItems="center">
                  <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                  <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                </Stack>
              </Box>
            </FormLabel>
            <TextField
              type="file"
              id="change-avtar"
              placeholder="Outlined"
              variant="outlined"
              sx={{ display: 'none' }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedImage(e.target.files?.[0])}
            />
            {user && (
              <Stack spacing={0.5} alignItems="center">
                <Typography variant="h5">{user.username}</Typography>
                <Typography color="secondary">{user.role}</Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={3} sx={{ '& svg': { fontSize: '1.15rem', cursor: 'pointer' } }}>
              <TwitterSquareFilled style={{ color: twitterColor }} />
              <FacebookFilled style={{ color: facebookColor }} />
              <LinkedinFilled style={{ color: linkedInColor }} />
            </Stack>
          </Stack>
        </Grid>
        
        <Grid item xs={12}>
          <ProfileTab />
        </Grid>
        
      </Grid>
    </MainCard>
  );
};

export default ProfileTabs;
