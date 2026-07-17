import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, CircularProgress, Grid } from "@mui/material";
import { errorColor, successColor } from "config";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { downloadFileAPI } from "services/upload-file";
import { EssentialMethods } from "utils/essentialMethods";
import { DownloadButtonProps, TemplateProps, UploadButtonProps } from "types/common";

export class EssentialComponents {

	static uploadButton = (props:UploadButtonProps) => {
		const { acceptType, bulkUploadApi, template } = props;
		const [file, setFile] = useState(null);
		const [loading, setLoading] = useState(false);
		const templateName = template.name
		const intl = useIntl();
		const handleFileChange = async (event: any) => {
			setFile(event.target.files[0]);
		};

		useEffect(() => {
			(async () => {
				if (file) {
					// setLoading(true);
					const formData = {
						'file': file,
						'template': templateName,
					  };
					const response = await bulkUploadApi(formData);
					if (response) {
						EssentialMethods.downloadFile(response.data, 'customer.csv');
						// EssentialMethods.showSnackbar(intl.formatMessage({ id: "bulk-upload-success" }), successColor)
						window.location.reload()
					} else {
						setLoading(false); // Set loading state to false
						// EssentialMethods.showSnackbar(response.data.message, errorColor);
					}
				}
			})();
		}, [file]);

		return (
			<label htmlFor="file-input">
				<Button variant="contained" component="span" startIcon={loading ? <CircularProgress color="inherit" size={20} /> : <UploadOutlined />}>
					{intl.formatMessage({ id: "bulk-upload" })}
				</Button>
				<input
					id="file-input"
					disabled={loading}
					type="file"
					accept={acceptType}
					onChange={(e) => {
						handleFileChange(e);
					}}
					style={{ display: 'none' }}
				/>
			</label>
		)
	}

	static downloadSampleExcel = (props: DownloadButtonProps) => {
		const { template } = props;
		const intl = useIntl();
		const [downloading, setDownloading] = useState(false);
		async function downloadData(templateName: string) {
			try {
				const response = await downloadFileAPI(templateName);
				if (response.status !== 200) {
					throw new Error('Failed to download data');
				}

				return response.data;
			} catch (error) {
				console.error('Error downloading data:', error);
				throw error;
			}
		}

		const handleDownload = async (temp: TemplateProps) => {
			const templateName = temp.name;
			const templateFilename = temp.filename;
			if (downloading) return;

			try {
				setDownloading(true);
				const blobData = await downloadData(templateName);
				EssentialMethods.downloadFile(blobData, templateFilename);
				EssentialMethods.showSnackbar(intl.formatMessage({ id: "bulk-download-success" }), successColor)
			} catch (error) {
				EssentialMethods.showSnackbar(intl.formatMessage({ id: "bulk-download-failed" }), errorColor);
			} finally {
				setDownloading(false);
			}
		};

		return (
				<Button variant="contained" onClick={() => handleDownload(template!)} startIcon={<DownloadOutlined />}>
					{intl.formatMessage({ id: 'download-template' })}
				</Button>
		);

	}
}

