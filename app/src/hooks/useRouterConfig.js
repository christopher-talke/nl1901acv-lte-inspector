import { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

const useRouterConfig = () => {
  const [routerConfig, setRouterConfig] = useState({});

  useEffect(() => {
    ipcRenderer.send(`router-config-request`);
    ipcRenderer.on(`router-config-reply`, (_, arg) => {
      setRouterConfig(arg);
    });
  }, []);

  const updateRouterConfig = (object) => {
    setRouterConfig(object);
    ipcRenderer.send(`router-config-post`, object);
    ipcRenderer.on(`router-config-post-reply`, (_, arg) => {
      setRouterConfig(arg);
    });
  };

  return [routerConfig, setRouterConfig, updateRouterConfig];
};

export default useRouterConfig;
