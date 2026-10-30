import React from 'react';
import { localPrice } from '../utils/localPrice';

/** Small line under a dollar price: "Aprox. MX$ 225 en tu moneda" (falls back to "Precio en dólares"). */
export default function LocalPriceNote({ offer = 'main', className = '' }) {
  const price = localPrice(offer);
  return (
    <span className={`block text-[11px] font-bold text-[#6B5469] font-body ${className}`}>
      {price ? (
        <>Aprox. <span className="text-[#2B0B2E] font-black">{price}</span> en tu moneda</>
      ) : (
        'Precio en dólares (US$)'
      )}
    </span>
  );
}
