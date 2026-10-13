import {createContext, useContext, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {Pause, Play} from 'lucide-react';
import {useLocation} from 'react-router-dom';

const MotionContext = createContext(null);
export const useMotion = () => useContext(MotionContext);

export function MotionProvider({children}) {
  const [enabled, setEnabled] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [footerDock, setFooterDock] = useState(null);
  const [pageDock, setPageDock] = useState(null);
  const [heroControlsVisible, setHeroControlsVisible] = useState(false);
  const {pathname} = useLocation();
  useEffect(() => {
    setPageDock(document.querySelector('.stays-motion-dock'));
  }, [pathname]);
  useEffect(() => {
    const controls = document.querySelector('.carousel-playback');
    setHeroControlsVisible(false);
    if (!controls) return;
    const observer = new IntersectionObserver(([entry]) => setHeroControlsVisible(entry.isIntersecting));
    observer.observe(controls);
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    const footer = document.querySelector('.nest-footer');
    const dock = document.querySelector('.nest-motion-dock');
    if (!footer || !dock) return;
    const observer = new IntersectionObserver(([entry]) => setFooterDock(entry.isIntersecting ? dock : null));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {if (preference.matches) setEnabled(false);};
    preference.addEventListener('change', onChange);
    return () => preference.removeEventListener('change', onChange);
  }, []);
  const control = <button className="motion-toggle" data-hero-controls-visible={heroControlsVisible && !footerDock} aria-label={enabled ? 'Pause all animations' : 'Play all animations'} onClick={() => setEnabled(value => !value)}>{enabled ? <Pause size={13}/> : <Play size={13}/>}<span>{enabled ? 'Pause motion' : 'Play motion'}</span></button>;
  const dock = footerDock || pageDock;
  return <MotionContext.Provider value={{enabled, setEnabled}}>{children}{dock ? createPortal(control, dock) : control}</MotionContext.Provider>;
}
