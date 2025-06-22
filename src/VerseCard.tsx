import React, { useState, useEffect, useRef } from 'react';
import { Book, loadBibleData } from './BibleDB';
import VantaClouds from 'vanta/dist/vanta.clouds.min';
import * as THREE from 'three';

// Ensure THREE is available globally for Vanta.js
window.THREE = THREE;

interface VerseCardProps { }

const VerseCard: React.FC<VerseCardProps> = () => {
  const [verseText, setVerseText] = useState<string>('In the beginning God created the heavens and the earth.');
  const [bookName, setBookName] = useState<string>('Genesis');
  const [chapter, setChapter] = useState<string>('1');
  const [verse, setVerse] = useState<string>('1');
  const [previousTime, setPreviousTime] = useState<string>('x');
  const [bibleData, setBibleData] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    orientation: 'portrait',
  });
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<ReturnType<typeof VantaClouds> | null>(null);
  var randomBookIndex: number | undefined
  const pepTalks: string[] = [
    "Trust in your purpose and let it guide you through every challenge with strength and hope.",
    "You are a unique creation with boundless potential. Let your light shine as you pursue your dreams.",
    "With determination by your side, no obstacle is too big. Keep pushing forward and stay true to your path.",
    "Your resilience is a beacon of hope. Inspire others as you live with passion and purpose in all you do.",
    "Your inner strength is unstoppable. Lean on it, and it will carry you above any challenge.",
    "Every step you take brings you closer to your goals. Trust in your ability to shape your own future.",
    "Grace and perseverance are within you. Celebrate your progress and let peace fill your heart today.",
    "You carry a spark of greatness within you. Share it boldly, and watch how it transforms the world around you.",
    "Believe in your potential. Your journey is yours alone, and you have the power to make it extraordinary.",
    "Challenges are opportunities to grow. Embrace them, learn from them, and become stronger for it.",
    "Take time to rest and reflect on your journey. Your efforts matter, and you are stronger than you know.",
    "Your dreams are within reach. Keep chasing them with unwavering commitment and courage.",
    "You are enough just as you are. Live confidently, knowing your worth and embracing your unique path"
  ];

  // Curated list of beautiful colors for sun effects

  // Curated list of beautiful color sets for sun effects
  const sunColors = [
    { sunColor: 0xff9919, sunGlareColor: 0xff6633, sunlightColor: 0xff9933 }, // Default
    { skyColor: 0x838fb3, sunColor: 0xbabad1, sunGlareColor: 0xff32f4, sunlightColor: 0xf032ff }, // Pink Clouds
    { skyColor: 0xe8bbd5, sunColor: 0xff9919, sunGlareColor: 0xff6633, sunlightColor: 0xff9933 }, // Pink clouds + skys
    // { sunColor: 0xff6f61, sunGlareColor: 0xff8a80, sunlightColor: 0xffa4a0 }, // Coral tones
    // { sunColor: 0xffa726, sunGlareColor: 0xffb851, sunlightColor: 0xffc107 }, // Orange tones
    // { sunColor: 0xffd54f, sunGlareColor: 0xffe082, sunlightColor: 0xfff176 }, // Amber tones
    // { sunColor: 0xffca28, sunGlareColor: 0xffe082, sunlightColor: 0xfff9c4 }, // Golden Yellow tones
    // { sunColor: 0xff8a65, sunGlareColor: 0xffa270, sunlightColor: 0xffb791 }, // Deep Orange tones
    // { sunColor: 0xf06292, sunGlareColor: 0xf48fb1, sunlightColor: 0xf8bbd0 }, // Pink tones
    // { sunColor: 0xffab91, sunGlareColor: 0xffccbc, sunlightColor: 0xffe0b2 }, // Light Peach tones
    // { sunColor: 0xffb300, sunGlareColor: 0xffca28, sunlightColor: 0xffe57f }, // Vibrant Yellow tones
    // { sunColor: 0xd81b60, sunGlareColor: 0xf06292, sunlightColor: 0xf48fb1 }, // Deep Pink tones
    // { sunColor: 0xf57c00, sunGlareColor: 0xff9800, sunlightColor: 0xffb300 }, // Dark Orange tones
  ];

  const getRandomColorSet = () => sunColors[Math.floor(Math.random() * sunColors.length)];
  // Function to pick a random color from the palette
  useEffect(() => {
    const updateDeviceInfo = () => {
      const isMobile = /Mobi|Android|iP(hone|ad|od)/i.test(navigator.userAgent);
      const orientation = window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
      setDeviceInfo({ isMobile, orientation });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  useEffect(() => {
    if (!vantaRef.current) {
      console.warn('Vanta ref is not available yet');
      return;
    }
    var randomColor = getRandomColorSet()
    if (!vantaEffect) {
      try {
        console.log('Initializing Vanta CLOUDS effect');
        const effect = VantaClouds({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          backgroundColor: 0xffffff, // White background
          skyColor: randomColor.skyColor == null ? 0x81b5c9 : randomColor.skyColor,       // Light blue sky
          cloudColor: 0xadc1de,     // Light gray clouds
          cloudShadowColor: 0x183550,// Darker shadow
          sunColor: randomColor.sunColor,       // Random color from palette
          sunGlareColor: randomColor.sunGlareColor,  // Random color from palette
          sunlightColor: randomColor.sunlightColor,  // Random color from palette
          speed: 1.0,               // Default speed
        });
        setVantaEffect(effect);
        console.log('Vanta CLOUDS effect initialized successfully');

        // Debug animation loop
        effect.renderer.setAnimationLoop(() => {
          console.log('Vanta animation loop running');
          effect.renderer.render(effect.scene, effect.camera);
        });
      } catch (error) {
        console.error('Vanta error:', error);
      }
    }

    return () => {
      if (vantaEffect) {
        try {
          vantaEffect.renderer.setAnimationLoop(null);
          vantaEffect.destroy();
          console.log('Vanta CLOUDS effect destroyed');
          setVantaEffect(null);
        } catch (error) {
          console.error('Error destroying Vanta effect:', error);
        }
      }
    };
  }, [vantaRef.current, vantaEffect]);

  useEffect(() => {
    const initializeBibleData = async () => {
      try {
        const data = await loadBibleData();
        setBibleData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Bible data:', error);
        setIsLoading(false);
      }
    };

    initializeBibleData();
  }, []);

  async function noVerseFoundAction(hour: string, min: string) {
    setBookName("Pep Talk (Not Bible)");
    setChapter(hour);
    setVerse(min);
    setVerseText(pepTalks[Number(hour)]);
  }

  useEffect(() => {
    if (isLoading || bibleData.length === 0) return;
    const updateVerse = () => {
      try {
        const now = new Date();
        const currentHour = now.getHours() === 24 || now.getHours() === 0 || now.getHours() === 12 ? 12 : now.getHours() % 12;
        const currentMinute = now.getMinutes();

        const timeString = `Hour: ${currentHour} Minute:${currentMinute}`;
        if (previousTime === timeString) return;
        setPreviousTime(timeString);

        let validVerse = null;
        let attempts = 0;
        const maxAttempts = 600;
        if (currentMinute === 0) {
          noVerseFoundAction(currentHour.toString(), currentMinute.toString());
          return;
        }

        while (!validVerse && attempts < maxAttempts) {
          // TODO: We can make the randomBookIndex a class variable
          // 
          if (randomBookIndex != undefined) {
            const selectedBook = bibleData[randomBookIndex];
            if (selectedBook?.chapters && currentHour < selectedBook.chapters.length) {
              const selectedChapter = selectedBook.chapters[currentHour];
              if (selectedChapter?.verses && currentMinute < selectedChapter.verses.length) {
                const selectedVerse = selectedChapter.verses[currentMinute];
                if (selectedVerse?.text) {
                  validVerse = {
                    book: selectedBook.book,
                    chapter: currentHour.toString(),
                    verse: currentMinute.toString(),
                    text: selectedVerse.text,
                  };
                  return;
                }
              }
            }
          }

          randomBookIndex = Math.floor(Math.random() * bibleData.length);
          const selectedBook = bibleData[randomBookIndex];

          if (selectedBook?.chapters && currentHour < selectedBook.chapters.length) {
            const selectedChapter = selectedBook.chapters[currentHour];
            if (selectedChapter?.verses && currentMinute < selectedChapter.verses.length) {
              const selectedVerse = selectedChapter.verses[currentMinute];
              if (selectedVerse?.text) {
                validVerse = {
                  book: selectedBook.book,
                  chapter: currentHour.toString(),
                  verse: currentMinute.toString(),
                  text: selectedVerse.text,
                };
                break;
              }
            }
          }
          attempts++;
        }

        if (validVerse) {
          setBookName(validVerse.book);
          setChapter(validVerse.chapter);
          setVerse(validVerse.verse);
          setVerseText(validVerse.text);
        } else {
          noVerseFoundAction(currentHour.toString(), currentMinute.toString());
        }
      } catch (error) {
        console.error('Error updating verse:', error);
      }
    };

    updateVerse();
    const interval = setInterval(updateVerse, 5000); // Reduced frequency to improve performance
    return () => clearInterval(interval);
  }, [bibleData, previousTime, isLoading]);

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          zIndex: 1000,
        }}
      >
        <p style={{ fontSize: '1.2rem', color: 'black' }}>Loading Bible verses...</p>
      </div>
    );
  }

  return (
    <div>
      <div
        ref={vantaRef}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0,
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        }}
      >
        <h1
          style={{
            position: 'absolute',
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            paddingTop: deviceInfo.isMobile && deviceInfo.orientation === 'landscape' ? '0%' : '5%',
            fontSize: deviceInfo.isMobile ? 'clamp(1rem, 8vw, 2.5rem)' : '1.5rem',
            fontWeight: 'bold',
            color: 'black',
            fontFamily: '"Playwrite VN", serif',
            fontOpticalSizing: 'auto',
            fontStyle: 'normal',
            textShadow: '2px 2px 10px white',
            zIndex: 10,
            width: '90%',
          }}
        >
          {bookName} {chapter}:{(parseInt(verse) < 10) ? "0" + verse : verse}
        </h1>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.35)', // white with 80% opacity
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '10px 10px 10px 10px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            zIndex: 10,
            position: 'relative',
            marginLeft: deviceInfo.isMobile ? '16px' : 'auto',
            marginRight: deviceInfo.isMobile ? '16px' : 'auto',
          }}
        >
          <div style={{ color: 'black' }}>
            <blockquote style={{

              fontSize: '1.2rem',
              marginTop: '20px'
            }}>
              {verseText}
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerseCard;