import { useMemo } from 'react';

import type { TData } from '@/sections/Table/Table';

import TaskCard from '../TaskCard/TaskCard';

import styles from './styles.module.scss';

type TColumnData = {
  data: TData[];
  title: string;
  value: string;
  statusChange: (value: string) => Promise<void>;
  dragStart: (task: TData) => Promise<void>;
  dragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  dragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  removeTask: (id: string) => void;
  editTask: (id: string) => void;
};

const TableColumn = ({
  data,
  title,
  value,
  statusChange,
  dragStart,
  dragOver,
  dragEnd,
  onDragEnter,
  removeTask,
  editTask,
}: TColumnData) => {
  const taskCards = useMemo(
    () =>
      data.map((item) => (
        <TaskCard data={item} key={item.id} dragStart={dragStart} removeTask={removeTask} editTask={editTask} />
      )),
    [data, dragStart, removeTask, editTask],
  );

  const dragHandlers = {
    onDragEnter,
    onDragOver: dragOver,
    onDrop: () => statusChange(value),
    onDragEnd: dragEnd,
  };

  return (
    <div className={styles.column} {...dragHandlers}>
      <h3 className={styles.title}>{title}</h3>

      {taskCards}
    </div>
  );
};

export default TableColumn;
