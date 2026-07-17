import { Dictionary } from '@fullcalendar/common';

export interface getTableRowsDataI {
    page_number?: string;
    page_size?: string;
    search_value?: string;
    search_columns?: string;
    sort_by?: string;
    [key: string]: any;
}

export interface getSessionDataI {
    user_id: string;
    branch_id: string;
    salon_id: string;
}

export interface ServiceTypeI {
    code: string;
    label: string;
    suggested?: boolean;
}

export interface MetaDataTypeI {
    added_by_id: string;
    added_by_name: string;
    added_on: string;
    element: string;
    enabled: string;
    franchise_id: string;
    id?: number;
    type: string;
    suggested?: boolean;
    price?: string;
}

export interface CustomerTypeI {
    username: string;
    email: string;
    id?: number;
}

export interface MetaDataAttributeI {
    attribute_id: number;
    attribute_name: string;
}

export interface CustomerInfo {
    id?: number;
    username: string;
    first_name: string;
    dob: string;
    gender: string;
    last_name: string;
    email: string;
    mobile: string;
}

export interface MetaDataType {
    attribute_id: number;
    attribute_name: string;
    attribute_type: string;
}

export interface UploadButtonProps {
    acceptType: string;
    bulkUploadApi: (tableData: any) => Promise<any>;
    template: TemplateProps;
}

export interface TemplateProps {
    filename: string;
    name: string;
}
export interface DownloadButtonProps {
    template: TemplateProps;
}

export interface demoDataInterface {
    data: Dictionary;
    status: Number;
    message: string;
}
