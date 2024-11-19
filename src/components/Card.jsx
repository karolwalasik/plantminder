import styled from "styled-components";
import { Typography } from "@mui/material";
import {COLORS} from '../constants/COLORS';
import { useTheme } from "@mui/material/styles";

const Wrapper = styled.div`
    color: white;
    padding:20px;
    border-radius: 12px;
    width:360px;
    height: 220px; 
    display:flex;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    background: ${(props) => props.$bg || COLORS.PRIMARY};

    ${(props) => props.theme.breakpoints.down("sm")} {
        width: 280px;
        height: 160px;
    }
`

const IconSection = styled.div`
    display:flex;
    flex:2;
    align-items:center;
    justify-content: center;
    > svg {
        width: 70px;
        height:100%;
        max-height: 160px;
        ${(props) => props.theme.breakpoints.down("sm")} {
            width: 50px;
            max-height:100px;
        }
        
        >path {
            fill:white;
        }
    }
`

const ValueSection = styled.div`
    display:flex;
    flex:3;
    flex-direction:column;
    align-items:center;
    justify-content: center;
`

const ValueName = styled(Typography)`
    text-transform: uppercase;
    letter-spacing: 0.2em;
`

const Value = styled(Typography)`
    font-size: 5rem;
`

const Card = ({icon: Icon, value, valueName, bg, unit}) => {
    const theme = useTheme();

    return (
        <Wrapper $bg={bg} theme={theme}>
            <IconSection theme={theme}>
                {Icon && <Icon />}
            </IconSection>
            <ValueSection>
                <Value sx={{fontSize: {xs: '4.8rem',sm: '6rem'}}} fontWeight={600}>{value}{unit}</Value>
                <ValueName sx={{fontSize: {xs: '1.6rem',sm: '2.4rem'}}}>{valueName}</ValueName>
            </ValueSection>
        </Wrapper>
    )
}

export default Card