'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';

export default function Schedule() {
  const [classes, setClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem('user');
  useEffect(() => {
    fetchClasses();
  }, [selectedDate]);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      setClasses(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const filteredClasses = classes.filter(classItem => {
    const classDate = new Date(classItem.date);
    return classDate.toDateString() === selectedDate.toDateString();
  });

  const handleBookClass = async (classId) => {
    axios.post('/api/book', {
      classId: classId,
      userId: JSON.parse(user).id
    }).then(res => {
      if (res.data.success) {
        alert('Class booked successfully');
      } else {
        alert(res.data.message);
      }
    });
  };

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Class Schedule
          </h1>

          <div className="flex justify-center items-center gap-4 mb-8">
            <button
              onClick={() => handleDateChange(-1)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Previous Day
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {formatDate(selectedDate)}
            </h2>
            <button
              onClick={() => handleDateChange(1)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Next Day
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => (
                <div
                  key={classItem._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {classItem.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{classItem.description}</p>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Time:</span> {classItem.startTime}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Trainer:</span>{' '}
                        {classItem.trainer.name}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Booked:</span>{' '}
                        {classItem.currentEnrollment}/{classItem.maxCapacity} spots
                      </p>
                    </div>
                    <button 
                      onClick={() => handleBookClass(classItem._id)}
                      className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium
                        ${
                          classItem.currentEnrollment >= classItem.maxCapacity
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      disabled={classItem.currentEnrollment >= classItem.maxCapacity}
                    >
                      {classItem.currentEnrollment >= classItem.maxCapacity
                        ? 'Class Full'
                        : 'Book Class'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No classes scheduled for this date.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 