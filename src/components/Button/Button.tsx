import classNames from 'classnames';

import styles from './styles.module.scss';

type TButton = {
  title: string;
  onClick: () => void;
  className?: string;
};

const Button: React.FC<TButton> = ({ title, onClick, className }) => (
  <button onClick={onClick} className={classNames(styles.button, className)}>
    {title}
  </button>
);

export default Button;
