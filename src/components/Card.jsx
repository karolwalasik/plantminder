import styled from "styled-components";
import { Typography } from "@mui/material";
import {COLORS} from '../constants/COLORS';
import { useTheme } from "@mui/material/styles";

const Wrapper = styled.div`
    color: white;
    padding:20px;
    border-radius: 12px;
    width:400px;
    height: 240px; 
    display:flex;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    background: ${(props) => props.$bg || COLORS.PRIMARY};

    ${(props) => props.theme.breakpoints.down("sm")} {
        width: 320px;
        height: 180px;
    }
`

const IconSection = styled.div`
    display:flex;
    flex:2;
    align-items:center;
    justify-content: center;
    > svg {
        width: 90px;
        height:100%;
        max-height: 180px;
        ${(props) => props.theme.breakpoints.down("sm")} {
            width: 60px
            max-height:120px;
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
    font-size: 8rem;
`

const Card = ({icon: Icon, value, valueName, bg}) => {
    const theme = useTheme();

    return (
        <Wrapper $bg={bg} theme={theme}>
            <IconSection theme={theme}>
                {Icon && <Icon />}
            </IconSection>
            <ValueSection>
                <Value sx={{fontSize: {xs: '6.4rem',sm: '8rem'}}} fontWeight={600}>{value}</Value>
                <ValueName sx={{fontSize: {xs: '2rem',sm: '2.4rem'}}}>{valueName}</ValueName>
            </ValueSection>
        </Wrapper>
    )
}

export default Card