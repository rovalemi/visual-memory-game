import React from 'react';
import type { Position, UserClick } from '../schemas/validation';
import { positionsEqual } from '../schemas/validation';

interface MemoryGridProps {
  gridSize: number;
  userClicks: UserClick[];
  onCellClick: (position: Position) => void;
  disabled?: boolean;
}

export const MemoryGrid: React.FC<MemoryGridProps> = ({
  gridSize,
  userClicks,
  onCellClick,
  disabled = false,
}) => {
  
  const getCellStatus = (row: number, col: number): 'unclicked' | 'correct' | 'incorrect' => {
    const click = userClicks.find(click => 
      positionsEqual(click.position, { row, col })
    );
    
    if (!click) return 'unclicked';
    return click.correct ? 'correct' : 'incorrect';
  };

  const renderGrid = () => {
    const rows = [];
    
    for (let row = 0; row < gridSize; row++) {
      const cells = [];
      
      for (let col = 0; col < gridSize; col++) {
        const status = getCellStatus(row, col);
        
        cells.push(
          <button
            key={`${row}-${col}`}
            className={`grid-cell ${status} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && onCellClick({ row, col })}
            disabled={disabled || status !== 'unclicked'}
          >
            {status === 'correct' && <span className="cell-icon">✓</span>}
            {status === 'incorrect' && <span className="cell-icon">✗</span>}
          </button>
        );
      }
      
      rows.push(
        <div key={row} className="grid-row">
          {cells}
        </div>
      );
    }
    
    return rows;
  };

  return (
    <div className="memory-grid-container">
      <div className="memory-grid">
        {renderGrid()}
      </div>
      
      <div className="grid-stats">
        <div className="stat">
          <span className="stat-label">Seleccionadas:</span>
          <span className="stat-value">{userClicks.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Correctas:</span>
          <span className="stat-value correct">
            {userClicks.filter(c => c.correct).length}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Incorrectas:</span>
          <span className="stat-value incorrect">
            {userClicks.filter(c => !c.correct).length}
          </span>
        </div>
      </div>
    </div>
  );
};
