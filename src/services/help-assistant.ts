import { getSession } from 'next-auth/react';

import { uninterceptedAxiosServices } from 'utils/axios';
import { HelpAssistantResponse } from 'types/help-assistant';

export const askHelpAssistant = async (question: string): Promise<HelpAssistantResponse> => {
    const session = await getSession();
    const accessToken = session?.token?.user?.data?.access_token || session?.token?.access_token;

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
