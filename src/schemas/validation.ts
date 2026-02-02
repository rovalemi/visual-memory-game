import { z } from 'zod';

export const PositionSchema = z.object({
  row: z.number().int().min(0).max(2),
  col: z.number().int().min(0).max(2),
});

export const MemoryObjectSchema = z.object({
  id: z.string().uuid(),
  position: PositionSchema,
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  shape: z.enum(['box', 'sphere', 'cone', 'torus']),
});

export const UserClickSchema = z.object({
  position: PositionSchema,
  timestamp: z.number(),
  correct: z.boolean(),
});

export const DifficultyConfigSchema = z.object({
  gridSize : z.number().int().min(2).max(5),
  objectCount: z.number().int().min(3).max(9),
  memorizeTime: z.number().int().min(2).max(10),
});

export const MemoryGameResultsSchema = z.object({
  totalObjects: z.number(),
  correctClicks: z.number(),
  incorrectClicks: z.number(),
  missedObjects: z.number(),
  accuracy: z.number().min(0).max(100),
  averageResponseTime: z.number(),
  clicks: z.array(UserClickSchema),
});

export type Position = z.infer<typeof PositionSchema>;
export type MemoryObject = z.infer<typeof MemoryObjectSchema>;
export type UserClick = z.infer<typeof UserClickSchema>;
export type DifficultyConfig = z.infer<typeof DifficultyConfigSchema>;
export type MemoryGameResults = z.infer<typeof MemoryGameResultsSchema>;

export const DIFFICULTY_LEVELS = {
  easy: {
    gridSize: 3,
    objectCount: 4,
    memorizeTime: 5,
  },
  medium: {
    gridSize: 3,
    objectCount: 6,
    memorizeTime: 4,
  },
  hard: {
    gridSize: 3,
    objectCount: 8,
    memorizeTime: 3,
  }
} as const;

export type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

export const positionsEqual = (pos1: Position, pos2: Position): boolean => {
  return pos1.row === pos2.row && pos1.col === pos2.col;
};

export const isValidPosition = (position: Position, gridSize: number): boolean => {
  try {
    PositionSchema.parse(position);
    return position.row < gridSize && position.col < gridSize;
  } catch {
    return false;
  }
}
