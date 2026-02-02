import { useState, useCallback, useEffect } from "react";
import { 
  positionsEqual,
  type DifficultyConfig, 
  type MemoryGameResults, 
  type MemoryObject, 
  type Position, 
  type UserClick 
} from "../schemas/validation";
import { v4 as uuidv4 } from 'uuid';

type GamePhase = 'instructions' | 'memorizing' | 'recalling' | 'finished';

interface UseMemoryGameReturn {
  gamePhase: GamePhase;
  objects: MemoryObject[];
  userClicks: UserClick[];
  timeLeft: number;
  config: DifficultyConfig;

  startGame: () => void;
  handleCellClick: (position: Position) => void;
  finishRecall: () => void;
  resetGame: () => void;

  results: MemoryGameResults | null;
}

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1', 
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
];

const SHAPES: Array<'box' | 'sphere' | 'cone' | 'torus'> = [
  'box',
  'sphere',
  'cone',
  'torus',
];

export const useMemoryGame = (initialConfig: DifficultyConfig): UseMemoryGameReturn => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('instructions');
  const [objects, setObjects] = useState<MemoryObject[]>([]);
  const [userClicks, setUserClicks] = useState<UserClick[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [config] = useState<DifficultyConfig>(initialConfig);
  const [results, setResults] = useState<MemoryGameResults | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  const generateRandomPositions = useCallback((count: number, gridSize: number): Position[] => {
    const positions: Position[] = [];
    const available: Position[] = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        available.push({ row, col });
      }
    }

    for (let i = 0; i < count && available.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      positions.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }

    return positions;
  }, []);

  const generateObjects = useCallback((): MemoryObject[] => {
    const positions = generateRandomPositions(config.objectCount, config.gridSize);

    return positions.map((position, index) => ({
      id: uuidv4(),
      position,
      color: COLORS[index % COLORS.length],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    }));
  }, [config, generateRandomPositions]);

  useEffect(() => {
    if (gamePhase !== 'memorizing' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGamePhase('recalling');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase, timeLeft]);

  const startGame = useCallback(() => {
    const newObjects = generateObjects();
    setObjects(newObjects);
    setUserClicks([]);
    setResults(null);
    setGamePhase('memorizing');
    setTimeLeft(config.memorizeTime);
    setStartTime(Date.now());
  }, [config, generateObjects]);

  const handleCellClick = useCallback((position: Position) => {
    if (gamePhase !== 'recalling') return;

    const alreadyClicked = userClicks.some(click => 
      positionsEqual(click.position, position)
    );

    if (alreadyClicked) return;

    const isCorrect = objects.some(obj => 
      positionsEqual(obj.position, position)
    );

    const newClick: UserClick = {
      position,
      timestamp: Date.now() - startTime,
      correct: isCorrect,
    };

    setUserClicks(prev => [...prev, newClick]);
  }, [gamePhase, userClicks, objects, startTime]);

  const finishRecall = useCallback(() => {
    setGamePhase('finished');

    const correctClicks = userClicks.filter(click => click.correct).length;
    const incorrectClicks = userClicks.filter(click => !click.correct).length;
    const missedObjects = config.objectCount - correctClicks;
    const accuracy = config.objectCount > 0 
      ? (correctClicks / config.objectCount) * 100 
      : 0;
    
    const responseTimes = userClicks.map(click => click.timestamp);
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    const gameResults: MemoryGameResults = {
      totalObjects: config.objectCount,
      correctClicks,
      incorrectClicks,
      missedObjects,
      accuracy,
      averageResponseTime,
      clicks: userClicks,
    };

    setResults(gameResults);
  }, [userClicks, config]);

  const resetGame = useCallback(() => {
    setGamePhase('instructions');
    setObjects([]);
    setUserClicks([]);
    setTimeLeft(0);
    setResults(null);
  }, []);

  return {
    gamePhase,
    objects,
    userClicks,
    timeLeft,
    config,
    startGame,
    handleCellClick,
    finishRecall,
    resetGame,
    results,
  };
};
