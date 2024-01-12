import styles from './auth-header.module.css';

export default function AuthHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Time tracker</span>
      </div>
    </header>
  );
}
