import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CountryFlagProps {
  ip: string;
}

const CountryFlag: React.FC<CountryFlagProps> = ({ ip }) => {
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/ip-info?ip=${ip}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.country) setCountryCode(data.country);
      })
      .catch(() => {});
  }, [ip]);

  if (!countryCode) return null;

  return (
    <Image 
      src={`/flags/${countryCode}.png`} 
      alt={countryCode} 
      width={16} 
      height={12}
      className="shadow-sm inline-block"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
};

export default CountryFlag;