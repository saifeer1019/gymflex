'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const user = localStorage.getItem('user');
  console.log(user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);
  return (
    <>
      <Header isLoggedIn={isLoggedIn} user={user} />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Transform Your Life Through Fitness</h1>
            <p>Join our community and achieve your fitness goals with expert trainers and world-class facilities.</p>
           
         { !user && (
            <Link href="/membership" className={styles.ctaButton}>
              Start Your Journey
            </Link>
          )}

          {user && user.role === 'trainee' && (
            <Link href="/schedule" className={styles.ctaButton}>
              Book a class
            </Link>
           )}

        
          </div>
        </section>

        <section className={styles.features}>
          <h2>Why Choose Us</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>Expert Trainers</h3>
              <p>Work with certified professionals who are dedicated to your success.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Flexible Schedule</h3>
              <p>Choose from multiple class times that fit your busy lifestyle.</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Modern Facilities</h3>
              <p>Train with state-of-the-art equipment in a clean, motivating environment.</p>
            </div>
          </div>
        </section>

      
      </main>
      <Footer />
    </>
  );
}
