import React, { useState, useEffect } from 'react';

import Loading from './Loading';
import Datatable from './Datatable';

import useModemReadings from '../hooks/useModemReadings';
import useRouterConfig from '../hooks/useRouterConfig';

const Status = () => {
  const [loading, modemReadings, getModemReadings] = useModemReadings();
  const [routerConfig] = useRouterConfig();
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (routerConfig !== {}) {
      setTrigger(true);
    }
  }, [routerConfig]);

  if (trigger) {
    getModemReadings(routerConfig);
    setTrigger(false);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div id="status">
      <Datatable data={modemReadings} />
    </div>
  );
};

export default Status;
