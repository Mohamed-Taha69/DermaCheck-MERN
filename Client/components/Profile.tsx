import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Edit2, X, Check, User as UserIcon, Phone, Calendar as CalendarIcon, Users, Shield } from 'lucide-react';
import { DiseaseType, Gender, SkinType, UserRole } from '../types';
import { getUserProfile, updateUserProfile } from '../services/apiService';

interface ProfileProps {
  view: 'PROFILE' | 'HISTORY';
}

// Helper function to get user initials
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const Profile: React.FC<ProfileProps> = ({ view }) => {
  const { user, history, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    age: user?.age || null,
    gender: user?.gender || null,
    skin_type: user?.skin_type || null,
    phone: user?.phone || null,
    role: user?.role || null,
  });

  // Update profileData when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        age: user.age || null,
        gender: user.gender || null,
        skin_type: user.skin_type || null,
        phone: user.phone || null,
        role: user.role || null,
      });
    }
  }, [user]);

  const getDiagnosisBadge = (diagnosis: DiseaseType) => {
    switch (diagnosis) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Chickenpox': return 'bg-yellow-100 text-yellow-800';
      case 'Measles': return 'bg-orange-100 text-orange-800';
      case 'Monkeypox': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      await updateUserProfile(user.id, {
        full_name: profileData.name,
        age: profileData.age,
        gender: profileData.gender,
        skin_type: profileData.skin_type,
        phone: profileData.phone,
        role: profileData.role,
      });

      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }

      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        name: user.name || '',
        age: user.age || null,
        gender: user.gender || null,
        skin_type: user.skin_type || null,
        phone: user.phone || null,
        role: user.role || null,
      });
    }
    setIsEditing(false);
    setError(null);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Header */}
      {view === 'PROFILE' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-teal-600 h-24"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-end flex-1">
                {/* Initials Avatar */}
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg flex-shrink-0">
                  <div className="w-full h-full bg-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {getInitials(profileData.name)}
                    </span>
                  </div>
                </div>
                
                <div className="ml-4 mb-1 flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="text-2xl font-bold text-slate-800 bg-transparent border-b-2 border-teal-500 focus:outline-none focus:border-teal-600 w-full"
                      placeholder="Full Name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-slate-800">{profileData.name || 'User'}</h1>
                  )}
                  <p className="text-slate-500 mt-1">{user.email}</p>
                </div>
              </div>

              {/* Edit/Save/Cancel Buttons */}
              <div className="flex items-center gap-2 mb-1">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Save changes"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                    title="Edit profile"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Age */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center mb-2">
                  <CalendarIcon className="w-4 h-4 text-slate-500 mr-2" />
                  <label className="text-xs font-semibold text-slate-500 uppercase">Age</label>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    value={profileData.age || ''}
                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-800"
                    placeholder="Enter age"
                    min="1"
                    max="120"
                  />
                ) : (
                  <p className="text-lg font-semibold text-slate-800">
                    {profileData.age ? `${profileData.age} years` : 'Not specified'}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center mb-2">
                  <Users className="w-4 h-4 text-slate-500 mr-2" />
                  <label className="text-xs font-semibold text-slate-500 uppercase">Gender</label>
                </div>
                {isEditing ? (
                  <select
                    value={profileData.gender || ''}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value as Gender | null })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-800"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  <p className="text-lg font-semibold text-slate-800">
                    {profileData.gender || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Skin Type */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 text-slate-500 mr-2" />
                  <label className="text-xs font-semibold text-slate-500 uppercase">Skin Type</label>
                </div>
                {isEditing ? (
                  <select
                    value={profileData.skin_type || ''}
                    onChange={(e) => setProfileData({ ...profileData, skin_type: e.target.value as SkinType | null })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-800"
                  >
                    <option value="">Select skin type</option>
                    <option value="Type I">Type I - Very fair, always burns</option>
                    <option value="Type II">Type II - Fair, usually burns</option>
                    <option value="Type III">Type III - Medium, sometimes burns</option>
                    <option value="Type IV">Type IV - Olive, rarely burns</option>
                    <option value="Type V">Type V - Brown, very rarely burns</option>
                    <option value="Type VI">Type VI - Dark brown, never burns</option>
                  </select>
                ) : (
                  <p className="text-lg font-semibold text-slate-800">
                    {profileData.skin_type ? (
                      <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                        {profileData.skin_type}
                      </span>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center mb-2">
                  <Phone className="w-4 h-4 text-slate-500 mr-2" />
                  <label className="text-xs font-semibold text-slate-500 uppercase">Phone</label>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone || ''}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-800"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-lg font-semibold text-slate-800">
                    {profileData.phone || 'Not specified'}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 md:col-span-2">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 text-slate-500 mr-2" />
                  <label className="text-xs font-semibold text-slate-500 uppercase">Role</label>
                </div>
                {isEditing ? (
                  <select
                    value={profileData.role || ''}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value as UserRole | null })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-800 bg-slate-100"
                    disabled
                  >
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                  </select>
                ) : (
                  <p className="text-lg font-semibold text-slate-800">
                    {profileData.role ? (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {profileData.role}
                      </span>
                    ) : (
                      'Patient'
                    )}
                  </p>
                )}
                {isEditing && (
                  <p className="text-xs text-slate-500 mt-1">Role cannot be changed</p>
                )}
              </div>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-3xl font-bold text-teal-600">{history.length}</div>
                <div className="text-sm text-slate-500 font-medium">Total Scans</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-3xl font-bold text-teal-600">
                  {history.filter(h => h.result.diagnosis !== 'Normal').length}
                </div>
                <div className="text-sm text-slate-500 font-medium">Disease Detections</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {history.filter(h => h.result.diagnosis === 'Monkeypox').length}
                </div>
                <div className="text-sm text-slate-500 font-medium">Monkeypox Cases</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-teal-600" />
          {view === 'PROFILE' ? 'Recent History' : 'Assessment History'}
        </h2>

        {history.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-slate-200">
            <div className="text-slate-400 text-lg">No history available yet.</div>
            <p className="text-slate-400 text-sm mt-1">Start by analyzing your first skin image.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-48 md:h-auto bg-slate-100 flex-shrink-0 relative">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt="Scan thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 left-2 md:hidden">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${getDiagnosisBadge(item.result.diagnosis)}`}>
                      {item.result.diagnosis}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 mt-1">{item.result.diagnosis}</h3>
                    </div>
                    <span className={`hidden md:inline-block px-3 py-1 rounded-full text-sm font-bold ${getDiagnosisBadge(item.result.diagnosis)}`}>
                      {item.result.diagnosis}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                    {item.result.assessment}
                  </p>
                  
                  <div className="mt-auto">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Top Recommendation</p>
                    <p className="text-sm text-teal-700 font-medium">
                      {item.result.recommendations[0]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
