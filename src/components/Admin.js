'use client';

import { useState, useEffect } from 'react';
import styles from './Admin.module.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('classes');
  const [error, setError] = useState(null);

  const tabs = {
    classes: ClassesManager,
    trainers: TrainersManager,
    trainees: TraineesManager,
  };

  const ActiveComponent = tabs[activeTab];

  return (
    <div className={styles.adminContainer}>
      {error && <div className={styles.error}>{error}</div>}
      <nav className={styles.adminNav}>
        <button
          className={`${styles.tabButton} ${activeTab === 'classes' ? styles.active : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          Manage Classes
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'trainers' ? styles.active : ''}`}
          onClick={() => setActiveTab('trainers')}
        >
          Manage Trainers
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'trainees' ? styles.active : ''}`}
          onClick={() => setActiveTab('trainees')}
        >
          Manage Trainees
        </button>
      </nav>
      <main className={styles.adminContent}>
        <ActiveComponent setError={setError} />
      </main>
    </div>
  );
};

const ClassesManager = ({ setError }) => {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    trainer: '',
    date: '',
    startTime: '',
    description: '',
  });

  useEffect(() => {
    fetchClasses();
    fetchTrainers();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setClasses(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/users?role=trainer');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTrainers(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      fetchClasses();
      setFormData({ name: '', trainer: '', date: '', startTime: '', description: '' });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (classId) => {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      fetchClasses();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Manage Classes</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Class Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <select
          value={formData.trainer}
          onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
          required
        >
          <option value="">Select Trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer._id} value={trainer._id}>
              {trainer.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
        <input
          type="time"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          required
        />
        <textarea
          placeholder="Class Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <button type="submit">Create Class</button>
      </form>

      <div className={styles.classesGrid}>
        {classes.map((classItem) => (
          <div key={classItem._id} className={styles.classCard}>
            <h3>{classItem.name}</h3>
            <p>Trainer: {classItem.trainer.name}</p>
            <p>Date: {new Date(classItem.date).toLocaleDateString()}</p>
            <p>Time: {classItem.startTime}</p>
            <p>Enrolled: {classItem.currentEnrollment}/{classItem.maxCapacity}</p>
            <button onClick={() => handleDelete(classItem._id)}>Delete Class</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrainersManager = ({ setError }) => {
  const [trainers, setTrainers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/users?role=trainer');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTrainers(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'trainer' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      fetchTrainers();
      setFormData({ name: '', email: '', password: '', specialization: '' });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (trainerId) => {
    try {
      await fetch(`/api/users/${trainerId}`, { method: 'DELETE' });
      fetchTrainers();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mt-20">
      <h2>Manage Trainers</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          required
        />
        <button type="submit">Add Trainer</button>
      </form>

      <div className={styles.trainersGrid}>
        {trainers.map((trainer) => (
          <div key={trainer._id} className={styles.trainerCard}>
            <h3>{trainer.name}</h3>
            <p>Email: {trainer.email}</p>
            <p>Specialization: {trainer.specialization}</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => handleDelete(trainer._id)}>Delete Trainer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TraineesManager = ({ setError }) => {
  const [trainees, setTrainees] = useState([]);

  useEffect(() => {
    fetchTrainees();
  }, []);

  const fetchTrainees = async () => {
    try {
      const response = await fetch('/api/users?role=trainee');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setTrainees(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateMembershipStatus = async (traineeId, status) => {
    try {
      const response = await fetch(`/api/users/${traineeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipStatus: status }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      fetchTrainees();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (traineeId) => {
    try {
      await fetch(`/api/users/${traineeId}`, { method: 'DELETE' });
      fetchTrainees();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Manage Trainees</h2>
      <div className={styles.traineesGrid}>
        {trainees.map((trainee) => (
          <div key={trainee._id} className={styles.traineeCard}>
            <h3>{trainee.name}</h3>
            <p>Email: {trainee.email}</p>
            <p>Status: {trainee.membershipStatus}</p>
            <select className="bg-gray-200 p-2 rounded-md"
              value={trainee.membershipStatus}
              onChange={(e) => updateMembershipStatus(trainee._id, e.target.value)}
            >
              <option value="trainee"> {`Trainee ` } </option>
              <option value="trainer"> {`Trainer ` } </option>
         
            </select>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md m-2" onClick={() => handleDelete(trainee._id)}>Delete Trainee</button> 
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default Admin;
