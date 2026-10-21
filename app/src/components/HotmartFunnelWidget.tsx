import { useEffect, useState } from 'react';

// Hotmart one-click upsell ("Funil de vendas"). The accept/decline buttons, the charge on the
// buyer's saved card and the redirect afterwards are all configured in the Hotmart funnel editor.
const SCRIPT_SRC = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
export const HOTMART_FUNNEL_ID = 'hotmart-sales-funnel';

declare global {
  interface Window {
    checkoutElements?: { init: (type: string) => { mount: (selector: string) => void } };
  }
}

export function HotmartFunnelWidget() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = () => {
      try {
        window.checkoutElements?.init('salesFunnel').mount(`#${HOTMART_FUNNEL_ID}`);
      } catch {
        setFailed(true);
      }
    };

    if (window.checkoutElements) {
      mount();
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = mount;
    script.onerror = () => setFailed(true);
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div id={HOTMART_FUNNEL_ID} className="w-full min-h-[64px]" />
      {failed && (
        <p className="text-xs font-bold text-[#FF3377]">
          No pudimos cargar el botón de compra. Recarga la página para intentarlo de nuevo.
        </p>
      )}
    </div>
  );
}
