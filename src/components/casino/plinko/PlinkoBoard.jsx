"use client";
import React, { useEffect, useRef, useState } from "react";
import { Bodies, Composite, Engine, Runner, Events } from "matter-js";

const calculateCirclePositions = (rows, width, height) => {
  const positions = [];
  const initialCircles = 3;
  const verticalSpacingFactor = 0.8;
  const horizontalSpacingFactor = 2.5;
  const radiusFactor = 0.5;

  const rowHeight = (height / (rows + 1)) * verticalSpacingFactor;
  const maxRadius = (Math.min(width / ((initialCircles + rows) * horizontalSpacingFactor), rowHeight) / 2) * radiusFactor;

  const topOffset = maxRadius * 5;

  for (let row = 0; row <= rows; row++) {
    const circlesInRow = initialCircles + row;
    const y = topOffset + rowHeight * row + maxRadius;

    const startX = (width - (circlesInRow - 1) * maxRadius * 2 * horizontalSpacingFactor) / 2;

    for (let col = 0; col < circlesInRow; col++) {
      positions.push({ x: startX + col * maxRadius * 2 * horizontalSpacingFactor, y, radius: maxRadius });
    }
  }

  return positions;
};

export default function PlinkoBoard({ rows, path = ["L", "L", "L", "L", "L", "L", "L", "L"] }) {
  const [dots, setDots] = useState([]);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0, radius: 5 });
  const ref = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const ballRef = useRef(null);

  useEffect(() => {
    const engine = Engine.create();
    engine.gravity.y = 0.7;
    const runner = Runner.create();

    engineRef.current = engine;
    runnerRef.current = runner;

    Runner.run(runner, engine);

    const width = ref.current?.clientWidth ?? 0;
    const height = ref.current?.clientHeight ?? 0;

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

    Composite.add(engine.world, [ground, ceiling, wallL, wallR]);

    const positions = calculateCirclePositions(rows, width, height);
    const fixedBalls = positions.map((pos) => Bodies.circle(pos.x, pos.y, pos.radius, { isStatic: true }));

    Composite.add(engine.world, fixedBalls);

    const ball = Bodies.circle(width / 2, 0, 4, { restitution: 0.3, friction: 0.1 });
    ballRef.current = ball;

    Composite.add(engine.world, ball);

    setDots(
      fixedBalls.map((ball) => ({
        x: ball.position.x,
        y: ball.position.y,
        radius: ball.circleRadius,
      }))
    );

    const updateBallPosition = () => {
      setBallPosition({
        x: ball.position.x,
        y: ball.position.y,
        radius: ball.circleRadius,
      });
    };

    Events.on(engine, "afterUpdate", updateBallPosition);

    return () => {
      if (engineRef.current) {
        Composite.clear(engineRef.current.world, false);
        Engine.clear(engineRef.current);
      }
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
      Events.off(engine, "afterUpdate", updateBallPosition);
    };
  }, [rows]);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="relative h-full w-full" ref={ref}>
        {dots.map((dot, key) => (
          <div
            className="bg-gray-200 absolute rounded-full shadow-sm"
            key={key}
            style={{
              top: `${((dot.y - dot.radius) / ref.current.clientHeight) * 100}%`,
              left: `${((dot.x - dot.radius) / ref.current.clientWidth) * 100}%`,
              width: `${dot.radius * 2}px`,
              height: `${dot.radius * 2}px`,
              borderRadius: "50%",
            }}
          />
        ))}

        {ballRef.current && (
          <div
            className="bg-red-500 absolute rounded-full shadow-sm"
            style={{
              top: `${((ballPosition.y - ballPosition.radius) / ref.current.clientHeight) * 100}%`,
              left: `${((ballPosition.x - ballPosition.radius) / ref.current.clientWidth) * 100}%`,
              width: `${ballPosition.radius * 2}px`,
              height: `${ballPosition.radius * 2}px`,
              borderRadius: "50%",
            }}
          />
        )}
      </div>
    </div>
  );
}
