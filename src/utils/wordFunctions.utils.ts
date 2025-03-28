export const capitalizeWord = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const capitalizeSentence = (sentence: string) => {
  return sentence.split(' ').map(capitalizeWord).join(' ');
};
