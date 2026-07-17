// next
import { useSession } from 'next-auth/react';
import { useUserProfile } from 'pages/apps/user-provider';
import { useEffect, useState } from 'react';
import { getUser } from 'services/user';
import { EssentialMethods } from 'utils/essentialMethods';

const initialFormValues = {
  id: 0,
  name: '',
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  mobile: 0,
  address: '',
  dob: '',
  gender: '',
  submit: null,
  subscription_name: '',
}


interface UserProps {
  id: number;
  name: string;
  first_name:string;
  last_name: string;
  username: string;
  email: string;
  mobile: number;
  address: string;
  dob:string;
  gender: string;
  avatar: string;
  thumb: string;
  role: string;
  subscription_name: string;
}



const useUser = () => {

    // Step 2: Create state to hold the form data
    const [formData, setFormData] = useState(initialFormValues);
    const { data: session } = useSession();
    const { userData, loading } = useUserProfile();
    const fetchUserData = async () => {
      try {
        const response = await getUser(userData); // Make sure getUser returns the user data
        if (response.data) {
          setFormData(response.data.data);  // Set the form data state with the fetched data
        }
      } catch (error) {
        // Handle any error that occurs during the data fetch
        console.error('Error fetching Salon data:', error);
      }
    };

    // Step 3: Use useEffect to fetch data when the component mounts
    useEffect(() => {
      if(!loading && userData){
        fetchUserData();
      }
    }, [loading, userData]);


  if (session) {
    const newUser: UserProps = {
      id: formData.id,
      name: formData.first_name,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      dob: formData.dob,
      gender: formData.gender,
      mobile: formData.mobile,
      address: formData.address,
      username: formData.username,
      subscription_name: formData.subscription_name,
      role: 'User',
      avatar: '/assets/images/users/avatar-1.png',
      thumb: '/assets/images/users/avatar-thumb-1.png',
    };

    return newUser;
  }
  return false;
};

export default useUser;
