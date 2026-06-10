import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}

export const TypewriterText = ({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 1500,
}: TypewriterTextProps) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingTimer, setTypingTimer] = useState(typingSpeed);

  useEffect(() => {
    let timer: number;
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));

      // Varying typing speeds dynamically to make it look human
      let delta = isDeleting ? deletingSpeed : typingSpeed - Math.random() * 50;

      if (!isDeleting && text === fullText) {
        // Stop typing -> Wait -> Start deleting
        delta = pauseTime;
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        // Stopped deleting -> Next phrase -> Start typing again
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        delta = 500; // Small breath before starting
      }

      setTypingTimer(delta);
    };

    timer = window.setTimeout(handleTyping, typingTimer);

    return () => window.clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases, typingSpeed, deletingSpeed, pauseTime, typingTimer]);

  return (
    <span className="inline-block">
      {text}
      <span className="animate-pulse-slow text-primary font-black ml-1">|</span>
    </span>
  );
};
