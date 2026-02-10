"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { staggerContainer } from "../../utils/animations";
import CountdownCard from "./CountdownCard";

export default function CountdownSection({ targetDate, title, pollData, highlightMinutes = true, closedTitle }) {
  // Calculate target date from poll data or provided targetDate
  const targetTime = useMemo(() => {
    // First, try to get from pollData
    if (pollData) {
      // console.log("CountdownSection - pollData:", pollData);
      // console.log("CountdownSection - ends_at:", pollData.ends_at);
      // console.log("CountdownSection - starts_at:", pollData.starts_at);
      // console.log("CountdownSection - duration_days:", pollData.duration_days);

      if (pollData.ends_at) {
        return new Date(pollData.ends_at).getTime();
      } else if (pollData.starts_at && pollData.duration_days) {
        const startDate = new Date(pollData.starts_at);
        startDate.setDate(startDate.getDate() + pollData.duration_days);
        return startDate.getTime();
      }
    } else {
      // console.log("CountdownSection - pollData is null/undefined");
    }
    // Fallback to provided targetDate
    if (targetDate) {
      return new Date(targetDate).getTime();
    }

    // Default to 3 days from now
    const now = new Date();
    now.setDate(now.getDate() + 3);
    return now.getTime();
  }, [targetDate, pollData]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isClosed, setIsClosed] = useState(false);

  const formatValue = (value) => {
    return String(value).padStart(2, "0");
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsClosed(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsClosed(true);
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const displayTitle = isClosed && closedTitle ? closedTitle : title;

  return (
    <motion.section
      key="countdown-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      {displayTitle && (
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-primary pb-4 text-center mb-6 font-subheading cyber-text-glitch uppercase tracking-wider"
        >
          {displayTitle}
        </motion.h1>
      )}
      {/* {pollData?.duration_days && (
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-widest text-white/50">
            Duration:&nbsp;
            <span className="text-primary font-bold">{pollData.duration_days} Days</span>
          </span>
          <div className="mt-2 text-[10px] text-white/40">3 Days • 7 Days • 14 Days</div>
        </div>
      )} */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto pb-12"
      >
        <motion.div
          key={`days-${timeLeft.days}`}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CountdownCard value={formatValue(timeLeft.days)} label="Days" />
        </motion.div>
        <motion.div
          key={`hours-${timeLeft.hours}`}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CountdownCard value={formatValue(timeLeft.hours)} label="Hours" />
        </motion.div>
        <motion.div
          key={`minutes-${timeLeft.minutes}`}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CountdownCard value={formatValue(timeLeft.minutes)} label="Minutes" isRed={true} />
        </motion.div>
        <motion.div
          key={`seconds-${timeLeft.seconds}`}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CountdownCard value={formatValue(timeLeft.seconds)} label="Seconds" isRed={true} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
