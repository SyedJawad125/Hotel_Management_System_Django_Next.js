// 'use client';
// import { useContext, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { AuthContext } from '@/components/AuthContext';
// import AxiosInstance from '@/components/AxiosInstance';

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const router = useRouter();
  
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     // Basic validation
//     if (!formData.username || !formData.password) {
//       setError('Please enter both username and password');
//       setLoading(false);
//       return;
//     }

//     // Email format validation
//     const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!usernameRegex.test(formData.username)) {
//       setError('Please enter a valid username address');
//       setLoading(false);
//       return;
//     }

//     try {
//       console.log('Attempting login with:', { username: formData.username });
      
//       // Call your login API
//       const response = await AxiosInstance.post('/api/user/v1/login/', formData);
      
//       console.log('Login API response:', response.data);

//       // Backend returns: { message: "Successful", data: {...}, count: null }
//       if (response.data.message === 'Successful' && response.data.data) {
//         // Pass the entire response to login function
//         login(response.data);
        
//         // Notify the sidebar about auth change
//         if (typeof window !== 'undefined') {
//           window.dispatchEvent(new Event('authStateChanged'));
//         }
        
//         console.log('Login successful, redirecting to admindashboard...');
//         router.push('/admindashboard');

//       } else {
//         setError(response.data.message || 'Login failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Login error:', err);
      
//       // Handle different error scenarios
//       if (err.response) {
//         // Server responded with error status
//         // Backend returns errors in format: { message: "error message" }
//         const errorMessage = err.response.data?.message 
//           || err.response.data?.detail 
//           || err.response.data?.error
//           || 'Invalid credentials. Please try again.';
//         setError(errorMessage);
//       } else if (err.request) {
//         // Request was made but no response received
//         setError('Unable to connect to server. Please check your connection.');
//       } else {
//         // Something else happened
//         setError('An unexpected error occurred. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -inset-10 opacity-20">
//           <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         </div>
//       </div>

//       <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
//         {/* Decorative header */}
//         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400"></div>
        
//         <div className="p-8">
//           {/* Logo/Brand */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg mb-4">
//               <span className="text-2xl font-bold text-white">L</span>
//             </div>
//             <h2 className="text-3xl font-light text-white tracking-wide">
//               Welcome Back
//             </h2>
//             <p className="text-white/60 text-sm mt-2 font-light">
//               Sign in to your account
//             </p>
//           </div>
          
//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/30 text-white rounded-xl backdrop-blur-sm">
//               <div className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 {error}
//               </div>
//             </div>
//           )}
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div className="group">
//               <label 
//                 htmlFor="username" 
//                 className="block text-sm font-medium text-white/80 mb-2 transition-all duration-300 group-focus-within:text-amber-300"
//               >
//                 Email Address
//               </label>
//               <div className="relative">
//                 <input
//                   type="username"
//                   id="username"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 transition-all duration-300 backdrop-blur-sm"
//                   placeholder="Enter your username"
//                   required
//                   disabled={loading}
//                 />
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             {/* Password Field */}
//             <div className="group">
//               <label 
//                 htmlFor="password" 
//                 className="block text-sm font-medium text-white/80 mb-2 transition-all duration-300 group-focus-within:text-cyan-300"
//               >
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/30 transition-all duration-300 backdrop-blur-sm"
//                   placeholder="Enter your password"
//                   required
//                   disabled={loading}
//                 />
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
            
//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center text-white/70 text-sm">
//                 <input type="checkbox" className="rounded bg-white/10 border-white/20 text-amber-400 focus:ring-amber-400/50" />
//                 <span className="ml-2">Remember me</span>
//               </label>
//               <a 
//                 href="/forgetpassword" 
//                 className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors duration-300 hover:underline"
//               >
//                 Forgot password?
//               </a>
//             </div>
            
//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-4 px-6 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
//                 loading 
//                   ? 'bg-gray-500 cursor-not-allowed' 
//                   : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-amber-500/25'
//               }`}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                     <circle 
//                       className="opacity-25" 
//                       cx="12" 
//                       cy="12" 
//                       r="10" 
//                       stroke="currentColor" 
//                       strokeWidth="4"
//                       fill="none"
//                     />
//                     <path 
//                       className="opacity-75" 
//                       fill="currentColor" 
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Signing in...
//                 </span>
//               ) : (
//                 <span className="flex items-center justify-center">
//                   Sign In
//                   <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                   </svg>
//                 </span>
//               )}
//             </button>
//           </form>
          
//           {/* Divider */}
//           <div className="relative my-8">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-white/10"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 text-white/40 bg-transparent">Or continue with</span>
//             </div>
//           </div>
          
//           {/* Social Login */}
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <button 
//               type="button"
//               className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
//             >
//               <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Google
//             </button>
//             <button 
//               type="button"
//               className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
//             >
//               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//               </svg>
//               Twitter
//             </button>
//           </div>
          
//           {/* Sign Up Link */}
//           <div className="text-center">
//             <span className="text-white/60 text-sm">
//               Don't have an account?{' '}
//             </span>
//             <a 
//               href="/signup" 
//               className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors duration-300 font-medium hover:underline"
//             >
//               Create account
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



'use client';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/components/AuthContext';
import AxiosInstance from '@/components/AxiosInstance';

const Login = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!usernameRegex.test(formData.username)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { username: formData.username });
      const response = await AxiosInstance.post('/api/user/v1/login/', formData);
      console.log('Login API response:', response.data);

      if (response.data.message === 'Successful' && response.data.data) {
        login(response.data);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('authStateChanged'));
        }
        console.log('Login successful, redirecting to admin dashboard...');
        router.push('/admin/dashboard');
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        const errorMessage = err.response.data?.message 
          || err.response.data?.detail 
          || err.response.data?.error
          || 'Invalid credentials. Please try again.';
        setError(errorMessage);
      } else if (err.request) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf6ef] via-white to-[#f5efe4] p-4 relative overflow-hidden">
      {/* Decorative heritage background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-300/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-amber-200/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-amber-200/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-amber-200/5 rounded-full"></div>
        </div>
        {/* Decorative corner ornaments */}
        <div className="absolute top-8 left-8 text-amber-300/20 text-6xl font-serif">✦</div>
        <div className="absolute bottom-8 right-8 text-amber-300/20 text-6xl font-serif">✦</div>
      </div>

      <div className="relative w-full max-w-md z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-amber-900/10 border border-amber-200/50 overflow-hidden transition-all duration-300 hover:shadow-amber-900/20">
          {/* Gold gradient top bar with decorative pattern */}
          <div className="h-2 bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI4IiB2aWV3Qm94PSIwIDAgNjAgOCI+PHBhdGggZD0iTTAgMGwzMCA4IDMwLTh6IiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>
          </div>

          <div className="p-8 sm:p-10">
            {/* Brand Section — Heritage Village style */}
            <div className="text-center mb-10">
              <div className="relative inline-block">
                <div className="absolute -top-3 -left-3 text-amber-200/30 text-3xl font-serif">✦</div>
                <div className="font-serif text-amber-600 text-sm tracking-[0.25em] mb-1">القرية الشعبية</div>
                <h1 className="font-serif text-4xl md:text-5xl font-semibold text-amber-800 tracking-wide leading-tight">
                  The Heritage<br />Village
                </h1>
                <div className="absolute -bottom-3 -right-3 text-amber-200/30 text-3xl font-serif">✦</div>
              </div>
              <div className="font-serif text-amber-500 text-sm tracking-[0.4em] mt-2">— 1998 —</div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4"></div>
              <p className="text-amber-700/50 text-sm mt-4 font-light tracking-wide">
                Welcome back · Sign in to continue
              </p>
            </div>

            {/* Error Message — elegant heritage style */}
            {error && (
              <div className="mb-6 p-4 bg-rose-50/90 border-l-4 border-rose-400 rounded-r-xl text-rose-700 text-sm animate-shake">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email / Username */}
              <div>
                <label htmlFor="username" className="block text-xs font-medium text-amber-700/60 uppercase tracking-[0.15em] mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl text-amber-900 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all duration-200 group-hover:border-amber-300/80"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/40 group-focus-within:text-amber-500 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-amber-700/60 uppercase tracking-[0.15em] mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl text-amber-900 placeholder-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-300 transition-all duration-200 group-hover:border-amber-300/80"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400/40 group-focus-within:text-amber-500 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-amber-700/50 cursor-pointer group">
                  <input type="checkbox" className="rounded border-amber-300/60 text-amber-600 focus:ring-amber-400/40 focus:ring-offset-0 transition-all duration-200" />
                  <span className="group-hover:text-amber-700/70 transition-colors duration-200">Remember me</span>
                </label>
                <a href="/forgetpassword" className="text-amber-600 hover:text-amber-700 transition-colors hover:underline font-medium text-sm">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button — Heritage gold with shine effect */}
              <button
                type="submit"
                disabled={loading}
                className={`relative w-full py-4 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${
                  loading
                    ? 'bg-amber-400/60 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40'
                }`}
              >
                {/* Shine effect */}
                {!loading && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></span>
                )}
                {loading ? (
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    Sign In
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Divider with heritage touch */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent"></div>
              <span className="text-xs text-amber-400/50 uppercase tracking-[0.2em] font-medium">Or continue with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent"></div>
            </div>

            {/* Social Buttons — refined with hover effects */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button type="button" className="group flex items-center justify-center gap-2 px-4 py-3 bg-amber-50/70 border border-amber-200/50 rounded-xl text-amber-700/70 hover:bg-amber-100/60 hover:border-amber-300/70 transition-all duration-200 text-sm font-medium hover:shadow-md hover:shadow-amber-200/20">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>
              <button type="button" className="group flex items-center justify-center gap-2 px-4 py-3 bg-amber-50/70 border border-amber-200/50 rounded-xl text-amber-700/70 hover:bg-amber-100/60 hover:border-amber-300/70 transition-all duration-200 text-sm font-medium hover:shadow-md hover:shadow-amber-200/20">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
                <span>Twitter</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-amber-700/40">
              Don't have an account?{' '}
              <a href="/signup" className="text-amber-600 hover:text-amber-700 font-medium hover:underline transition-colors duration-200">
                Create account
              </a>
            </div>

            {/* Heritage footer */}
            <div className="mt-6 text-center text-[10px] text-amber-400/40 tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-3">
              <span>🔒 Secured</span>
              <span className="w-px h-3 bg-amber-200/40"></span>
              <span>KSA Cloud</span>
              <span className="w-px h-3 bg-amber-200/40"></span>
              <span>ZATCA Compliant</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Login;