import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function calculateCirclePositions(rows, width, height) {
  const positions = [];
  const initialCircles = 3;
  const verticalSpacingFactor = 0.7;
  const horizontalSpacingFactor = 2.5;
  const radiusFactor = 0.6;

  const rowHeight = (height / (rows + 1)) * verticalSpacingFactor;
  const maxRadius = (Math.min(width / ((initialCircles + rows) * horizontalSpacingFactor), rowHeight) / 2) * radiusFactor;

  for (let row = 0; row <= rows; row++) {
    const circlesInRow = initialCircles + row;
    const y = 25 + rowHeight * row + maxRadius;

    const startX = (width - (circlesInRow - 1) * maxRadius * 2 * horizontalSpacingFactor) / 2;

    for (let col = 0; col < circlesInRow; col++) {
      positions.push({ x: startX + col * maxRadius * 2 * horizontalSpacingFactor, y, radius: maxRadius });
    }
  }

  return { positions, maxRadius };
}

export function createWindow(Bodies, height, width) {
  const ground = Bodies.rectangle(width / 2, height, width, 50, {
    isStatic: true,
  });
  const ceiling = Bodies.rectangle(width / 2, 0, width, 1, {
    isStatic: true,
  });
  const wallL = Bodies.rectangle(0, height / 2, 1, height, {
    isStatic: true,
  });
  const wallR = Bodies.rectangle(width, height / 2, 50, height, {
    isStatic: true,
  });

  return { ground, ceiling, wallL, wallR };
}

export const calculateBallPath = (positions, path, radius) => {
  const ballPath = [];
  let currentX = positions[0].x;
  let currentY = positions[0].y - radius * 4; // Start above the first row of pegs

  ballPath.push({ x: currentX, y: currentY });

  path.forEach((direction) => {
    currentY += radius * 4; // Move down to the next row
    if (direction === "R") {
      currentX += radius * 2.5;
    } else if (direction === "L") {
      currentX -= radius * 2.5;
    }
    ballPath.push({ x: currentX, y: currentY });
  });
  return ballPath;
};
