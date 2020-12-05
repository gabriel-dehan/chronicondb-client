import { useMediaQuery } from 'react-responsive';

export enum Breakpoint {
  Mobile = 480,
  Tablet = 860,
  Laptop = 1024,
  Desktop = 1280,
}

const useResponsive = () => {
  return {
    isUpToTablet: useMediaQuery({ query: `(max-width: ${Breakpoint.Tablet}px)` }),
  };
};

export default useResponsive;