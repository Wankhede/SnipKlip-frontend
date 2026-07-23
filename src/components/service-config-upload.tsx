import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';

import { uploadServiceConfig } from 'services/services';

const JSON_TEMPLATE = `[
  {
    "service_name": "Haircut",
    "price": 350,
    "duration_in_minutes": 45
  }
]`;

const YAML_TEMPLATE = `- service_name: Haircut
  price: 350
  duration_in_minutes: 45`;

const ALLOWED_EXTENSIONS = ['.json', '.yaml', '.yml'];

type ServiceConfigUploadProps = {
  branchId: string | number;
  onUploaded: () => void;
};

const downloadTemplate = (filename: string, content: string) => {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const ServiceConfigUpload = ({ branchId, onUploaded }: ServiceConfigUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ severity: 'error' | 'success'; message: string } | null>(null);

  const upload = async (file?: File) => {
    if (!file) return;
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setFeedback({ severity: 'error', message: 'Only .json, .yaml, and .yml files are allowed.' });
      return;
    }

    setUploading(true);
    setFeedback(null);
    try {
      const response = await uploadServiceConfig(file, branchId);
      setFeedback({ severity: 'success', message: response.data.message });
      onUploaded();
    } catch (error: any) {
      const message =
        (typeof error === 'string' && error) ||
        error?.message ||
        error?.detail ||
        'The services configuration could not be uploaded.';
      setFeedback({ severity: 'error', message });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!uploading) upload(event.dataTransfer.files[0]);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    upload(event.target.files?.[0]);
  };

  const templates = [
    { filename: 'services_template.json', content: JSON_TEMPLATE },
    { filename: 'services_template.yml', content: YAML_TEMPLATE }
  ];

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Box
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        sx={{
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
          textAlign: 'center'
        }}
      >
        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".json,.yaml,.yml,application/json,application/yaml,text/yaml"
          onChange={handleChange}
        />
        <Button
          variant="contained"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={18} color="inherit" /> : <UploadOutlined />}
          onClick={() => inputRef.current?.click()}
        >
          Upload Services Config
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Select or drop a JSON/YAML file. Maximum size: 1 MB.
        </Typography>
      </Box>

      {feedback && <Alert severity={feedback.severity}>{feedback.message}</Alert>}

      <Grid container spacing={2}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} key={template.filename}>
            <Paper variant="outlined" sx={{ p: 1.5, height: '100%' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography variant="subtitle2">{template.filename}</Typography>
                <Button
                  size="small"
                  startIcon={<DownloadOutlined />}
                  onClick={() => downloadTemplate(template.filename, template.content)}
                >
                  Download
                </Button>
              </Stack>
              <Box
                component="pre"
                sx={{ m: 0, mt: 1, p: 1.5, bgcolor: 'grey.100', borderRadius: 1, overflowX: 'auto', fontSize: 12 }}
              >
                {template.content}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default ServiceConfigUpload;
