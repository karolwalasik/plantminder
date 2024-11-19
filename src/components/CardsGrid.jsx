import { Grid2 } from "@mui/material";
import Card from './Card';
import { getIconByValueName } from '../helpers/iconMapper';

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
            bg={
              index % 2 === 0
                ? "linear-gradient(180deg, #C03221 0%, #FCAB10 100%)"
                : "linear-gradient(180deg, #00BFFF 0%, #228B22 100%)"
            }
          />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default CardsGrid;