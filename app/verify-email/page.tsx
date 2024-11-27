'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setVerificationStatus('success');
        toast.success('Email verified successfully!');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error: any) {
        setVerificationStatus('error');
        toast.error(error.message);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus('error');
      toast.error('Verification token is missing');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
          <div className="mt-4 text-center">
            {verificationStatus === 'verifying' && (
              <p className="text-gray-600">Verifying your email...</p>
            )}
            {verificationStatus === 'success' && (
              <p className="text-green-600">
                Your email has been verified successfully! Redirecting to login...
              </p>
            )}
            {verificationStatus === 'error' && (
              <p className="text-red-600">
                Failed to verify email. Please try again or contact support.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
