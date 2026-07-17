import axios, { AxiosResponse } from 'axios';
export const sendRequest = async  (method: string, data: null, url: string, ): Promise<AxiosResponse> => {
  try {
      // Make an API request to submit the form data
      const response = await axios({
        method, url, data
      });
      // Handle the response as needed
      console.log(response.data);
      return response;
    } catch (error) {
      // Handle any errors that occur during the API request
      const errorMessage = (error as Error).message;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
}