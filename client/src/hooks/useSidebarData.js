import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUpcomingSessions } from '../store/slices/sessionSlice';

export const useSidebarData = () => {
  const upcomingSessions = useSelector(selectUpcomingSessions);
  const [notifications, setNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    // Mock data - in a real app, this would fetch from API
    const fetchNotifications = async () => {
      // Simulate API call
      setTimeout(() => {
        setNotifications(Math.floor(Math.random() * 5));
        setUnreadMessages(Math.floor(Math.random() * 3));
      }, 1000);
    };

    fetchNotifications();
  }, []);

  return {
    upcomingSessionsCount: upcomingSessions?.length || 0,
    notificationsCount: notifications,
    unreadMessagesCount: unreadMessages,
    totalNotifications: notifications + unreadMessages
  };
};

export default useSidebarData;
