import React from 'react';

const Datatable = ({ data }) => {
  const headings = (header) => {
    switch (header) {
      case 'modemReadings':
        return 'Modem';
      case 'servingCellReadings':
        return 'Serving Cell';
      case 'networkInformation':
        return 'Network Information';
      case 'signalQualityReport':
        return 'Signal Quality Report';
      default:
        break;
    }
  };

  return (
    <div>
      <table>
        {Object.keys(data).map((key) => {
          return (
            <>
              <tr>
                <td className="datatable-header" colSpan="2">
                  {headings(key)}
                </td>
              </tr>
              {Object.keys(data[key]).map((innerKey) => (
                <tr className="datatable-values">
                  <td className="datatable-key">{innerKey}</td>
                  <td>{typeof data[key][innerKey] === 'object' ? data[key][innerKey].mapping : data[key][innerKey]}</td>
                </tr>
              ))}
            </>
          );
        })}
      </table>
    </div>
  );
};

export default Datatable;
