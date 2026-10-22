import { useEffect } from 'react';

// Attach navigation to existing exported Figma nodes without changing their layout.
export function useNodeActions(actions: Record<string, [string, () => void]>, screen: string) {
  useEffect(() => {
    const cleanup = Object.entries(actions).flatMap(([id, [label, action]]) =>
      Array.from(document.querySelectorAll<HTMLElement>(`[data-node-id="${id}"]`)).map(element => {
        const click = () => action();
        const key = (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); action(); } };
        element.setAttribute('role', 'button'); element.setAttribute('aria-label', label); element.tabIndex = 0;
        element.classList.add('integration-hotspot');
        element.addEventListener('click', click); element.addEventListener('keydown', key);
        return () => { element.removeEventListener('click', click); element.removeEventListener('keydown', key); element.removeAttribute('role'); element.removeAttribute('aria-label'); element.removeAttribute('tabindex'); element.classList.remove('integration-hotspot'); };
      })
    );
    return () => cleanup.forEach(fn => fn());
  }, [screen]);
}
