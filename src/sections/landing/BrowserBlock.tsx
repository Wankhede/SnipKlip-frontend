// third-party
import { ReactCompareSlider, ReactCompareSliderImage, ReactCompareSliderHandle } from 'react-compare-slider';

// ==============================|| LANDING - BROWSER  PAGE ||============================== //

const BrowserBlockPage = () => {
  return (
    <ReactCompareSlider
      handle={
        <ReactCompareSliderHandle
          buttonStyle={{
            backdropFilter: undefined,
            background: 'white',
            border: 0,
            color: '#333'
          }}
        />
      }
      itemOne={<ReactCompareSliderImage src={`/assets/images/landing/dark-dashboard.png`} />}
      itemTwo={<ReactCompareSliderImage src={`/assets/images/landing/light-dashboard.png`} />}
    />
  );
};

export default BrowserBlockPage;
