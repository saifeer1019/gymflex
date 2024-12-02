'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import axios from 'axios';
import CreateClassForm from './CreateClassForm';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateClassForm, setShowCreateClassForm] = useState(false);
 
  const router = useRouter();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    router.push('/logout');
  };

  const handleApply = () => {
    if (user) {
      axios.post('/api/apply', {  
        id: user.id,
      }).then(res => {
        console.log(res.data.message);
      });
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            Gym Flex
          </Link>

          <button 
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={styles.menuIcon}></span>
          </button>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
            <Link href="/schedule" className={styles.navLink}>
              Class Schedule
            </Link>
            <Link href="/trainers" className={styles.navLink}>
              Our Trainers
            </Link>
            {!user && <Link href="/membership" className={styles.navLink}>
              Membership
            </Link>}

            {user && user.role === 'trainee' && (
              <p onClick={handleApply} className={styles.navLink}>
                Apply to be a trainer
              </p>
            )}

            {user && user.role === 'trainer' && (
              <button
                onClick={() => setShowCreateClassForm(true)}
                className={styles.navLink}
              >
                Create Class
              </button>
            )}

            {!user && (
              <Link href="/login" className={styles.loginButton}>
                Login
              </Link>
            )}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={styles.userButton}
                >
                  {user.name}
                </button>
                {showDropdown && (
                  <div className={styles.dropdown}>
                    {user.role === 'admin' && (
                      <Link href="/admin" className={styles.dropdownItem}>
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === 'trainer' && (
                      <Link href="/trainer-dashboard" className={styles.dropdownItem}>
                        Trainer Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className={styles.dropdownItem}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </header>

      {showCreateClassForm && (
        <CreateClassForm onClose={() => setShowCreateClassForm(false)} />
      )}
    </>
  );
};

export default Header; 