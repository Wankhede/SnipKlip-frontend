// project import
import SimpleBar from 'components/third-party/SimpleBar';
import Navigation from './Navigation';

// ==============================|| DRWAER CONTENT ||============================== //

const DrawerContent = ({ searchValue }: { searchValue?: string }) => (
  <>
    <SimpleBar
      sx={{
        '& .simplebar-content': {
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <Navigation />
    </SimpleBar>
  </>
);

export default DrawerContent;
