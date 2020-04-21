import React, { useState } from 'react';
import Status from './components/Status';

function App() {
  const [activePage, setActivePage] = useState('status');

  const returnActivePage = (activePage) => {
    switch (activePage) {
      case 'status':
        return <Status />;
      case 'at-chat':
        return <div>AT Chat Terminal</div>;
      case 'about':
        return <div>About</div>;
      default:
        return <Status />;
    }
  };

  return (
    <div className="App">
      <nav>
        <ul>
          <li onClick={() => setActivePage('status')}>Status</li>
          <li onClick={() => setActivePage('at-chat')}>AT Chat</li>
          <li onClick={() => setActivePage('about')}>About</li>
        </ul>
      </nav>
      <main>{returnActivePage(activePage)}</main>
    </div>
  );
}

export default App;
