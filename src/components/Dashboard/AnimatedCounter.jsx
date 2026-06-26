import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const AnimatedCounter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <Typography variant="h4" sx={{ fontWeight: 700 }}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </Typography>
  );
};

export default AnimatedCounter;
