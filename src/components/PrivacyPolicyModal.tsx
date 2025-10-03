import { useState } from 'react';
import Card from './Card';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out">
        <div className="mx-4 mb-4">
          <Card className="max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">Privacy Policy</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <span className="text-white/60 text-xl">×</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6 text-white/80">
                {/* Introduction */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Introduction</h3>
                  <p className="text-sm leading-relaxed">
                    At MindSphere, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy explains how we collect, use, and safeguard your data when you use our meditation and sleep story application.
                  </p>
                </section>

                {/* Information We Collect */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Information We Collect</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-base font-medium text-white/90 mb-2">Personal Information</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Name and email address (from Google OAuth)</li>
                        <li>• Profile picture (from Google OAuth)</li>
                        <li>• Meditation session data and preferences</li>
                        <li>• Sleep story listening history</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-white/90 mb-2">Usage Data</h4>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Session duration and completion rates</li>
                        <li>• Feature usage patterns</li>
                        <li>• Device information and app performance</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* How We Use Your Information */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">How We Use Your Information</h3>
                  <ul className="text-sm space-y-2 ml-4">
                    <li>• To provide personalized meditation and sleep content</li>
                    <li>• To track your progress and streaks</li>
                    <li>• To improve our services and user experience</li>
                    <li>• To send you relevant notifications and updates</li>
                    <li>• To analyze usage patterns for app optimization</li>
                  </ul>
                </section>

                {/* Data Security */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Data Security</h3>
                  <p className="text-sm leading-relaxed">
                    We implement industry-standard security measures to protect your personal information. 
                    All data is encrypted in transit and at rest. We use secure authentication through Google OAuth 
                    and do not store your Google credentials.
                  </p>
                </section>

                {/* Third-Party Services */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Third-Party Services</h3>
                  <div className="space-y-2">
                    <p className="text-sm leading-relaxed">
                      We use the following third-party services:
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Google OAuth:</strong> For secure authentication</li>
                      <li>• <strong>Supabase:</strong> For database and authentication services</li>
                      <li>• <strong>Railway:</strong> For application hosting</li>
                      <li>• <strong>Vercel:</strong> For frontend hosting</li>
                    </ul>
                  </div>
                </section>

                {/* Your Rights */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Your Rights</h3>
                  <ul className="text-sm space-y-2 ml-4">
                    <li>• Access your personal data</li>
                    <li>• Request correction of inaccurate data</li>
                    <li>• Request deletion of your data</li>
                    <li>• Opt-out of data processing</li>
                    <li>• Export your data in a portable format</li>
                  </ul>
                </section>

                {/* Data Retention */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Data Retention</h3>
                  <p className="text-sm leading-relaxed">
                    We retain your personal information for as long as your account is active or as needed to provide services. 
                    You can request deletion of your account and associated data at any time.
                  </p>
                </section>

                {/* Contact Information */}
                <section>
                  <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
                  <p className="text-sm leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <div className="mt-2 p-3 bg-white/5 rounded-lg">
                    <p className="text-sm text-white/90">Email: privacy@mindsphere.app</p>
                    <p className="text-sm text-white/90">Last updated: September 25, 2025</p>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50">
                  By using MindSphere, you agree to this Privacy Policy
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
