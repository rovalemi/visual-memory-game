import React from 'react';
import type { MemoryGameResults } from '../schemas/validation';

// ==================== ¿QUÉ HACE ESTE COMPONENTE? ====================
// Muestra las estadísticas finales del juego
// Accuracy, tiempo promedio, aciertos, errores
// Botones para jugar de nuevo o volver al menú

interface ResultsScreenProps {
  results: MemoryGameResults;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  results,
  onPlayAgain,
  onBackToMenu,
}) => {
  
  /**
   * Determina el mensaje según la precisión
   */
  const getPerformanceMessage = (): { emoji: string; message: string; color: string } => {
    const { accuracy } = results;
    
    if (accuracy === 100) {
      return {
        emoji: '🏆',
        message: '¡Perfecto! Memoria excepcional',
        color: '#10b981'
      };
    } else if (accuracy >= 75) {
      return {
        emoji: '🎉',
        message: '¡Excelente! Gran memoria visual',
        color: '#3b82f6'
      };
    } else if (accuracy >= 50) {
      return {
        emoji: '👍',
        message: 'Bien hecho, sigue practicando',
        color: '#f59e0b'
      };
    } else {
      return {
        emoji: '💪',
        message: 'Sigue intentando, mejorarás',
        color: '#ef4444'
      };
    }
  };

  const performance = getPerformanceMessage();

  return (
    <div className="results-container">
      <div className="results-header">
        <div 
          className="performance-badge"
          style={{ backgroundColor: performance.color }}
        >
          <span className="performance-emoji">{performance.emoji}</span>
          <h2 className="performance-message">{performance.message}</h2>
        </div>
      </div>

      <div className="results-grid">
        {/* Precisión */}
        <div className="result-card primary">
          <div className="result-icon">🎯</div>
          <div className="result-content">
            <span className="result-label">Precisión</span>
            <span className="result-value">{results.accuracy.toFixed(1)}%</span>
          </div>
        </div>

        {/* Aciertos */}
        <div className="result-card success">
          <div className="result-icon">✓</div>
          <div className="result-content">
            <span className="result-label">Aciertos</span>
            <span className="result-value">
              {results.correctClicks} / {results.totalObjects}
            </span>
          </div>
        </div>

        {/* Errores */}
        <div className="result-card error">
          <div className="result-icon">✗</div>
          <div className="result-content">
            <span className="result-label">Errores</span>
            <span className="result-value">{results.incorrectClicks}</span>
          </div>
        </div>

        {/* Objetos perdidos */}
        <div className="result-card warning">
          <div className="result-icon">❓</div>
          <div className="result-content">
            <span className="result-label">No recordados</span>
            <span className="result-value">{results.missedObjects}</span>
          </div>
        </div>

        {/* Tiempo promedio */}
        <div className="result-card info">
          <div className="result-icon">⏱️</div>
          <div className="result-content">
            <span className="result-label">Tiempo promedio</span>
            <span className="result-value">
              {(results.averageResponseTime / 1000).toFixed(1)}s
            </span>
          </div>
        </div>
      </div>

      {/* Análisis detallado */}
      <div className="results-analysis">
        <h3>Análisis del Rendimiento</h3>
        <div className="analysis-items">
          <div className="analysis-item">
            <span className="analysis-label">Capacidad de memoria:</span>
            <span className="analysis-value">
              {results.correctClicks >= results.totalObjects * 0.75
                ? 'Alta'
                : results.correctClicks >= results.totalObjects * 0.5
                ? 'Media'
                : 'Baja'}
            </span>
          </div>
          
          <div className="analysis-item">
            <span className="analysis-label">Errores espaciales:</span>
            <span className="analysis-value">
              {results.incorrectClicks === 0
                ? 'Ninguno - Excelente'
                : results.incorrectClicks <= 2
                ? 'Pocos - Bien'
                : 'Varios - Mejorable'}
            </span>
          </div>
          
          <div className="analysis-item">
            <span className="analysis-label">Velocidad de respuesta:</span>
            <span className="analysis-value">
              {results.averageResponseTime < 3000
                ? 'Rápida'
                : results.averageResponseTime < 5000
                ? 'Normal'
                : 'Lenta'}
            </span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="results-actions">
        <button className="button-secondary" onClick={onBackToMenu}>
          ← Volver al menú
        </button>
        <button className="button-primary" onClick={onPlayAgain}>
          Jugar de nuevo 🔄
        </button>
      </div>
    </div>
  );
};
