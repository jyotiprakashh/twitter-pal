import { useEffect } from 'react';
import useStore from '../store';

const useAuth = () => {
  const { setUser } = useStore();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUser(token);
    }
  }, [setUser]);

  const fetchUser = async (token) => {
    try {
      const res = await fetch('tweetheats-jd9i0y39.b4a.run/api/user', {
        method: 'GET',
        headers: {
          'Token': `${token}`,
        },
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user); // Save user data in Zustand
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };
};

export default useAuth;
