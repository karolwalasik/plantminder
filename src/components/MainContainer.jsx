import styled from "styled-components";
import '../assets/fonts.js'
import { COLORS } from '../constants/COLORS.js'

const StyledContainer = styled.div`
    height:100%;
    min-height: 100vh;
    background: ${COLORS.LIGHT_GREY}
`

export const MainContainer = ({children}) => {
    return <StyledContainer className="main-container">{children}</StyledContainer>
}
