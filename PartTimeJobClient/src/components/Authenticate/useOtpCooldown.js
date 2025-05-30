import { useState, useEffect } from 'react';

const useOtpCooldown = () => {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  return { cooldown, setCooldown };
};

export default useOtpCooldown;