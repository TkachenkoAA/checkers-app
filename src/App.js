import React from 'react';
import './App.css';
import { CheckerGame } from './features/game/Game';
import { Layout } from './features/layout/Layout';

function CheckersApp() {
  return (
    <div className="app">
      <div className="app-layout">
        <CheckerGame />
        <Layout />
      </div>
    </div>
  );
}

export default CheckersApp;
