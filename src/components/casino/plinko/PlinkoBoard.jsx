"use client";
import React, { useEffect, useRef, useState } from "react";
import { Bodies, Composite, Engine, Runner, Events, Body } from "matter-js";

import { calculateCirclePositions, createWindow } from "@/lib/utils";
import Dot from "@/components/casino/plinko/Dot";
import Ball from "@/components/casino/plinko/Ball";

export default function PlinkoBoard({ rows, path = ["R", "L", "L", "L", "L", "L", "L", "L"] }) {
  const [dots, setDots] = useState([]);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0, radius: 5 });

  const ref = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const ballRef = useRef(null);

  useEffect(() => {
    const engine = Engine.create();
    const runner = Runner.create();

    engineRef.current = engine;
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const width = ref.current?.clientWidth ?? 0;
    const height = ref.current?.clientHeight ?? 0;

    const { ground, ceiling, wallL, wallR } = createWindow(Bodies, height, width);
    Composite.add(engine.world, [ground, ceiling, wallL, wallR]);

    const { positions, maxRadius } = calculateCirclePositions(rows, width, height);
    const fixedBalls = positions.map((pos) => Bodies.circle(pos.x, pos.y, pos.radius, { isStatic: true }));
    Composite.add(engine.world, fixedBalls);

    const ballMass = 1;
    const ballRestitution = 0.5;
    const ballFriction = 0.01;

    const ball = Bodies.circle(width / 2, 0, maxRadius, {
      mass: ballMass,
      restitution: ballRestitution,
      friction: ballFriction,
    });
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
  }, [rows, ref.current?.clientWidth, ref.current?.clientHeight]);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="relative h-full w-full bg-gray-600" ref={ref}>
        {dots.map((dot, key) => (
          <Dot key={key} x={dot.x} y={dot.y} radius={dot.radius} refHeight={ref.current.clientHeight} refWidth={ref.current.clientWidth} />
        ))}
        {ballRef.current && (
          <Ball
            x={ballPosition.x}
            y={ballPosition.y}
            radius={ballPosition.radius}
            refHeight={ref.current.clientHeight}
            refWidth={ref.current.clientWidth}
          />
        )}
      </div>
    </div>
  );
}
