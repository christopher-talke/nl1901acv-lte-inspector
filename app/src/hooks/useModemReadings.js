import { useState } from 'react';
const { ipcRenderer } = window.require('electron');

const useModemReadings = () => {
  const [modemReadings, setModemReadings] = useState({});
  const [loading, setLoading] = useState(true);

  const getModemReadings = async (config) => {
    setLoading(true);
    ipcRenderer.send(`modem-reading-request`, config);
    ipcRenderer.on(`modem-reading-reply`, (_, arg) => {
      console.log(arg);
      setModemReadings(arg);
      setLoading(false);
    });
  };

  return [loading, modemReadings, getModemReadings];
};

export default useModemReadings;
