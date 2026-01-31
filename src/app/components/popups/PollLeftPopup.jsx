"use client";

import { ArrowRight, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function PollLeftPopup({ onInitiateLink, onClose, show = true }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const messages = useMemo(
    () => [
      { text: "Welcome User", color: "text-primary" },
      { text: "> initiating contact to the Lionara mainframe", color: "text-blue-400" },
      { text: "> initializing....", color: "text-yellow-400" },
      { text: "> CONNECTED", color: "text-green-400" },
    ],
    [],
  );

  useEffect(() => {
    if (!show) return;

    const currentMessage = messages[currentStep];
    let charIndex = 0;
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.text.length) {
        setDisplayedText(currentMessage.text.substring(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);

        // Move to next message after a delay
        if (currentStep < messages.length - 1) {
          setTimeout(() => {
            setCurrentStep(currentStep + 1);
            setDisplayedText("");
          }, 600);
        }
      }
    }, 25); // Typing speed

    return () => clearInterval(typingInterval);
  }, [currentStep, show, messages]);

  if (!show) return null;

  const handleInitiateLink = () => {
    if (onInitiateLink) {
      onInitiateLink();
    }
  };

  return (
    <>
      {/* Main popup card */}
      <div className="w-full max-w-md bg-black rounded-[32px] border border-white/10 p-8 shadow-2xl relative">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white/60 hover:bg-primary hover:border-primary hover:text-black transition-all duration-200 z-20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Terminal-style display */}
        <div className="min-h-[300px] flex flex-col justify-center">
          <div className="font-subheading space-y-4">
            {messages.slice(0, currentStep + 1).map((msgObj, index) => {
              const isCurrent = index === currentStep;
              return (
                <div key={index} className={isCurrent ? "" : "opacity-70"}>
                  {isCurrent ? (
                    <span className={msgObj.color}>
                      {displayedText}
                      {isTyping && <span className="animate-pulse text-white">|</span>}
                    </span>
                  ) : (
                    <span className={msgObj.color}>{msgObj.text}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Continue button - only show after CONNECTED */}
          {currentStep === messages.length - 1 && !isTyping && (
            <button
              onClick={handleInitiateLink}
              className="mt-8 w-full bg-primary hover:bg-[#b8e600] text-black font-jetbrains-mono font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 active:scale-[0.98]"
            >
              CONTINUE
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
