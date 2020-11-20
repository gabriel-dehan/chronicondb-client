import { useEffect, RefObject } from 'react';

export default function useOnClickOutside(
  element: RefObject<HTMLElement>,
  callback: (event: MouseEvent) => void
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (element.current && !element.current.contains(event.target as Node)) {
        callback(event);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [element, callback]);
}