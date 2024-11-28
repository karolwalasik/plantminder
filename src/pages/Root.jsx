import { Container } from "@mui/material";
import styled from "styled-components";
import { useState, useEffect } from 'react';
import AutomationLogs from '../components/AutomationLogs';
import CardsGrid from '../components/CardsGrid';
import Controls from '../components/Controls';
import { mockData } from '../helpers/mockData';
import Loader from '../components/Loader';
import {useMockMqttData} from '../hooks/useMockMqttData';
import { useMqttData } from "../hooks/useMqttData";

const DashboardWrapper = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: '32px',
  paddingTop: '32px',
  paddingBottom: '64px',
}));

export default function Root() {
  // const [logs] = useState(mockData.logs);
  // const [sensors] = useState(mockData.sensors);
  // const [controls, setControls] = useState(mockData.controls);
  // const [isLoading, setIsLoading] = useState(true);

//    const { 
//     isLoading, 
//     sensors, 
//     controls, 
//     logs, 
//     publishControl 
//   } = useMockMqttData();

  const { 
    isLoading, 
    sensors, 
    controls, 
    logs, 
    publishControl 
  } = useMqttData();

  const handleControlChange = (name,control, state) => {
    console.log(name,state)
    publishControl(name, control,state);
  };

  // useEffect(() => {
  //   // Simulate loading time
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  // const handleControlChange = (name, state) => {
  //   setControls(controls.map(control => 
  //     control.name === name ? { ...control, state } : control
  //   ));
  // };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DashboardWrapper>
      <AutomationLogs logs={logs} />
      <CardsGrid sensors={sensors} />
      <Controls controls={controls} onControlChange={handleControlChange} />
    </DashboardWrapper>
  );
}