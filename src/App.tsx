import { useState } from 'react';
import { Instructions } from './components/Instructions';
import { Scene3D } from './components/Scene3D';
import { MemoryGrid } from './components/MemoryGrid';
import { ResultsScreen } from './components/ResultsScreen';
import { useMemoryGame } from './hooks/useMemoryGame';
import { DIFFICULTY_LEVELS, type DifficultyLevel } from './schemas/validation';
import './App.css';

// ==================== ¿CÓMO FUNCIONA LA APP? ====================
// 1. Usuario elige dificultad (Instructions)
// 2. Ve objetos 3D por N segundos (Scene3D + countdown)
// 3. Objetos desaparecen, hace clic en cuadrícula (MemoryGrid)
// 4. Ve resultados (ResultsScreen)

function App() {
  // Estado de dificultad seleccionada
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy');
  
  // Hook del juego con la configuración actual
  const game = useMemoryGame(DIFFICULTY_LEVELS[difficulty]);

  // ==================== HANDLERS ====================

  const handleStart = () => {
    game.startGame();
  };

  const handlePlayAgain = () => {
    game.resetGame();
  };

  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
  };

  // ==================== RENDER ====================

  return (
    <div className="app">
      <div className="app-container">
        
        {/* ===== FASE: INSTRUCCIONES ===== */}
        {game.gamePhase === 'instructions' && (
          <Instructions
            selectedDifficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
            onStart={handleStart}
          />
        )}

        {/* ===== FASE: MEMORIZACIÓN ===== */}
        {game.gamePhase === 'memorizing' && (
          <div className="game-phase memorizing">
            <div className="phase-header">
              <h2>¡Memoriza las posiciones!</h2>
              <div className="countdown-timer">
                <span className="timer-icon">⏱️</span>
                <span className="timer-value">{game.timeLeft}s</span>
              </div>
            </div>

            <Scene3D 
              objects={game.objects} 
              gridSize={game.config.gridSize} 
            />

            <div className="phase-info">
              <p>
                Observa cuidadosamente la posición de los{' '}
                <strong>{game.config.objectCount} objetos</strong>
              </p>
            </div>
          </div>
        )}

        {/* ===== FASE: RECUERDO ===== */}
        {game.gamePhase === 'recalling' && (
          <div className="game-phase recalling">
            <div className="phase-header">
              <h2>¿Dónde estaban los objetos?</h2>
              <p>Haz clic en las celdas donde recuerdas que estaban</p>
            </div>

            <MemoryGrid
              gridSize={game.config.gridSize}
              userClicks={game.userClicks}
              onCellClick={game.handleCellClick}
            />

            <div className="phase-actions">
              <button 
                className="button-finish"
                onClick={game.finishRecall}
                disabled={game.userClicks.length === 0}
              >
                Finalizar Prueba
              </button>
              
              {game.userClicks.length > 0 && (
                <p className="hint-text">
                  Has seleccionado {game.userClicks.length} de{' '}
                  {game.config.objectCount} posiciones
                </p>
              )}
            </div>
          </div>
        )}

        {/* ===== FASE: RESULTADOS ===== */}
        {game.gamePhase === 'finished' && game.results && (
          <ResultsScreen
            results={game.results}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={game.resetGame}
          />
        )}
      </div>
    </div>
  );
}

export default App;
