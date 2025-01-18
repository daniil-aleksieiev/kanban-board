'use client';
import { useMemo } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import type { TData } from '@/sections/Table/Table';

import styles from './styles.module.scss';

type TTaskCard = {
  data: TData;
  dragStart: (task: TData) => Promise<void>;
  removeTask: (id: string) => void;
  editTask: (id: string) => void;
};

const TaskCard = ({ data, dragStart, removeTask, editTask }: TTaskCard) => {
  const priorityIcon = useMemo(() => {
    switch (data.priority) {
      case '4':
        return 'high-priority';
      case '3':
        return 'mid-priority';
      case '2':
        return 'low-priority';
      case '1':
      default:
        return 'no-priority';
    }
  }, [data.priority]);

  const formattedDate = useMemo(() => moment(data.created_at).format('MMMM Do YYYY'), [data.created_at]);

  const handleAction = (action: 'edit' | 'remove') => {
    if (action === 'edit') {
      editTask(data.id);
    } else if (action === 'remove') {
      removeTask(data.id);
    }
  };

  return (
    <div className={styles.card} draggable onDragStart={() => dragStart(data)}>
      <header>
        <h4 className={styles.title}>{data.label}</h4>
        <span className={classNames(styles['priority-icon'], styles[priorityIcon])} title="Priority" />
      </header>

      <p className={styles.description}>{data.description}</p>

      {data.blocked_reason && <div className={styles['blocked-reason']}>Blocked reason: {data.blocked_reason}</div>}

      <footer>
        <span className={styles['created-at']}>
          Created at: <b>{formattedDate}</b>
        </span>
        <div className={styles['action-buttons']}>
          <div className={styles['edit-icon']} title="Edit" onClick={() => handleAction('edit')} />
          <div className={styles['trash-icon']} title="Remove" onClick={() => handleAction('remove')} />
        </div>
      </footer>
    </div>
  );
};

export default TaskCard;
