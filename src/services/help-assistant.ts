import { getAccessToken } from 'utils/axios';
import { uninterceptedAxiosServices } from 'utils/axios';
import { HelpAssistantResponse } from 'types/help-assistant';

export const askHelpAssistant = async (question: string): Promise<HelpAssistantResponse> => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        throw new Error('Your session has expired. Please sign in again.');
    }

    const response = await uninterceptedAxiosServices.post<HelpAssistantResponse>(
        '/api/v3/assistant/ask/',
        { question },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
};
