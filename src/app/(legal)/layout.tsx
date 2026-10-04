import Image from 'next/image';
import Link from 'next/link';
import styles from './legal.module.css';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <div className={styles.page}>
        <header className={styles.header}>
          <Link href="/" aria-label="Back to home">
            <Image src="/wbh-logo.png" alt="Wholesale Beauty Hub" width={100} height={40} style={{ objectFit: 'contain' }} />
          </Link>
          <nav className={styles.nav}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </header>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          &copy; {new Date().getFullYear()} Wholesale Beauty Hub. All rights reserved.
        </footer>
      </div>
    </>
  );
}
