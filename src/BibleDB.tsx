// BibleRepository.ts
export type Verse = {
  verse: string;
  text: string;
};

export type Chapter = {
  chapter: string;
  verses: Verse[];
};

export type Book = {
  book: string;
  chapters: Chapter[];
};

const fileList = [
  '1Corinthians.json', '1John.json', '1Peter.json', '1Thessalonians.json',
  '1Timothy.json', '2Corinthians.json', '2John.json', '2Peter.json',
  '2Thessalonians.json', '2Timothy.json', '3John.json', 'Acts.json',
  'Colossians.json', 'Ephesians.json', 'Galatians.json', 'Hebrews.json',
  'James.json', 'John.json', 'Jude.json', 'Luke.json', 'Mark.json',
  'Matthew.json', 'Philemon.json', 'Philippians.json', 'Revelation.json',
  'Romans.json', 'Titus.json',
  // Added files
  '1Chronicles.json', '1Kings.json', '1Samuel.json', '2Chronicles.json',
  '2Kings.json', '2Samuel.json', 'Amos.json', 'Daniel.json',
  'Deuteronomy.json', 'Ecclesiastes.json', 'Esther.json', 'Exodus.json',
  'Ezekiel.json', 'Ezra.json', 'Genesis.json', 'Habakkuk.json',
  'Haggai.json', 'Hosea.json', 'Isaiah.json', 'Jeremiah.json', 'Job.json',
  'Joel.json', 'Jonah.json', 'Joshua.json', 'Judges.json', 'Lamentations.json',
  'Leviticus.json', 'Malachi.json', 'Micah.json', 'Nahum.json', 'Nehemiah.json',
  'Numbers.json', 'Obadiah.json', 'Proverbs.json', 'Psalms.json', 'Ruth.json',
  'SongofSolomon.json', 'Zechariah.json', 'Zephaniah.json'
];


export const loadBibleData = async (): Promise<Book[]> => {
  try {
    const bibleDataPromises = fileList.map(async (file) => {
      const response = await fetch(`/Bible-kjv-master/${file}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${file}: ${response.statusText}`);
      }
      const fileContent = await response.json();
      return fileContent as Book;
    });

    return Promise.all(bibleDataPromises);
  } catch (error) {
    console.error('Error loading Bible data:', error);
    return [];
  }
};