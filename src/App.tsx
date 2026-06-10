import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { DynamicBackground } from './components/ui/DynamicBackground';
import CalculatorApp from './components/calculator/CalculatorApp';
import TaskManagerApp from './components/taskManager/TaskManagerApp';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentHash === '#/calculator') {
    return <CalculatorApp />;
  }

  if (currentHash === '#/task-manager') {
    return <TaskManagerApp />;
  }

  return (
    <>
      <DynamicBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
      </main>
      <Footer />
    </>
  );
}

export default App;
