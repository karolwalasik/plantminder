import { Grid2 } from "@mui/material";
import Card from './Card';
import { getIconByValueName } from '../helpers/iconMapper';
import { GRADIENTS } from '../constants/COLORS';

const gradientMapper = {
  temperature: GRADIENTS.ORANGE,
  humidity: GRADIENTS.BLUE,
  moisture: GRADIENTS.BLUEGREEN,
  light: GRADIENTS.PURPLE
}

const CardsGrid = ({ sensors }) => {
  return (
    <Grid2 container columnGap={4} rowGap={4} justifyContent={{xs:'center', lg: 'flex-start'}}>
      {sensors.map((sensor, index) => (
        <Grid2 item key={index}>
          <Card
            icon={getIconByValueName(sensor.valueName)}
            value={sensor.value}
            valueName={sensor.valueName}
            unit={sensor.unit}
            bg={gradientMapper[sensor.type]
          }
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default CardsGrid;