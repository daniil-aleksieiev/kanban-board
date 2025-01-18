import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
};

const Section: React.FC<SectionProps> = ({ children, id, className }) => (
  <section id={id} className={classNames(styles.section, className)}>
    {children}
  </section>
);

export default Section;
