import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3>GymFlex</h3>
            <p>Your journey to fitness begins here.</p>
          </div>
          
          <div className={styles.column}>
            <h4>Quick Links</h4>
            <Link href="/schedule">Class Schedule</Link>
            <Link href="/trainers">Our Trainers</Link>
            <Link href="/membership">Membership</Link>
          </div>
          
          <div className={styles.column}>
            <h4>Contact</h4>
            <p>House 300, Road 10, Block C, Niketon, Dhaka </p>
            <p>contact@gymflex.com</p>
            <p>+8801921512040</p>
          </div>
          
          <div className={styles.column}>
            <h4>Hours</h4>
            <p>Monday - Friday: 6am - 10pm</p>
            <p>Saturday: 8am - 8pm</p>
            <p>Sunday: 8am - 6pm</p>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; 2024 GymFlex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 