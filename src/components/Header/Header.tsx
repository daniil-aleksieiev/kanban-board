import Container from '../Container/Container';

import styles from './styles.module.scss';

const Header = () => (
  <header className={styles.header}>
    <Container>Kanban board with drag-n-drop</Container>
  </header>
);

export default Header;
