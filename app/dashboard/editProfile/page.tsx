"use client";

import { Formik, Form, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

interface ProfileData {
    fitnessGoal: string;
    customGoal: string;
    age: number;
    gender: string;
    fitnessLevel: string;
    height: number;
    weight: number;
    medicalConditions: string;
  }

  const validationSchema = Yup.object({
    fitnessGoal: Yup.string().required('Fitness goal is required'),
    customGoal: Yup.string().required('Custom goal is required'),
    age: Yup.number()
      .required('Age is required')
      .positive()
      .integer(),
    gender: Yup.string().required('Gender is required'),
    fitnessLevel: Yup.string(),
    height: Yup.number()
      .required('Height is required')
      .positive(),
    weight: Yup.number()
      .required('Weight is required')
      .positive(),
    medicalConditions: Yup.string().nullable()
  });

  const defaultValues: ProfileData = {
    fitnessGoal: '',
    customGoal: '',
    age: 0,
    gender: '',
    fitnessLevel: '',
    height: 0,
    weight: 0,
    medicalConditions: ''
};

export default function EditProfile() {
  const [initialValues, setInitialValues] = useState<ProfileData>(defaultValues);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/editProfile');
        const data = await res.json();
        setInitialValues(data || defaultValues);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-64px)] bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  const handleSubmit = async (values: ProfileData, { setSubmitting }: FormikHelpers<ProfileData>) => {
    console.log('HandleSubmit called with values:', values); // Debug log
    const loadingToast = toast.loading("Saving changes...");

    try {
      console.log('Sending request to API...'); // Debug log
      const res = await fetch('/api/editProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      const data = await res.json();
      console.log('API Response:', data); // Debug log

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save');
      }

      toast.update(loadingToast, {
        render: "Profile updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast.update(loadingToast, {
        render: error instanceof Error ? error.message : "Failed to update profile",
        type: "error",
        isLoading: false,
        autoClose: 2000
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-[#0A0A0A] text-white overflow-auto py-8">
      <ToastContainer position="top-right" theme="dark" />
      <div className="container mx-auto px-4 max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, isSubmitting }) => (
            <Form className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm text-gray-300">Fitness Goal</label>
                  <Field
                    as="select"
                    name="fitnessGoal"
                    className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                             text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                             transition-colors"
                  >
                    <option value="">Select a goal</option>
                    <option value="gain">Gain Muscle</option>
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain</option>
                    <option value="other">Other</option>
                  </Field>
                  {errors.fitnessGoal && touched.fitnessGoal && (
                    <div className="text-red-500 text-sm">{errors.fitnessGoal}</div>
                  )}
                </div>

                {values.fitnessGoal === 'other' && (
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-300">Custom Goal</label>
                    <Field
                      name="customGoal"
                      className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                               text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    {errors.customGoal && touched.customGoal && (
                      <div className="text-red-500 text-sm">{errors.customGoal}</div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-300">Age</label>
                    <Field
                      name="age"
                      type="number"
                      className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                               text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    {errors.age && touched.age && (
                      <div className="text-red-500 text-sm">{errors.age}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-300">Gender</label>
                    <Field
                      as="select"
                      name="gender"
                      className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                               text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                    {errors.gender && touched.gender && (
                      <div className="text-red-500 text-sm">{errors.gender}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-300">Fitness Level</label>
                  <Field
                    as="select"
                    name="fitnessLevel"
                    className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                             text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Field>
                  {errors.fitnessLevel && touched.fitnessLevel && (
                    <div className="text-red-500 text-sm">{errors.fitnessLevel}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm text-gray-300">Height (cm)</label>
                    <Field
                      name="height"
                      type="number"
                      className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                               text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    {errors.height && touched.height && (
                      <div className="text-red-500 text-sm">{errors.height}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm text-gray-300">Weight (kg)</label>
                    <Field
                      name="weight"
                      type="number"
                      className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                               text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                    {errors.weight && touched.weight && (
                      <div className="text-red-500 text-sm">{errors.weight}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-300">Medical Conditions (Optional)</label>
                  <Field
                    as="textarea"
                    name="medicalConditions"
                    className="w-full p-3 rounded-lg bg-[#1A1A1A] border border-[#333333] 
                             text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black font-medium p-3 rounded-full
                           hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}