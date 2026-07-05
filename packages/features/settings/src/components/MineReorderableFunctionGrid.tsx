import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
  type PanGestureHandlerGestureEvent,
  type PanGestureHandlerStateChangeEvent,
  type TapGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import type {MineFunctionItem} from '../models/mineFunctionItem';
import {mineLayout, mineTheme} from '../theme/mineTheme';
import {MineFunctionCard} from './MineFunctionCard';

const LONG_PRESS_DELAY_MS = 250;

interface Props {
  items: MineFunctionItem[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onItemTap: (item: MineFunctionItem) => void;
  onDragActiveChange?: (active: boolean) => void;
}

interface CellProps {
  index: number;
  item: MineFunctionItem;
  cellSize: {width: number; height: number};
  isEvenColumn: boolean;
  highlighted: boolean;
  isPlaceholder: boolean;
  onTap: () => void;
  onDragStart: (index: number, cellRef: View | null) => void;
  onDragMove: (moveX: number, moveY: number, dx: number, dy: number) => void;
  onDragEnd: (moveX: number, moveY: number) => void;
}

function DraggableMineFunctionCell({
  index,
  item,
  cellSize,
  isEvenColumn,
  highlighted,
  isPlaceholder,
  onTap,
  onDragStart,
  onDragMove,
  onDragEnd,
}: CellProps) {
  const cellRef = useRef<View>(null);
  const panRef = useRef<PanGestureHandler>(null);
  const draggingRef = useRef(false);

  const handlePanGestureEvent = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      if (event.nativeEvent.state !== State.ACTIVE) {
        return;
      }
      const {absoluteX, absoluteY, translationX, translationY} =
        event.nativeEvent;
      onDragMove(absoluteX, absoluteY, translationX, translationY);
    },
    [onDragMove],
  );

  const handlePanStateChange = useCallback(
    (event: PanGestureHandlerStateChangeEvent) => {
      const {state, absoluteX, absoluteY} = event.nativeEvent;

      if (state === State.ACTIVE) {
        draggingRef.current = true;
        onDragStart(index, cellRef.current);
        return;
      }

      if (
        state === State.END ||
        state === State.CANCELLED ||
        state === State.FAILED
      ) {
        if (draggingRef.current) {
          draggingRef.current = false;
          onDragEnd(absoluteX, absoluteY);
        }
      }
    },
    [index, onDragEnd, onDragStart],
  );

  const handleTapStateChange = useCallback(
    (event: TapGestureHandlerStateChangeEvent) => {
      if (event.nativeEvent.state === State.END && !draggingRef.current) {
        onTap();
      }
    },
    [onTap],
  );

  const cellStyle = [
    styles.cell,
    {
      width: cellSize.width,
      height: cellSize.height,
      marginRight: isEvenColumn ? mineLayout.gridCrossAxisSpacing : 0,
      marginBottom: mineLayout.gridMainAxisSpacing,
    },
    highlighted ? styles.cellHighlighted : null,
    isPlaceholder ? styles.placeholderCell : null,
  ];

  if (isPlaceholder) {
    return (
      <View ref={cellRef} collapsable={false} style={cellStyle}>
        <MineFunctionCard item={item} onPress={() => {}} interactive={false} />
      </View>
    );
  }

  return (
    <TapGestureHandler
      waitFor={panRef}
      onHandlerStateChange={handleTapStateChange}>
      <PanGestureHandler
        ref={panRef}
        activateAfterLongPress={LONG_PRESS_DELAY_MS}
        onGestureEvent={handlePanGestureEvent}
        onHandlerStateChange={handlePanStateChange}>
        <View ref={cellRef} collapsable={false} style={cellStyle}>
          <MineFunctionCard item={item} onPress={() => {}} interactive={false} />
        </View>
      </PanGestureHandler>
    </TapGestureHandler>
  );
}

export function MineReorderableFunctionGrid({
  items,
  onReorder,
  onItemTap,
  onDragActiveChange,
}: Props) {
  const {width} = useWindowDimensions();
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [floatOffset, setFloatOffset] = useState({left: 0, top: 0});
  const pan = useRef(new Animated.ValueXY()).current;
  const dragIndexRef = useRef<number | null>(null);
  const gridRef = useRef<View>(null);
  const gridOriginRef = useRef({x: 0, y: 0});

  const cellSize = useMemo(() => {
    const cellWidth =
      (width -
        mineLayout.horizontalPadding * 2 -
        mineLayout.gridCrossAxisSpacing) /
      2;
    return {
      width: cellWidth,
      height: cellWidth / mineLayout.gridChildAspectRatio,
    };
  }, [width]);

  const measureGridOrigin = useCallback(() => {
    gridRef.current?.measureInWindow((x, y) => {
      gridOriginRef.current = {x, y};
    });
  }, []);

  const indexFromPoint = useCallback(
    (pageX: number, pageY: number) => {
      const localX =
        pageX - gridOriginRef.current.x - mineLayout.horizontalPadding;
      const localY = pageY - gridOriginRef.current.y;
      if (localX < 0 || localY < 0) {
        return null;
      }
      const col = Math.floor(
        localX / (cellSize.width + mineLayout.gridCrossAxisSpacing),
      );
      const row = Math.floor(
        localY / (cellSize.height + mineLayout.gridMainAxisSpacing),
      );
      if (col < 0 || col > 1 || row < 0) {
        return null;
      }
      const index = row * 2 + col;
      return index >= items.length ? null : index;
    },
    [cellSize.height, cellSize.width, items.length],
  );

  const finishDrag = useCallback(
    (pageX: number, pageY: number) => {
      const from = dragIndexRef.current;
      measureGridOrigin();
      const to = indexFromPoint(pageX, pageY);
      pan.setValue({x: 0, y: 0});
      dragIndexRef.current = null;
      setDraggingIndex(null);
      setHoverIndex(null);
      onDragActiveChange?.(false);
      if (from != null && to != null && from !== to) {
        onReorder(from, to);
      }
    },
    [indexFromPoint, measureGridOrigin, onDragActiveChange, onReorder, pan],
  );

  const handleDragStart = useCallback(
    (index: number, cellRef: View | null) => {
      measureGridOrigin();
      cellRef?.measureInWindow((cellX, cellY) => {
        gridRef.current?.measureInWindow((gridX, gridY) => {
          gridOriginRef.current = {x: gridX, y: gridY};
          setFloatOffset({left: cellX - gridX, top: cellY - gridY});
        });
      });
      dragIndexRef.current = index;
      setDraggingIndex(index);
      setHoverIndex(null);
      pan.setValue({x: 0, y: 0});
      onDragActiveChange?.(true);
    },
    [measureGridOrigin, onDragActiveChange, pan],
  );

  const handleDragMove = useCallback(
    (moveX: number, moveY: number, dx: number, dy: number) => {
      pan.setValue({x: dx, y: dy});
      measureGridOrigin();
      setHoverIndex(indexFromPoint(moveX, moveY));
    },
    [indexFromPoint, measureGridOrigin, pan],
  );

  const handleDragEnd = useCallback(
    (moveX: number, moveY: number) => {
      finishDrag(moveX, moveY);
    },
    [finishDrag],
  );

  const draggingItem =
    draggingIndex != null ? items[draggingIndex] ?? null : null;

  return (
    <View
      ref={gridRef}
      collapsable={false}
      style={styles.grid}
      onLayout={measureGridOrigin}>
      {items.map((item, index) => (
        <DraggableMineFunctionCell
          key={item.id}
          index={index}
          item={item}
          cellSize={cellSize}
          isEvenColumn={index % 2 === 0}
          highlighted={hoverIndex === index && draggingIndex !== index}
          isPlaceholder={draggingIndex === index}
          onTap={() => onItemTap(item)}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
      ))}

      {draggingItem && draggingIndex != null ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.floatingCell,
            {
              width: cellSize.width,
              height: cellSize.height,
              left: floatOffset.left,
              top: floatOffset.top,
              transform: [
                {translateX: pan.x},
                {translateY: pan.y},
                {scale: 0.94},
              ],
              opacity: 0.92,
            },
          ]}>
          <MineFunctionCard
            item={draggingItem}
            onPress={() => {}}
            interactive={false}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: mineLayout.horizontalPadding,
    position: 'relative',
  },
  cell: {
    borderRadius: mineLayout.functionCardRadius,
    overflow: 'hidden',
  },
  placeholderCell: {
    opacity: 0.35,
  },
  cellHighlighted: {
    borderWidth: 1.5,
    borderColor: mineTheme.dragHighlightBlue,
  },
  floatingCell: {
    position: 'absolute',
    zIndex: 20,
    borderRadius: mineLayout.functionCardRadius,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
});
