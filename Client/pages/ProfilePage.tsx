import React from 'react';
import Profile from '../components/Profile';

const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Profile view="PROFILE" />
    </div>
  );
};

export default ProfilePage;


