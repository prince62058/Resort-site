import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Pause, Play} from 'lucide-react';
import PhotoSlideshow from './PhotoSlideshow.jsx';
import {useMotion} from './Motion.jsx';
import {Sculpture} from './Brand3D.jsx';
import './our-story.css';

const chapters = [
  {name: 'Arrive', title: 'A little closer to nature.', image: 'enhanced/story/story-arrival-v1.webp', detail: 'Green views. A warm welcome.'},
  {name: 'Unwind', title: 'Take the scenic way to nowhere.', image: 'enhanced/story/story-unwind-v1.webp', detail: 'Quiet paths. Unhurried afternoons.'},
  {name: 'Belong', title: 'Good company. Golden evenings.', image: 'enhanced/story/story-belong-v1.webp', detail: 'A table for your favourite people.'},
];
export const storyPhotos = chapters.map(chapter => chapter.image);

export default function OurStory() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [paused, setPaused] = useState(false);
  const {enabled, setEnabled} = useMotion();
  const playing = enabled && !paused;
  const chapter = chapters[displayed];
  const move = direction => setIndex(value => (value + direction + chapters.length) % chapters.length);
  const toggle = () => {
    if (playing) setPaused(true);
    else {setPaused(false); setEnabled(true);}
  };

  return <section className="our-story" id="our-story" aria-labelledby="our-story-title">
    <div className="story-media" role="region" aria-roledescription="carousel" aria-label="Our story in three moments">
      <PhotoSlideshow images={storyPhotos} alt="Nature Nest gardens and gazebo" className="story-photo" interval={5600} index={index} onIndexChange={setIndex} onDisplayChange={setDisplayed} paused={paused} indicators={false}/>
      <div className="story-image-shade"/>
      <span className="story-location"><MapPin size={13}/> MHOW, NEAR INDORE</span>
      <button className="story-play" onClick={toggle} aria-label={playing ? 'Pause story slideshow' : 'Play story slideshow'}>{playing ? <Pause size={16}/> : <Play size={16}/>}</button>
      <div className="story-image-footer">
        <div className="story-image-caption" key={displayed} aria-live={playing ? 'off' : 'polite'}>
          <span>0{displayed + 1} / 03 <i/> {chapter.name}</span>
          <h3>{chapter.title}</h3>
          <p>{chapter.detail}</p>
        </div>
        <div className="story-arrows">
          <button onClick={() => move(-1)} aria-label="Previous story image"><ChevronLeft size={19}/></button>
          <button onClick={() => move(1)} aria-label="Next story image"><ChevronRight size={19}/></button>
        </div>
      </div>
      <div className="story-photo-progress" aria-hidden="true">{chapters.map((item, i) => <span key={item.name} className={displayed === i ? 'active' : ''}/>)}</div>
    </div>

    <div className="story-content">
      <div className="story-overline"><span/> OUR STORY</div>
      <h2 id="our-story-title">The luxury of<br/><em>slowing down.</em></h2>
      <p className="story-lead">A little wilderness.<br/>A little more room to just be.</p>
      <p>At The Nature Nest Hotel &amp; Resort in Mhow, near Indore, green surroundings meet thoughtful comforts. A place to put your bags down, take a breath, and feel a little more like yourself.</p>
      <p>Cosy cottages. Private villas. Shared meals and peaceful afternoons by the pool. Here, life’s simplest pleasures set the pace.</p>
      <div className="story-chapters" aria-label="Choose a story moment">{chapters.map((item, i) => <button key={item.name} onClick={() => setIndex(i)} className={displayed === i ? 'active' : ''} aria-label={`Show story image ${i + 1}: ${item.name}`} aria-pressed={displayed === i}>
        <img src={'/assets/' + item.image} alt="" loading="lazy" width="46" height="56"/>
        <span><small>0{i + 1}</small>{item.name}</span>
      </button>)}</div>
      <div className="story-actions"><Link className="button" to="/rooms">Find your space <ArrowUpRight size={18}/></Link><Link to="/galleries" className="story-gallery-link">Explore the nest <ArrowUpRight size={17}/></Link></div>
      <div className="story-signoff"><Sculpture kind="leaf"/><span>Less rush. More real life.<small>THAT’S THE NATURE NEST WAY.</small></span></div>
    </div>
  </section>;
}
