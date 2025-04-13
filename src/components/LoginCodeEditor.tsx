'use client';

import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';

export default function LoginCodeEditor() {
  const editorRef = useRef<HTMLPreElement>(null);
  const { selectedElement } = useEditorStore();

  const sampleCode = `// Login Page Component
import { useState } from 'react';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'login') {
      // Login logic
      console.log('Logging in with:', {
        email: formData.email,
        password: formData.password
      });
      
      // API call would go here
      // loginUser(formData.email, formData.password)
    } else {
      // Sign up logic
      console.log('Signing up with:', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // API call would go here
      // registerUser(formData.name, formData.email, formData.password)
    }
  };

  // Social login handlers
  const handleGoogleLogin = () => {
    console.log('Logging in with Google');
    // Implement Google OAuth
  };

  const handleFacebookLogin = () => {
    console.log('Logging in with Facebook');
    // Implement Facebook OAuth
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Authentication UI Components */}
      {/* ... Social Login UI ... */}
    </div>
  );
}`;

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.textContent = sampleCode;
      
      // Add syntax highlighting class
      editorRef.current.className = "language-jsx font-mono text-sm overflow-auto";
    }
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 text-white p-2 text-sm font-medium flex items-center">
        <span className="px-2 py-1 rounded bg-blue-600 mr-2">React</span>
        <span>LoginPage.tsx</span>
      </div>
      <div className="bg-gray-900 text-gray-200 p-4 flex-grow overflow-auto">
        <pre ref={editorRef} className="language-jsx font-mono text-sm overflow-auto"></pre>
      </div>
    </div>
  );
} 