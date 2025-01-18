import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './container.module.scss';

type HeaderProps = {
  children: ReactNode;
  className?: string;
};

const Container: React.FC<HeaderProps> = ({ children, className }) => (
  <div className={classNames(styles.container, className)}>{children}</div>
);

export default Container;
