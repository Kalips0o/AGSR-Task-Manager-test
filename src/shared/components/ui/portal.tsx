import { ReactNode, useEffect, useState } from "react";

import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
  element?: HTMLElement;
}

export function Portal({ children, element }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(children, element ?? document.body);
}
