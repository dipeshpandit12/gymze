"use client";

import { useState, FormEvent , useEffect} from 'react';
import { toast, ToastContainer } from 'react-toastify';

interface ProfileData {
  fitnessGoal: string;
  age: string;
  gender: string;
  fitnessLevel: string;
  height: string;
  weight: string;
  medicalConditions: string;
}

interface Errors {
  [key: string]: string;
}

const defaultValues: ProfileData = {
  fitnessGoal: '',
  age: '',
  gender: '',
  fitnessLevel: '',
  height: '',
  weight: '',
  medicalConditions: ''
};

export default function EditProfile() {
  const [formData, setFormData] = useState<ProfileData>(defaultValues);
  const [errors, setErrors] = useState<Errors>({});


  useEffect(() => {
    fetchProfile();
  },[]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/editProfile');
      const data = await response.json();

      if (response.ok) {
        setFormData(data);
      } else {
        toast.error(data.message || 'Failed to fetch profile', {
          position: 'top-right',
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to fetch profile', {
        position: 'top-right',
        autoClose: 3000
      });
    }

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.fitnessGoal) newErrors.fitnessGoal = 'Fitness goal is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.fitnessLevel) newErrors.fitnessLevel = 'Fitness level is required';
    if (!formData.height) newErrors.height = 'Height is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await fetch('/api/editProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fitnessGoal: formData.fitnessGoal,
          age: formData.age,
          gender: formData.gender,
          fitnessLevel: formData.fitnessLevel,
          height: formData.height,
          weight: formData.weight,
          medicalConditions: formData.medicalConditions || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      console.log('Profile updated:', data);
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile', {
        position: 'top-right',
        autoClose: 3000
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="container mx-auto px-4 flex flex-col justify-center items-center h-full max-w-2xl">
        <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm text-gray-300">Fitness Goal</label>
            <select
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={(e) => {
                handleChange(e);
              }}
              className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                       text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a goal</option>
              <option value="weightLoss">Weight Loss</option>
              <option value="muscleGain">Muscle Gain</option>
              <option value="endurance">Endurance</option>
              <option value="custom">Custom Goal</option>
            </select>
            {errors.fitnessGoal && (
              <div className="text-red-500 text-sm">{errors.fitnessGoal}</div>
            )}
          </div>


          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                         text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              {errors.age && (
                <div className="text-red-500 text-sm">{errors.age}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                         text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <div className="text-red-500 text-sm">{errors.gender}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-300">Fitness Level</label>
            <select
              name="fitnessLevel"
              value={formData.fitnessLevel}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                       text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select fitness level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.fitnessLevel && (
              <div className="text-red-500 text-sm">{errors.fitnessLevel}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                         text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              {errors.height && (
                <div className="text-red-500 text-sm">{errors.height}</div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-300">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                         text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              {errors.weight && (
                <div className="text-red-500 text-sm">{errors.weight}</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-gray-300">Medical Conditions</label>
            <textarea
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                       text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              rows={4}
              placeholder="List any medical conditions or injuries..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold 
                     py-3 px-6 rounded-lg transition duration-200"
          >
            Update Profile
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}