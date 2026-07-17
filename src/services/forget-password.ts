import axiosServices from 'utils/axios'

export const SendEmail = (email:any, otp_num:any, password:any, confirm_password:any) => {
  const data = {
    email: email,
    otp_num: otp_num,
    password: password,
    confirm_password : confirm_password
  };

  return axiosServices({
    method: 'POST',
    data: data,
    url: '/api/v3/send-email/', // Update the URL to include the user ID
  });
};

