import { useEffect } from 'react';
import Timeline from '../components/timeline';
import Sidebar from '../components/sidebar';
import ReactLoader from '../components/loader';

const Dashboard = ({ user, activeUser }) => {
  useEffect(() => {
    document.title = 'Insta';
  }, []);

  if (!user || !activeUser) {
    return <ReactLoader />;
  }

  return (
    <div className="bg-gray-background dark:bg-black-light">
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        <Timeline user={user} />
        <Sidebar activeUser={activeUser} />
      </div>
    </div>
  );
};

export default Dashboard;
