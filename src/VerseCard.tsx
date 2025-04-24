import React, { useState, useEffect } from 'react'
import { Book, loadBibleData } from './BibleDB';
interface VerseCardProps { }

const VerseCard: React.FC<VerseCardProps> = () => {
  const [verseText, setVerseText] = React.useState<string>('In the beginning God created the heavens and the earth.');
  const [bookName, setBookName] = React.useState<string>('Genesis');
  const [chapter, setChapter] = React.useState<string>('1');
  const [verse, setVerse] = React.useState<string>('1');
  const [previousTime, setPreviousTime] = React.useState<string>('x');
  const [bibleData, setBibleData] = React.useState<Book[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    orientation: 'portrait',
  });

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
    "You are enough just as you are. Live confidently, knowing your worth and embracing your unique path."
];

  useEffect(() => {
    const updateDeviceInfo = () => {
      const isMobile = /Mobi|Android|iP(hone|ad|od)/i.test(navigator.userAgent);
      const orientation = window.matchMedia('(orientation: portrait)').matches
        ? 'portrait'
        : 'landscape';
      setDeviceInfo({ isMobile, orientation });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
    };
  }, []);

  // Load Bible data once when component mounts
  React.useEffect(() => {
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

  // Update verse based on time
  React.useEffect(() => {
    if (isLoading || bibleData.length === 0) return;
    console.log("Loading Verse 1")
    const updateVerse = () => {
      try {
        const now = new Date();
        var currentHour = (now.getHours() == 24 || now.getHours() == 0 || now.getHours() == 12) ? 12 : now.getHours() % 12;
        var currentMinute = now.getMinutes();

        // currentHour = 1
        // currentMinute = 0

        const timeString = `Hour: ${currentHour} Minute:${currentMinute}`;
        console.log("Loading Verse 2 ", timeString)
        if (previousTime === timeString) {
          return;
        }
        console.log("Loading Verse 3")
        setPreviousTime(timeString);

        // Find a valid verse for the current time
        let validVerse = null;
        let attempts = 0;
        const maxAttempts = 300;
        console.log("Loading Verse 4")
        if (currentMinute == 0) {
          noVerseFoundAction(currentHour.toString(), currentMinute.toString())
          return
        }

        while (!validVerse && attempts < maxAttempts) {
          console.log("Loading Verse 4.1")
          const randomBookIndex = Math.floor(Math.random() * bibleData.length);
          const selectedBook = bibleData[randomBookIndex];

          if (selectedBook?.chapters && currentHour < selectedBook.chapters.length) {
            const selectedChapter = selectedBook.chapters[currentHour];

            if (selectedChapter?.verses && currentMinute < selectedChapter.verses.length) {
              const selectedVerse = selectedChapter.verses[currentMinute];

              if (selectedVerse?.text) {
                validVerse = {
                  book: selectedBook.book,
                  chapter: (currentHour).toString(),
                  verse: (currentMinute).toString(),
                  text: selectedVerse.text
                };
                break;
              }
            }
          }
          attempts++;
        }
        console.log("Loading Verse 5 ", (validVerse != null) ? validVerse.text : "null verse  ")
        if (validVerse) {
          setBookName(validVerse.book);
          setChapter(validVerse.chapter);
          setVerse(validVerse.verse);
          setVerseText(validVerse.text);
        } else {
          noVerseFoundAction(currentHour.toString(), currentMinute.toString())
        }
      } catch (error) {
        console.error('Error updating verse:', error);
      }
    };

    updateVerse();
    const interval = setInterval(updateVerse, 1000);

    return () => clearInterval(interval);
  }, [bibleData, previousTime, isLoading]);

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        Loading Bible verses...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // Centers horizontally
        alignItems: "center", // Centers vertically
        minHeight: "100vh", // Full viewport height
        margin: 0,
        // backgroundColor: "pink",
      }}
    >
      {/* Header */}
      {/* Top-Left Heading */}
      <h1
        style={{
          position: "absolute", // Allows positioning at the top center
          top: "0%", // 10px from the top
          left: "50%", // Start from the horizontal center of the container
          transform: "translateX(-50%)", // Adjust back by 50% of its own width
          paddingTop: (deviceInfo.isMobile == true && deviceInfo.orientation == 'landscape') ? "0%" : "5%"  ,
          fontSize: "1.5  rem",
          fontWeight: "bold",
          color: "black",
          fontFamily: '"Playwrite VN", serif',
          fontOpticalSizing: 'auto',
          fontStyle: 'normal',
          textShadow: '2px 2px 10px white', // Adjust values for size and blur
          overflow: 'none',   // Optional: Hide overflow if the text is too long
        }}
      >
        Bible Clock
      </h1>

      {/* Card */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '10px 10px 10px 10px rgba(0, 0, 0, 0.5)',
          maxWidth: '500px',
          width: '100%', // Use full width on smaller screens
          textAlign: 'center',
        }}
      >
        <div style={{ color: 'black' }}>
          <blockquote
            style={{
              fontSize: '1.2rem', // Slightly smaller font for better scaling
              marginTop: '20px',
            }}
          >
            {verseText}
          </blockquote>
          <p
            style={{
              fontSize: '1rem', // Adjust font size for smaller screens
              textAlign: 'right',
              fontStyle: 'italic',
              marginRight: '10px',
              marginTop: '5px',
            }}
          >
            - <strong>  {bookName} {chapter}:{verse}</strong>
          </p>
        </div>
      </div>
    </div>


  );
};

export default VerseCard;