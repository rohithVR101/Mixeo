import { useRef, useState, useEffect, useCallback } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './RangePlayer.css';

/**
 * RangePlayer — Full React rewrite of public/js/rangePlayer.js.
 *
 * Props:
 *   src {string}       - Cloudinary video URL
 *   duration {number}  - Video duration hint from upload response (used pre-load)
 *   onRangeChange {function} - Callback({ start, end }) called on trim range change
 */
function RangePlayer({ src, duration, onRangeChange }) {
  const videoRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState('off');       // 'off' | 'on' | 'pause'
  const [start, setStart] = useState(0.01);
  const [end, setEnd] = useState(duration || 0);
  // videoDuration is the true ceiling for all sliders. It is set once when the
  // video fires loadeddata and never changes, so the right trim handle has a
  // fixed max it can reach. Keeping it separate from `end` fixes the bug where
  // max={end} locked the right handle at its own position.
  const [videoDuration, setVideoDuration] = useState(duration || 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [showVolume, setShowVolume] = useState(false);

  // ── Load actual duration from the video element ───────────────────────────
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleLoaded = () => {
      const dur = vid.duration;
      setVideoDuration(dur);   // fixed ceiling — never changes
      setEnd(dur);             // right handle starts at the full end
      setStart(0.01);
      setCurrentTime(0.01);
      setLoaded(true);
      onRangeChange?.({ start: 0.01, end: dur });
    };

    vid.addEventListener('loadeddata', handleLoaded);
    return () => vid.removeEventListener('loadeddata', handleLoaded);
  }, [src, onRangeChange]);

  // ── Sync volume to video element ─────────────────────────────────────────
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // ── Time update: advance playback slider & stop at trim end ──────────────
  // endRef lets the timeupdate closure always read the latest `end` value
  // without needing to re-register the listener on every render.
  const endRef = useRef(end);
  useEffect(() => { endRef.current = end; }, [end]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handleTimeUpdate = () => {
      const t = vid.currentTime;
      if (t >= endRef.current) {
        vid.pause();
        vid.currentTime = endRef.current;
        setMode('off');
        setCurrentTime(endRef.current);
        return;
      }
      setCurrentTime(t);
    };

    vid.addEventListener('timeupdate', handleTimeUpdate);
    return () => vid.removeEventListener('timeupdate', handleTimeUpdate);
  }, []); // intentionally empty — endRef handles live end value

  // ── Play / Pause / Resume ─────────────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    const vid = videoRef.current;
    if (!vid || !loaded) return;

    if (mode === 'off') {
      vid.currentTime = start;
      vid.play();
      setMode('on');
    } else if (mode === 'on') {
      vid.pause();
      setMode('pause');
    } else if (mode === 'pause') {
      vid.play();
      setMode('on');
    }
  }, [mode, start, loaded]);

  // ── Trim range change (dual-handle slider) ────────────────────────────────
  const handleRangeChange = useCallback((values) => {
    const [newStart, newEnd] = values;
    setStart(newStart);
    setEnd(newEnd);
    setMode('off');
    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      vid.currentTime = newStart;
      setCurrentTime(newStart);
    }
    onRangeChange?.({ start: newStart, end: newEnd });
  }, [onRangeChange]);

  // ── Playback scrubbing ────────────────────────────────────────────────────
  const handleSeek = useCallback((value) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = value;
    setCurrentTime(value);
    setMode('pause');
  }, []);

  const isPlaying = mode === 'on';
  // Safe ceiling — falls back to prop duration before loadeddata fires
  const maxDur = videoDuration || duration || 1;

  return (
    <div className="range-player">
      <div id="video-box" className="video-box">
        <video
          ref={videoRef}
          src={src}
          id="editvideo"
          className="video-dom"
        >
          Your browser does not support the video tag.
        </video>

        {loaded && (
          <div className="ctrl-box">
            <div className="controler">
              {/* ── Play / Pause ────────────────────────────────── */}
              <button
                id="playVid"
                className={`play-pause-btn ${isPlaying ? 'is-playing' : ''}`}
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                <i className={`fas ${isPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`} />
              </button>

              {/* ── Trim range + playback position ───────────────── */}
              <div className="dragger-case">
                <div id="vid-range" className="vid-range-wrapper">
                  {/*
                    Dual-handle trim selector.
                    max must be videoDuration (fixed), NOT end — if max === end
                    the right handle can never move beyond its own position.
                  */}
                  <Slider
                    range
                    min={0}
                    max={maxDur}
                    step={0.01}
                    value={[start, end]}
                    onChange={handleRangeChange}
                    className="trim-range-slider"
                    aria-label={['Trim start', 'Trim end']}
                  />
                  {/* Playback position indicator nested inside trim range */}
                  <div id="v-range" className="playback-slider-wrapper">
                    <Slider
                      min={start}
                      max={end}
                      step={0.01}
                      value={Math.min(currentTime, end)}
                      onChange={handleSeek}
                      className="playback-slider"
                      aria-label="Playback position"
                    />
                  </div>
                </div>
              </div>

              {/* ── Volume ──────────────────────────────────────── */}
              <div className="volume-area">
                <button
                  id="ctrl-sound"
                  className="volume-btn"
                  onClick={() => setShowVolume((v) => !v)}
                  aria-label="Toggle volume slider"
                  aria-expanded={showVolume}
                >
                  <i className="fas fa-volume-up" />
                </button>

                {showVolume && (
                  <div id="vid-volume" className="volume-slider-container">
                    <input
                      type="range"
                      className="volume-slider"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      aria-label="Volume"
                      orient="vertical"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RangePlayer;
