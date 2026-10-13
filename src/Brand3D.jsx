import {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import {useMotion} from './Motion.jsx';
import './brand3d.css';

function useVisibleMotion() {
  const ref = useRef(null);
  const {enabled} = useMotion();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {threshold: 0.1});
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return {ref, moving: enabled && visible};
}

export function Brand3D() {
  const {ref, moving} = useVisibleMotion();
  return <span ref={ref} className={`brand3d ${moving ? 'is-moving' : ''}`}>
    <img className="brand3d-mark" src="/assets/3d/nature-nest-emblem.webp" alt="" width="70" height="70"/>
    <span className="brand3d-wordmark"><span className="brand3d-overline">THE</span><span className="brand3d-name">Nature Nest</span><span className="brand3d-caption">HOTEL & RESORT</span></span>
  </span>;
}

export function Sculpture({kind = 'leaf', className = '', delay = 0}) {
  const {ref, moving} = useVisibleMotion();
  const asset = kind === 'stay' ? 'nature-nest-emblem' : kind;
  return <span ref={ref} aria-hidden="true" className={`sculpture sculpture-${kind} ${moving ? 'is-moving' : ''} ${className}`} style={{'--sculpture-delay': `${delay}s`}}><img src={`/assets/3d/${asset}.webp`} alt="" loading="lazy" width="100" height="100"/></span>;
}

export function Comforts3D() {
  const items = [
    {kind: 'stay', title: 'Your own hideaway', text: 'Cottages & private villas', to: '/rooms'},
    {kind: 'leaf', title: 'A little closer to nature', text: 'Green views. Quieter days.', to: '/about'},
    {kind: 'pool', title: 'Into the blue', text: 'Poolside moments & leisure', to: '/services/wellness-spa'},
    {kind: 'dining', title: 'Made to be savoured', text: 'Warm meals. Good company.', to: '/services/restaurants-bars'},
  ];
  return <section className="comforts3d" aria-label="The Nature Nest comforts">{items.map((item, i) => <Link key={item.kind} to={item.to} className="comfort3d"><Sculpture kind={item.kind} delay={i * -1.4}/><div><h3>{item.title}</h3><p>{item.text}</p></div><ArrowUpRight className="comfort3d-arrow" size={16}/></Link>)}</section>;
}
