import React from 'react';
import Gauge from './Gauge';

const Status = () => {
  return (
    <div id="status">
      <div id="modem-readings">
        <h1>Modem</h1>
        <div className="readings">
          <div className="reading">
            <Gauge value={90} />
          </div>
          <h3>RSSI</h3>
        </div>
        <div className="readings">
          <div className="reading">
            <Gauge value={90} />
          </div>
          <h3>RSRP</h3>
        </div>
        <div className="readings">
          <div className="reading">
            <Gauge value={90} />
          </div>
          <h3>SINR</h3>
        </div>
        <div className="readings">
          <div className="reading">
            <Gauge value={90} />
          </div>
          <h3>RSRQ</h3>
        </div>
      </div>

      <div id="service-cell-readings">
        <h1>Service Cell</h1>
        <div className="readings">
          <div className="reading">
            <Gauge value={90} />
          </div>
          <h3>RSSI</h3>
        </div>
        <div className="readings">
          <div className="reading">
            <Gauge value={90} />
          </div>
          <h3>RSRP</h3>
        </div>
        <div className="readings">
          <div className="reading">
            <Gauge value={90} />
          </div>
          <h3>RSRQ</h3>
        </div>
      </div>
    </div>
  );
};

export default Status;
