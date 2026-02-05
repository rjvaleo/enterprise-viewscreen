import './App.css'
import ViewScreen from './components/ViewScreen'
import ControlsUI from './components/ControlsUI'
import { GameProvider } from './GameContext'

function App() {
  return (
    <GameProvider>
      <div className="app-container">
        <header className="bridge-header">
          <h1>USS ENTERPRISE // MAIN VIEWER</h1>
        </header>
        <main className="viewscreen-container">
          <ViewScreen />
        </main>
        <footer className="bridge-footer">
          <ControlsUI />
        </footer>
      </div>
    </GameProvider>
  )
}

export default App
