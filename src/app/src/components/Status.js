import React from 'react';

import Loading from './Loading';
import Datatable from './Datatable';

import useModemReadings from '../hooks/useModemReadings';

const Status = () => {
  const [loading, modemReadings, getModemReadings] = useModemReadings('modem-reading', 'modemReadings');

  console.log(loading, modemReadings);

  if (loading) return <Loading />;

  return (
    <div id="status">
      <Datatable data={modemReadings} />
    </div>
  );
};

export default Status;
