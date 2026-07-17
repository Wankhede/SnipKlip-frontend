// ==============================|| Booking - SLICE ||============================== //
export interface CustomerType {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CountryType {
  code: string;
  label: string;
  currency: string;
}

export interface Items {
  id: string | number;
  name: string;
  description: string;
  qty: number;
  price: string | number;
}

export interface BookingProps {
  isOpen: boolean;
  isCustomerOpen: boolean;
  open: boolean;
  country: CountryType | null;
  countries: CountryType[];
  lists: Booking[];
  list: Booking | null;
  error: object | string | null;
  alertPopup: boolean;
}

export interface Booking {
  id: number;
  booking_id: number;
  customer_name: string;
  email: string;
  avatar: number;
  date: Date | string | number;
  due_date: Date | string | number;
  quantity: number;
  status: string;
  booking_detail: Items[];
  discount: number | null;
  tax: number | null;
  customerInfo: CustomerType;
  notes: string;
}

export interface BookingDetail {
  id: number | string;
  name: string;
  qty: number;
  description: string;
  price: number;
}
