import { useGesture } from "@use-gesture/react";
import clsx from "clsx";
import { useRef, useState } from "react";
import styles from "./Board.module.css";
import { Point } from "./types";
import { getRelativePoint, multiply, sub } from "./utils";

export const Board = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [mouse, setMouse] = useState<Point>([0, 0]);
  const [camera, setCamera] = useState<Point>([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState<Point | null>(null);
  const [mode, setMode] = useState<"none" | "select" | "move" | "pinch">(
    "none"
  );

  const [stickyNotes, setStickyNotes] = useState<Point[]>([[0, 0]]);

  useGesture(
    {
      // onClick: (state) => {},
      // onDrag: (state) => doSomethingWith(state),
      // onDragStart: (state) => doSomethingWith(state),
      // onDragEnd: (state) => doSomethingWith(state),
      onPinchStart: (state) => {
        setMode(() => "pinch");
      },
      onPinch: (state) => {
        const nextZoom = Math.max(state.offset[0], 0.1);
        setZoom(() => nextZoom);
      },
      onPinchEnd: (state) => {
        setMode(() => "none");
      },
      // onScrollStart: (state) => doSomethingWith(state),
      // onScrollEnd: (state) => doSomethingWith(state),
      // onMoveStart: (state) => {},
      // onMove: (state) => {},
      // onMoveEnd: (state) => {},
      onWheel: (state) => {
        if (mode === "pinch") {
          return;
        }
        const factor = Math.min(1, Math.max(0.5, zoom));
        const scaledDelta = multiply(state.delta, factor);
        setCamera((c) => sub(c, scaledDelta));
      },
      // onWheelStart: (state) => doSomethingWith(state),
      // onWheelEnd: (state) => doSomethingWith(state),
      // onHover: (state) => doSomethingWith(state),
      onPointerDown: (state) => {
        const xy = [state.event.x, state.event.y];
        const point = getRelativePoint(xy, camera, zoom);
        // Set origin for selection net
        setOrigin(point);
        setMode(() => "select");
      },
      onPointerMove: (state) => {
        const xy = [state.event.x, state.event.y];
        setMouse(() => getRelativePoint(xy, camera, zoom));
        if (mode === "select") {
          setMode(() => "move");
        }
      },
      onPointerUp: (state) => {
        if (mode === "select") {
          const xy = [state.event.x, state.event.y];
          const position = getRelativePoint(xy, camera, zoom);
          setStickyNotes((boxes) => [...boxes, position]);
        }
        setOrigin(null);
        setMode(() => "none");
      },
    },
    {
      target: ref,
      // pinch: {
      //   pointer: {
      //     // touch: true,
      //   },
      // },
      // eventOptions: { passive: true },
    }
  );

  return (
    <div className={styles.board} ref={ref}>
      <div
        className={styles.layers}
        style={{
          transform: `translate(${camera[0]}px, ${camera[1]}px) scale(${zoom})`,
        }}
      >
        {stickyNotes.map((note, i) => (
          <div
            key={`note${i}`}
            className={clsx(styles.layer, styles.stickyNote)}
            style={{
              transform: `translate(${note[0]}px, ${note[1]}px)`,
            }}
          >
            Sticky note!
          </div>
        ))}

        <div className={clsx(styles.layer, styles.zeroPoint)} />

        {origin && (
          <div
            className={styles.selectionNet}
            style={{
              transform: `translate(${Math.min(
                origin[0],
                mouse[0]
              )}px, ${Math.min(origin[1], mouse[1])}px)`,
              width: Math.abs(origin[0] - mouse[0]),
              height: Math.abs(origin[1] - mouse[1]),
            }}
          />
        )}
      </div>

      <div className={styles.debugInfo}>
        Mouse: {mouse[0]} , {mouse[1]}
        <br />
        Zoom: {Math.round(zoom * 100)}%
        <br />
        Camera: x {camera[0]} , y {camera[1]}
      </div>
    </div>
  );
};
