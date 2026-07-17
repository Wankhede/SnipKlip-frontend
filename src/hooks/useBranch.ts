// next
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getSalonDetails } from 'services/salon';
import { EssentialMethods } from 'utils/essentialMethods';

const initialFormValues = {
  id: 0,
  branch_name: '',
  salon: {
    name: '',
    id: 0,
  }
}

interface BranchProps {
  id: number;
  branch_name: string;
  salon: Salon;
}

export interface Salon {
  name: string;
  id: number;
}

const useBranch = () => {
    const [formData, setFormData] = useState(initialFormValues);
    const { data: session } = useSession();

    const fetchSalonData = async () => {
      try {
        const user_id = session?.token.user.data.user_id
        const response = await getSalonDetails(user_id);
        if (response.data) {
          setFormData(response.data.data.rows[0]);
        }
      } catch (error) {
        // Handle any error that occurs during the data fetch
        console.error('Error fetching Salon data:', error);
      }
    };

    // Step 3: Use useEffect to fetch data when the component mounts
    useEffect(() => {
      fetchSalonData();
    }, []);


  if (session) {
    const newBranch: BranchProps = {
      id: formData.id,
      branch_name: formData.branch_name,
      salon: formData.salon
    };

    return newBranch;
  }
  return false;
};

export default useBranch;
