import { useEffect } from 'react';
import Timeline from '../components/timeline';
import Sidebar from '../components/sidebar';

const Dashboard = () => {
  useEffect(() => {
    document.title = 'Insta';
  }, []);

  return (
    <div className="bg-gray-background">
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <Timeline />
        <Sidebar />
      </div>
    </div>
  );
};

export default Dashboard;
