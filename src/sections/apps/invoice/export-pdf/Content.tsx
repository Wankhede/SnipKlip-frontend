// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import { Text, View, StyleSheet } from '@react-pdf/renderer';

// types
import { Invoice } from 'types/invoice';

const textPrimary = '#262626';
const textSecondary = '#8c8c8c';
const border = '#f0f0f0';

// custom Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    '@media max-width: 400': {
      paddingTop: 10,
      paddingLeft: 0
    }
  },
  card: {
    border: `1px solid ${border}`,
    borderRadius: '2px',
    padding: '20px',
    width: '48%'
  },
  title: {
    color: textPrimary,
    fontSize: '12px',
    fontWeight: 500
  },
  caption: {
    color: textSecondary,
    fontSize: '10px'
  },
  tableTitle: {
    color: textPrimary,
    fontSize: '10px',
    fontWeight: 500
  },
  tableCell: {
    color: textPrimary,
    fontSize: '10px'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },

  subRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 0,
    paddingBottom: 20
  },
  column: {
    flexDirection: 'column'
  },

  paragraph: {
    color: '#1F2937',
    fontSize: '12px'
  },

  tableHeader: {
    justifyContent: 'space-between',
    borderBottom: '1px solid #f0f0f0',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '10px',
    paddingBottom: '10px',
    margin: 0,
    paddingLeft: 10
  },
  tableRow: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: 10,
    paddingTop: 10,
    margin: 0,
    paddingLeft: 10
  },
  amountSection: { margin: 0, paddingRight: 25, paddingTop: 16, justifyContent: 'flex-end' },
  amountRow: { margin: 0, width: '40%', justifyContent: 'space-between' },
  pb5: { paddingBottom: 5 },
  flex03: { flex: '0.3 1 0px' },
  flex07: { flex: '0.7 1 0px' },
  flex17: { flex: '1.7 1 0px' },
  flex20: { flex: '2 1 0px' }
});

interface Props {
  invoice: Invoice;
}

// ==============================|| INVOICE EXPORT - CONTENT  ||============================== //

const Content = ({ invoice }: Props) => {
  const theme = useTheme();
  const subtotal = invoice.invoice_detail?.reduce((prev: any, curr: any) => {
    if (String(curr.name).trim().length > 0) return prev + Number(curr.price * Math.floor(curr.qty));
    else return prev;
  }, 0);
  const discountPercentage = invoice.discount_percentage
  const taxPercentage = invoice.tax_percentage

  const discountAdded = Math.floor(discountPercentage! / 100 * subtotal)
  const taxAdded = Math.floor(taxPercentage! / 100 * subtotal)

  const price_cut_by_membership = invoice.price_cut_by_membership

  const default_coupon_discount_value = invoice.price_cut_by_coupon_code
  const couponDiscount = ((default_coupon_discount_value && Number(default_coupon_discount_value))) / 100 * subtotal

  const grandTotal = Math.round(Number(subtotal - discountAdded + taxAdded - (price_cut_by_membership || couponDiscount)))

  const paymentReceived = grandTotal - invoice.due_payment!
  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.subRow]}>
        <View style={styles.card}>
          <Text style={[styles.title, { marginBottom: 8 }]}>From:</Text>
          <Text style={[styles.caption, styles.pb5]}>{invoice.cashierInfo?.name}</Text>
          {/* <Text style={[styles.caption, styles.pb5]}>{invoice.cashierInfo?.address}</Text> */}
          <Text style={[styles.caption, styles.pb5]}>{invoice.cashierInfo?.email}</Text>
          <Text style={[styles.caption, styles.pb5]}>{invoice.cashierInfo?.phone}</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.title, { marginBottom: 8 }]}>To:</Text>
          <Text style={[styles.caption, styles.pb5]}>{invoice.customerInfo?.name}</Text>
          {/* <Text style={[styles.caption, styles.pb5]}>{invoice.customerInfo?.address}</Text> */}
          <Text style={[styles.caption, styles.pb5]}>{invoice.customerInfo?.email}</Text>
          <Text style={[styles.caption, styles.pb5]}>{invoice.customerInfo?.phone}</Text>
        </View>
      </View>
      <View>
        <View style={[styles.row, styles.tableHeader, { backgroundColor: theme.palette.grey[100] }]}>
          <Text style={[styles.tableTitle, styles.flex03]}>#</Text>
          <Text style={[styles.tableTitle, styles.flex17]}>NAME</Text>
          <Text style={[styles.tableTitle, styles.flex20]}>STYLIST NAME</Text>
          <Text style={[styles.tableTitle, styles.flex07]}>QTY</Text>
          <Text style={[styles.tableTitle, styles.flex07]}>PRICE</Text>
          <Text style={[styles.tableTitle, styles.flex07]}>AMOUNT</Text>
        </View>
        {/* TODO : Uncomment this line if you want to display the table data - Alex */}
        {invoice && invoice.invoice_detail ? (
          invoice.invoice_detail?.map((row: any, index: number) => {
            return (
              <View style={[styles.row, styles.tableRow]} key={row.id}>
                <Text style={[styles.tableCell, styles.flex03]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.flex17, { textOverflow: 'ellipsis' }]}>{row.name}</Text>
                <Text style={[styles.tableCell, styles.flex20]}>{row.stylist}</Text>
                <Text style={[styles.tableCell, styles.flex07]}>{row.qty}</Text>
                <Text style={[styles.tableCell, styles.flex07]}>{`Rs ${Number(row.price).toFixed(2)}`}</Text>
                <Text style={[styles.tableCell, styles.flex07]}>{`Rs ${Number(row.price * row.qty).toFixed(2)}`}</Text>
              </View>
            );
          })
        ) : (
          // You can add a loading message or handle the case where list or invoice.invoice_detail is undefined
          <Text>Loading or Data Not Available</Text>
        )}
      </View>
      <View style={[styles.row, { paddingTop: 25, margin: 0, paddingRight: 25, justifyContent: 'flex-end' }]}>
        <View style={[styles.row, styles.amountRow]}>
          <Text style={styles.caption}>Sub Total:</Text>
          <Text style={styles.tableCell}>Rs {subtotal?.toFixed(2)}</Text>
        </View>
      </View>
      <View style={[styles.row, styles.amountSection]}>
        <View style={[styles.row, styles.amountRow]}>
          <Text style={styles.caption}>Discount:</Text>
          <Text style={[styles.caption, { color: theme.palette.success.main }]}>Rs {discountAdded}</Text>
        </View>
      </View>
      <View style={[styles.row, styles.amountSection]}>
        <View style={[styles.row, styles.amountRow]}>
          <Text style={styles.caption}>Tax:</Text>
          <Text style={[styles.caption]}>Rs {taxAdded}</Text>
        </View>
      </View>
      <View style={[styles.row, styles.amountSection]}>
        <View style={[styles.row, styles.amountRow]}>
          <Text style={styles.tableCell}>Grand Total:</Text>
          <Text style={styles.tableCell}>Rs {Math.round(grandTotal)}</Text>
        </View>
      </View>
    </View>
  );
};

export default Content;
