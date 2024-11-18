import Router from "./components/Router"
import Header from "./components/Header"
import styled from "styled-components";

const AppWrapper = styled.div`
  min-height: 100vh;
  padding-top: 110px; // Height of the header
`;

function App() {
  return (
    <div className="App">
      <Header />
      <AppWrapper>
        <Router/>
      </AppWrapper>
    </div>
  );
}

export default App;
