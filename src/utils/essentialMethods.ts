import { getSession, useSession } from "next-auth/react";
import { uploadFileAPI } from "services/upload-file";
import { dispatch } from "store";
import { openSnackbar } from "store/reducers/snackbar";
const columnWidths = [
    {
        'cell': 'trucker_name',
        'width': '300'
    }, {
        'cell': 'gstn_number',
        'width': '250'
    }, {
        'cell': 'added_on',
        'width': '250'
    }
]
export class EssentialMethods {
	static getMessageText(arg0: string): import("react").ReactNode {
		throw new Error('Method not implemented.');
	}
    static uploadFile = (formData: FormData) => {
        return uploadFileAPI(formData)
    }
    static getSalonDetails = async (sessionData: any) => {
        let salon_id = undefined;
        let user_id = undefined;
        let branch_id = undefined;
        let group = undefined;
        let subscription_name = undefined;
        let current_page = localStorage.getItem('current_page');
        if (sessionData && sessionData.token) {
            salon_id = sessionData.token?.user?.data?.salon_id;
            user_id = sessionData.token?.user?.data?.user_id;
            branch_id = sessionData.token?.user?.data?.branch_id;
            group = sessionData.token?.user?.data?.group;
            subscription_name = sessionData.token?.user?.data?.subscription_name;
        }
        return {
            salon_id: salon_id,
            user_id: user_id,
            branch_id: branch_id,
            group: group,
            subscription_name: subscription_name,
            current_page: current_page
        };
    }


    static downloadFile = (blobData: any, fileName: string) => {
        console.log(blobData);
        const blobUrl = URL.createObjectURL(blobData);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(blobUrl);
        return
    }

    static setColumnWidth(cell: string): string {
        const widthObj = columnWidths.find(obj => obj.cell === cell);
        return widthObj ? widthObj.width : '150';
    }

    static setCategoryValues(attributeData: any): string {
        if (Array.isArray(attributeData)) {
            return attributeData.map((item: any) => item.customer_name).join(' ');
        }else {
            return attributeData;
        }
    }

    static setCategoryObjectValues(attributeData: any): string {
        console.log(attributeData);
        if (typeof attributeData === 'object' && attributeData !== null) {
            return attributeData?.[attributeData] || '';
        }else {
            return '';
        }
    }
    // Method that returns the current datetime
    static getCurrentDateTime(): string {
        let today = new Date();
        let month = today.getMonth() + 1;
        let date = today.getFullYear() + "-" + month + "-" + today.getDate(); //TODO: This should also return time
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return date + " " + time;
    }

    static showSnackbar(message: string, color: string): void {
        dispatch(
            openSnackbar({
                open: true,
                message: message,
                variant: 'alert',
                alert: {
                    color: color
                },
                close: false
            })
        );
    }

}