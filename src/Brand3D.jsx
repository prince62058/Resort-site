import {t} from './content.js';
import { site } from './content.js';
import { useEffect, useRef, useState } from 'react';
import { Link } from './SiteLink.jsx';
import { ArrowUpRight } from 'lucide-react';
import { useMotion } from './Motion.jsx';
import './brand3d.css';
function useVisibleMotion() {
  const ref = useRef(null);
  const {
    enabled
  } = useMotion();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.1
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return {
    ref,
    moving: enabled && visible
  };
}
export function Brand3D() {
  const {
    ref,
    moving
  } = useVisibleMotion();
  return <span ref={ref} className={`brand3d ${moving ? 'is-moving' : ''}`}>
    <img className="brand3d-mark" src={'/assets/' + site.settings.logo} alt="" width="70" height="70" />
    <span className="brand3d-wordmark"><span className="brand3d-overline">{t("Brand3D.001", "THE")}</span><span className="brand3d-name">{site.settings.name}</span><span className="brand3d-caption">{t("Brand3D.002", "HOTEL & RESORT")}</span></span>
  </span>;
}
export function Sculpture({
  kind = 'leaf',
  className = '',
  delay = 0
}) {
  const {
    ref,
    moving
  } = useVisibleMotion();
  const asset = kind === 'stay' ? 'nature-nest-emblem' : kind;
  return <span ref={ref} aria-hidden="true" className={`sculpture sculpture-${kind} ${moving ? 'is-moving' : ''} ${className}`} style={{
    '--sculpture-delay': `${delay}s`
  }}><img src={'/assets/'+(kind==='stay'?site.settings.logo:site.settings.icons?.[kind]||`3d/${asset}.webp`)} alt="" loading="lazy" width="100" height="100" /></span>;
}
export function Comforts3D() {
  const items = site.comforts;
  return <section className="comforts3d" aria-label="The Nature Nest comforts">{items.map((item, i) => <Link key={item.kind} to={item.to} className="comfort3d"><Sculpture kind={item.kind} delay={i * -1.4} /><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowUpRight className="comfort3d-arrow" size={16} /></Link>)}</section>;
}
