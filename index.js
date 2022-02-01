// @ts-check
import readline from 'readline';
import { wordlist } from './words.js';
/**
 *
 * @param {Date} base
 * @param {Date} today
 * @returns
 */
const getDateDifference = (base, today) => {
  const s = new Date(base);
  const t = new Date(today).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
  return Math.round(t / 864e5);
};

const baseDate = new Date(2021, 5, 19, 0, 0, 0, 0);
/**
 *
 * @param {Date} todaysDate
 * @returns
 */
const callGetDateDifference = (todaysDate) => {
  return getDateDifference(baseDate, todaysDate);
};

/**
 *
 * @param {Date} today
 * @returns
 */
const getWordOfTheDay = (today) => {
  const s = callGetDateDifference(today);
  const index = s % wordlist.length;
  return { word: wordlist[index].toUpperCase(), index };
};

/**
 *
 * @param {string[][]} finalResult
 */
const processResult = (finalResult) => {
  let result = '';
  finalResult.forEach((row) => {
    row.forEach((letter) => {
      result += CONVERSION_KEY[letter];
    });
    result += '\n';
  });
  return result;
};
const CONVERSION_KEY = {
  g: '🟩',
  y: '🟨',
  '*': '⬜',
  '-': '⬜',
};
/**
 *
 * @param {string} wordOfTheDay
 * @param {string} guess
 */
const processGuess = (wordOfTheDay, guess) => {
  const resultRow = ['-', '-', '-', '-', '-'];
  const dict = makeDict(wordOfTheDay);

  const upperGuess = guess.toUpperCase();

  const _guess = upperGuess || '     ';

  for (let letterIdx = 0; letterIdx < _guess.length; letterIdx++) {
    const currLetter = _guess[letterIdx];

    if (has(dict, currLetter) && dict[currLetter].length > 0) {
      if (currLetter === wordOfTheDay[letterIdx]) {
        resultRow[letterIdx] = 'g';
      } else {
        resultRow[letterIdx] = 'y';
      }
      dict[currLetter] = dict[currLetter].slice(1);
    } else {
      resultRow[letterIdx] = '*';
    }
  }
  return resultRow;
};

const printResultRow = (resultArr, userWord) => {
  let str = '';
  for (let i = 0; i < resultArr.length && userWord.length; i++) {
    if (resultArr[i] === 'g') {
      str += styleString(userWord[i], 'green');
    } else if (resultArr[i] === 'y') {
      str += styleString(userWord[i], 'yellow');
    } else {
      str += styleString(userWord[i], 'white');
    }
    str += ' ';
  }
  return str;
};

/**
 *
 * @param {string} word
 */
const makeDict = (word) => {
  const upperWord = word.toUpperCase();
  const dict = {};
  for (let i = 0; i < upperWord.length; i++) {
    const letter = upperWord[i];
    if (has(dict, letter)) {
      dict[letter].push(i);
    } else {
      dict[letter] = [i];
    }
  }
  return dict;
};
/**
 *
 * @param {Object} object
 * @param {string} key
 * @returns
 */
const has = (object, key) => {
  return object != null && Object.prototype.hasOwnProperty.call(object, key);
};

const elongate = (guess) => {
  const FOUR_SPACES_TO_BE_ADDED = '    ';
  return guess.length < 5 && guess.length > 0 ? guess + FOUR_SPACES_TO_BE_ADDED : guess;
};
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.on('close', () => process.exit(0));
/**
 *
 * @param {string} query The question to be asked
 * @returns
 */
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
const GUESS_KEY = {
  1: 'First Guess: ',
  2: 'Second Guess: ',
  3: 'Third Guess: ',
  4: 'Fourth Guess: ',
  5: 'Fifth Guess: ',
  6: 'Sixth Guess: ',
};
/**
 *
 * @param {string} text
 * @param {'green' | 'yellow' | 'white' | 'bold' | 'dim'} style
 * @returns A style formatted string
 */
const styleString = (text, style) => {
  if (style === 'green') {
    return `\x1b[30m\x1b[42m${text}\x1b[0m`;
  }
  if (style === 'yellow') {
    return `\x1b[30m\x1b[43m${text}\x1b[0m`;
  }
  if (style === 'white') {
    return `\x1b[30m\x1b[47m${text}\x1b[0m`;
  }
  if (style === 'bold') {
    return `\x1b[1m${text}\x1b[0m`;
  }
  if (style === 'dim') {
    return `\x1b[2m${text}\x1b[0m`;
  }

  return text;
};

(async () => {
  const { word: WORD_OF_THE_DAY, index: INDEX } = getWordOfTheDay(new Date());

  // console.log({ WORD_OF_THE_DAY });
  const boldWordle = styleString('WORDLE', 'bold');
  console.log(`\nGuess the ${boldWordle} in 6 tries.\n`);
  console.log('Each guess must be a valid 5 letter word.');
  console.log('After each guess, your input will be printed to show how close your guess was to the word.\n');
  const _dimContinue = styleString('continue...', 'dim');
  await prompt(_dimContinue);
  console.log();
  const coloredW = styleString('W', 'green');
  console.log(`${coloredW} E A R Y`);
  console.log(`The letter ${coloredW} is in the word, and in the correct spot.\n`);
  await prompt(_dimContinue);
  console.log();

  const coloredI = styleString('I', 'yellow');
  console.log(`P ${coloredI} L L S`);
  console.log(`The letter ${coloredI} is in the word, but in the wrong spot.\n`);

  await prompt(_dimContinue);
  console.log();

  const coloredU = styleString('U', 'white');
  console.log(`V A G ${coloredU} E`);
  console.log(`The letter ${coloredU} is not in the word in any spot.\n`);

  await prompt(_dimContinue);
  console.log();

  console.log(styleString('A new WORLD will be available each day!\n', 'bold'));
  await prompt(styleString('Hit enter to start the game...\n', 'dim'));
  console.log('Starting game...\n');
  console.log('_ _ _ _ _\n\n');

  let currGuess = 1;

  const RESULT = [];
  const RESULT_WITH_TEXT = [];
  while (currGuess <= 6) {
    const rawGuess = await prompt(GUESS_KEY[currGuess]);
    if (rawGuess.length !== 5) {
      console.log(styleString('Guess must be a 5 letter word', 'dim'));
      continue;
    }
    const guess = rawGuess.toUpperCase();
    
    const guessResult = processGuess(WORD_OF_THE_DAY, guess);
    RESULT.push(guessResult);
    const coloredGuess = printResultRow(guessResult, guess);
    RESULT_WITH_TEXT.push(coloredGuess);
    if (guessResult.every((letter) => letter === 'g')) {
      break;
    }
    RESULT_WITH_TEXT.forEach((res) => console.log(res));
    currGuess++;
  }
  console.log('\nYour results...\n');
  RESULT_WITH_TEXT.forEach((res) => console.log(res));
  console.log('\n');
  console.log(`Wordle ${INDEX} ${currGuess}/6\n`);
  console.log(processResult(RESULT), '\n');
  rl.close();
})();
