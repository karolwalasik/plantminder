import { Typography } from "@mui/material";
import Card from '../components/Card'

import { ReactComponent as Icon2 } from '../assets/Temperature.svg';
export default function Root() {
    return (
        <div>
<Typography component={'h1'} variant="h1">ROOT PAGE</Typography>
            <Card icon={Icon2} value={'22'} valueName={'temperature'} bg={"linear-gradient(180deg, #C03221 0%, #FCAB10 100%)"}/>
        </div>
      
    );
  }