import React from 'react';
import type { DifficultyLevel } from '../schemas/validation';
import { DIFFICULTY_LEVELS } from '../schemas/validation';

interface InstructionsProps {
  selectedDifficulty: DifficultyLevel;
  onDifficultyChange: (level: DifficultyLevel) => void;
  onStart: () => void;
}

export const Instructions: React.FC<InstructionsProps> = ({
  selectedDifficulty,
  onDifficultyChange,
  onStart,
}) => {
  const config = DIFFICULTY_LEVELS[selectedDifficulty];

  return (
    <div className="instructions-container">
      <div className="instructions-header">
        <h1 className="game-title">🧠 Visual Memory</h1>
        <p className="game-subtitle">
          Pon a prueba tu memoria visual espacial
        </p>
      </div>

      <div className="instructions-content">
        <div className="instruction-card">
          <div className="instruction-step">
            <span className="step-number">1</span>
            <div className="step-content">
              <h3>Memoriza</h3>
              <p>
                Observa los objetos 3D que aparecen en la cuadrícula durante{' '}
                <strong>{config.memorizeTime} segundos</strong>
              </p>
            </div>
          </div>

          <div className="instruction-step">
            <span className="step-number">2</span>
            <div className="step-content">
              <h3>Recuerda</h3>
              <p>
                Los objetos desaparecerán. Haz clic en las celdas donde 
                recuerdas que estaban los objetos
              </p>
            </div>
          </div>

          <div className="instruction-step">
            <span className="step-number">3</span>
            <div className="step-content">
              <h3>Finaliza</h3>
              <p>
                Cuando hayas seleccionado todas las posiciones que recuerdas,
                presiona "Finalizar" para ver tus resultados
              </p>
            </div>
          </div>
        </div>

        <div className="difficulty-selector">
          <h3>Nivel de Dificultad</h3>
          <div className="difficulty-buttons">
            {(Object.keys(DIFFICULTY_LEVELS) as DifficultyLevel[]).map(level => {
              const levelConfig = DIFFICULTY_LEVELS[level];
              return (
                <button
                  key={level}
                  className={`difficulty-button ${
                    selectedDifficulty === level ? 'active' : ''
                  }`}
                  onClick={() => onDifficultyChange(level)}
                >
                  <span className="difficulty-name">
                    {level === 'easy' && '😊 Fácil'}
                    {level === 'medium' && '😐 Medio'}
                    {level === 'hard' && '😰 Difícil'}
                  </span>
                  <span className="difficulty-details">
                    {levelConfig.objectCount} objetos - {levelConfig.memorizeTime}s
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button className="start-button" onClick={onStart}>
          Comenzar Juego 🚀
        </button>
      </div>
    </div>
  );
};
