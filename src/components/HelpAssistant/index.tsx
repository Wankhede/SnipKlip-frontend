import { KeyboardEvent, useState } from 'react';
import { useRouter } from 'next/router';

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Drawer,
    Fab,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Close from '@mui/icons-material/Close';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Send from '@mui/icons-material/Send';
import SmartToyOutlined from '@mui/icons-material/SmartToyOutlined';

import { askHelpAssistant } from 'services/help-assistant';
import { HelpSource } from 'types/help-assistant';

interface Message {
    id: number;
    role: 'user' | 'assistant';
    text: string;
    refused?: boolean;
    redacted?: boolean;
    sources?: HelpSource[];
}

const welcomeMessage: Message = {
    id: 0,
    role: 'assistant',
    text: 'Hi! I can guide you through SnipKlip features and workflows. What would you like help with?'
};

const HelpAssistant = () => {
    const theme = useTheme();
    const router = useRouter();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([welcomeMessage]);

    const submitQuestion = async () => {
        const trimmedQuestion = question.trim();
        if (!trimmedQuestion || loading) return;

        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            text: trimmedQuestion
        };
        setMessages((current) => [...current, userMessage]);
        setQuestion('');
        setLoading(true);

        try {
            const response = await askHelpAssistant(trimmedQuestion);
            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: response.data.answer,
                    refused: response.data.refused,
                    redacted: response.data.redacted,
                    sources: response.data.sources
                }
            ]);
        } catch (error) {
            setMessages((current) => [
                ...current,
                {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: error instanceof Error ? error.message : 'The help assistant is temporarily unavailable.'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submitQuestion();
        }
    };

    return (
        <>
            <Fab
                color="primary"
                aria-label="Open SnipKlip help assistant"
                onClick={() => setOpen(true)}
                sx={{ position: 'fixed', right: { xs: 16, sm: 24 }, bottom: { xs: 16, sm: 24 }, zIndex: theme.zIndex.speedDial }}
            >
                <SmartToyOutlined />
            </Fab>
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{ sx: { width: fullScreen ? '100%' : 420, maxWidth: '100%' } }}
            >
                <Stack sx={{ height: '100%' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <SmartToyOutlined color="primary" />
                            <Box>
                                <Typography variant="h5">SnipKlip Help</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    App guidance only
                                </Typography>
                            </Box>
                        </Stack>
                        <IconButton aria-label="Close help assistant" onClick={() => setOpen(false)}>
                            <Close />
                        </IconButton>
                    </Stack>
                    <Divider />

                    <Alert icon={<LockOutlined fontSize="inherit" />} severity="info" sx={{ m: 2, mb: 0 }}>
                        Do not share customer details, passwords, payment data, OTPs, or administrator information.
                    </Alert>

                    <Stack spacing={1.5} sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                        {messages.map((message) => (
                            <Paper
                                key={message.id}
                                variant="outlined"
                                sx={{
                                    p: 1.5,
                                    maxWidth: '88%',
                                    alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                    bgcolor: message.role === 'user' ? 'primary.lighter' : 'background.paper'
                                }}
                            >
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                                    {message.text}
                                </Typography>
                                {message.redacted && (
                                    <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 1 }}>
                                        Personal information was removed before generating this answer.
                                    </Typography>
                                )}
                                {!!message.sources?.length && !message.refused && (
                                    <Stack direction="row" flexWrap="wrap" sx={{ mt: 1, gap: 0.5 }}>
                                        {message.sources.map((source) => (
                                            <Button
                                                key={`${message.id}-${source.route}`}
                                                size="small"
                                                onClick={() => {
                                                    setOpen(false);
                                                    router.push(source.route);
                                                }}
                                            >
                                                {source.title}
                                            </Button>
                                        ))}
                                    </Stack>
                                )}
                            </Paper>
                        ))}
                        {loading && <CircularProgress size={22} sx={{ alignSelf: 'flex-start' }} aria-label="Generating answer" />}
                    </Stack>

                    <Divider />
                    <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ p: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            value={question}
                            disabled={loading}
                            onChange={(event) => setQuestion(event.target.value.slice(0, 600))}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask how to use SnipKlip..."
                            inputProps={{ maxLength: 600, 'aria-label': 'Question for SnipKlip help' }}
                        />
                        <IconButton
                            color="primary"
                            aria-label="Send question"
                            disabled={loading || !question.trim()}
                            onClick={submitQuestion}
                        >
                            <Send />
                        </IconButton>
                    </Stack>
                </Stack>
            </Drawer>
        </>
    );
};

export default HelpAssistant;
