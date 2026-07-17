// third-party
import { Page, View, Document, StyleSheet } from '@react-pdf/renderer';

// project import
import Header from './Header';
import Content from './Content';

// types
import { Invoice } from 'types/invoice';

const styles = StyleSheet.create({
  page: {
    padding: 30
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    '@media max-width: 400': {
      flexDirection: 'column'
    }
  }
});

// ==============================|| INVOICE EXPORT  ||============================== //

interface Props {
  invoice: Invoice | any;
}

const ExportPDFView = ({ invoice }: Props) => {
  let title = invoice.invoice_id;
  let customer_name = invoice.customer_name || invoice.from?.name || invoice.customerInfo?.name;
  return (
    <Document title={`${title} ${customer_name}`}>
      <Page size="A4" style={styles.page}>
        <Header list={invoice} />
        <View style={styles.container}>
          <Content invoice={invoice} />
        </View>
      </Page>
    </Document>
  );
};

export default ExportPDFView;
