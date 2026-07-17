export interface HelpSource {
    title: string;
    route: string;
}

export interface HelpAssistantData {
    answer: string;
    refused: boolean;
    redacted: boolean;
    provider: 'llm' | 'local' | 'safety';
    sources: HelpSource[];
}

export interface HelpAssistantResponse {
    data: HelpAssistantData;
    message: string;
    status: number;
}
