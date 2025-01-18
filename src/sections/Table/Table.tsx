'use client';
import React, { useState, Fragment, useEffect, Suspense, useMemo, useCallback } from 'react';
import Modal from 'react-modal';
import moment from 'moment';

import { Button, Container, Section, TableColumn } from '@/components';

import styles from './styles.module.scss';

export type TData = {
  id: string;
  priority: string;
  label: string;
  description: string;
  status: string;
  created_at: string;
  blocked_reason?: string | undefined;
};

const customStyles = {
  overlay: {
    background: 'rgba(255, 255, 255, 0.4)',
  },
  content: {
    border: 'none',
    borderRadius: '8px',
    background: '#454545',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('body');

const sorting = (arr: TData[], status: string, sort = true) => {
  if (!Array.isArray(arr)) {
    throw new Error('Input arr is not an array');
  }

  const filteredArr = arr.filter((item: any) => item.status === status);

  if (sort) {
    return filteredArr.sort((a, b) => (a.priority > b.priority ? -1 : 1));
  }

  return filteredArr;
};

const columns = [
  { title: 'Planned', value: 'planned' },
  { title: 'In Progress', value: 'in-progress' },
  { title: 'Blocked', value: 'blocked' },
  { title: 'Done', value: 'done' },
];

const Table: React.FC = () => {
  const [draggedTask, setDraggedTask] = useState<TData | null>(null);
  const [list, setList] = useState<TData[] | []>([]);
  const [taskToEdit, setTaskToEdit] = useState<TData | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  // Modal Actions
  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setTaskToEdit(null);
  };

  // Helpers
  const updateList = (newList: TData[]) => {
    setList(newList);
    updateData(newList);
  };

  const sortedTasks = useMemo(
    () => ({
      planned: sorting(list, 'planned'),
      'in-progress': sorting(list, 'in-progress'),
      blocked: sorting(list, 'blocked'),
      done: sorting(list, 'done', false),
    }),
    [list],
  );

  // Task Actions
  const removeTask = useCallback(
    (id: string) => {
      if (window.confirm('Are you sure?')) updateList(list.filter((item) => item.id !== id));
    },
    [list],
  );

  const editTask = (id: string) => {
    const task = list?.find((item) => item.id === id);

    if (task) {
      setTaskToEdit(task);
      openModal();
    } else {
      alert('Error! Please try again!');
    }
  };

  const submitTask = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const label = formData.get('label') as string;
      const description = formData.get('description') as string;
      const priority = formData.get('priority') as string;

      if (taskToEdit?.id) {
        const updatedTask: TData = {
          ...taskToEdit,
          label,
          description,
          priority,
        };

        updateList([...list.filter((item) => item.id !== taskToEdit.id), updatedTask]);
      } else {
        const newId = String(Math.max(0, ...list.map((item) => +item.id)) + 1);

        const newTask: TData = {
          id: newId,
          label,
          description,
          priority,
          status: 'planned',
          created_at: moment(new Date()).format('MM/DD/YYYY'),
        };

        updateList([...list, newTask]);
      }

      closeModal();
    },
    [list, taskToEdit],
  );

  // Drag-n-drop Actions
  const taskStatusChange = async (value: string) => {
    if (draggedTask?.status === value) return;

    if (draggedTask && value === 'blocked' && !draggedTask.blocked_reason) {
      let reason = prompt('Please enter the reason:') ?? '';

      if (!reason) {
        alert('Blocking requires a reason.');
        return;
      }

      draggedTask.blocked_reason = reason;
    } else if (draggedTask) {
      draggedTask.blocked_reason = '';
    }

    if (draggedTask) {
      const updatedList = (status: string) => {
        const prev = list.filter((item) => item.id !== draggedTask.id);

        return [
          ...prev,
          {
            ...draggedTask,
            status,
          },
        ];
      };

      setList(updatedList(value.toLowerCase()));

      updateData(updatedList(value.toLowerCase()));
    }
  };

  const handleDragStart = async (task: TData) => setDraggedTask(task);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedTask(null);
  };

  // API functions
  const fetchData = async () => {
    try {
      const response = await fetch('/api/todo');

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      setList(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getToken = async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      localStorage.setItem('token', result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateData = async (updatedList: TData[]) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/todo', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedList),
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      console.error('Error while updating data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    getToken();
  }, []);

  return (
    <Fragment>
      <Container className={styles['container-flex']}>
        <Button title="Add New" onClick={openModal} />
      </Container>

      <Section className={styles.table}>
        {columns.map(({ title, value }) => (
          <Suspense key={value}>
            <TableColumn
              data={sortedTasks[value as keyof typeof sortedTasks]}
              title={title}
              value={value}
              statusChange={taskStatusChange}
              dragStart={handleDragStart}
              dragOver={handleDragOver}
              dragEnd={handleDragEnd}
              onDragEnter={handleDragEnter}
              removeTask={removeTask}
              editTask={editTask}
            />
          </Suspense>
        ))}
      </Section>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles}>
        <div className={styles['modal-inner']}>
          <div className={styles['close-btn']} onClick={closeModal} />

          <form className={styles['modal-form']} onSubmit={submitTask}>
            <input type="text" defaultValue={taskToEdit?.label || ''} name="label" placeholder="Title" required />

            <select defaultValue={taskToEdit?.priority || ''} name="priority" required>
              <option hidden value="">
                Choose Priority
              </option>
              <option value="4">High Priority</option>
              <option value="3">Mid Priority</option>
              <option value="2">Low Priority</option>
              <option value="1">No Priority</option>
            </select>

            <textarea
              defaultValue={taskToEdit?.description || ''}
              name="description"
              placeholder="Description"
              required
            />

            <button>Save</button>
          </form>
        </div>
      </Modal>
    </Fragment>
  );
};

export default Table;
