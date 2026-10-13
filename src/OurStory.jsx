import { t } from './content.js';
import { site } from './content.js';
import { useState } from 'react';
import { Link } from './SiteLink.jsx';
import { ArrowUpRight, ChevronLeft, ChevronRight, MapPin, Pause, Play } from 'lucide-react';
import PhotoSlideshow from './PhotoSlideshow.jsx';
import { useMotion } from './Motion.jsx';
import { Sculpture } from './Brand3D.jsx';
import './our-story.css';
export default function OurStory() {
  const chapters = site.storyChapters,
    storyPhotos = chapters.map(c => c.image);
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [paused, setPaused] = useState(false);
  const {
    enabled,
    setEnabled
  } = useMotion();
  const playing = enabled && !paused;
  const chapter = chapters[displayed];
  const move = direction => setIndex(value => (value + direction + chapters.length) % chapters.length);
  const toggle = () => {
    if (playing) setPaused(true);else {
      setPaused(false);
      setEnabled(true);
    }
  };
  return <section className="our-story" id="our-story" aria-labelledby="our-story-title">
    <div className="story-media" role="region" aria-roledescription="carousel" aria-label="Our story in three moments">
      <PhotoSlideshow images={storyPhotos} alt="Nature Nest gardens and gazebo" className="story-photo" interval={5600} index={index} onIndexChange={setIndex} onDisplayChange={setDisplayed} paused={paused} indicators={false} />
      <div className="story-image-shade" />
      <span className="story-location"><MapPin size={13} />{t("OurStory.001", " MHOW, NEAR INDORE")}</span>
      <button className="story-play" onClick={toggle} aria-label={playing ? 'Pause story slideshow' : 'Play story slideshow'}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
      <div className="story-image-footer">
        <div className="story-image-caption" key={displayed} aria-live={playing ? 'off' : 'polite'}>
          <span>0{displayed + 1} / {String(chapters.length).padStart(2, '0')} <i /> {chapter.name}</span>
          <h3>{chapter.title}</h3>
          <p>{chapter.detail}</p>
        </div>
        <div className="story-arrows">
          <button onClick={() => move(-1)} aria-label="Previous story image"><ChevronLeft size={19} /></button>
          <button onClick={() => move(1)} aria-label="Next story image"><ChevronRight size={19} /></button>
        </div>
      </div>
      <div className="story-photo-progress" aria-hidden="true">{chapters.map((item, i) => <span key={item.name} className={displayed === i ? 'active' : ''} />)}</div>
    </div>

    <div className="story-content">
      <div className="story-overline"><span />{t("OurStory.002", " OUR STORY")}</div>
      <h2 id="our-story-title">{t("OurStory.003", "The luxury of")}<br /><em>{t("OurStory.004", "slowing down.")}</em></h2>
      <p className="story-lead">{t("OurStory.005", "A little wilderness.")}<br />{t("OurStory.006", "A little more room to just be.")}</p>
      <p>{t("OurStory.007", "At The Nature Nest Hotel & Resort in Mhow, near Indore, green surroundings meet thoughtful comforts. A place to put your bags down, take a breath, and feel a little more like yourself.")}</p>
      <p>{t("OurStory.008", "Cosy cottages. Private villas. Shared meals and peaceful afternoons by the pool. Here, life’s simplest pleasures set the pace.")}</p>
      <div className="story-chapters" aria-label="Choose a story moment">{chapters.map((item, i) => <button key={item.name} onClick={() => setIndex(i)} className={displayed === i ? 'active' : ''} aria-label={`Show story image ${i + 1}: ${item.name}`} aria-pressed={displayed === i}>
        <img src={'/assets/' + item.image} alt="" loading="lazy" width="46" height="56" />
        <span><small>0{i + 1}</small>{item.name}</span>
      </button>)}</div>
      <div className="story-actions"><Link className="button" to="/rooms">{t("OurStory.009", "Find your space ")}<ArrowUpRight size={18} /></Link><Link to="/galleries" className="story-gallery-link">{t("OurStory.010", "Explore the nest ")}<ArrowUpRight size={17} /></Link></div>
      <div className="story-signoff"><Sculpture kind="leaf" /><span>{t("OurStory.011", "Less rush. More real life.")}<small>{t("OurStory.012", "THAT’S THE NATURE NEST WAY.")}</small></span></div>
    </div>
  </section>;
}
