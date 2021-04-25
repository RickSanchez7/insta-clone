import { motion } from 'framer-motion';
import React, { useContext } from 'react';
import { ThemeContext } from '../../context/theme-context';

const DarkMode = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <motion.div
      animate
      className="relative transition duration-500 ease-in-out rounded-full p-2 flex rounded-full bg-gray-medium cursor-pointer w-14 justify-between"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-yellow"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-yellow"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      <motion.div
        initial={{ x: -1 }}
        animate={{ x: theme === 'dark' ? 17 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute bg-white border border-1 w-6 h-6 rounded-full my-auto transform -translate-x-2/4 -translate-y-2/4 top-1 shadow-lg focus:text-blue-medium"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />
    </motion.div>
  );
};

export default DarkMode;
