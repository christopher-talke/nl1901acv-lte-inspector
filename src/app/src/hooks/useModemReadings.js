import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

const useModemReadings = () => {
  const [modemReadings, setModemReadings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModemReadings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setModemReadings]);

  const getModemReadings = async () => {
    setLoading(true);
    ipcRenderer.send(`modem-reading-request`);
    ipcRenderer.on(`modem-reading-reply`, (_, arg) => {
      setModemReadings(arg);
      setLoading(false);
    });
  };

  return [loading, modemReadings, getModemReadings];
};

export default useModemReadings;
