import { SelectionOption } from "src/types/typings.t";

const generateCardId: () => string = () => {
  const cardLoops = 4;
  let cardNumber = "";
  for (let index = 0; index <= cardLoops; index++) {
    const number = Math.floor(Math.random() * 1000);
    cardNumber = cardNumber + number;
  }

  return generateNumberWithDashes(cardNumber);
};

const generateCode: (type: string) => string = (type) => {
  const cardLoops = 2;
  const intakeCode = `${type}-`;
  let rowCode = "";
  for (let index = 0; index <= cardLoops; index++) {
    const number = Math.floor(Math.random() * 1000);
    rowCode = rowCode + number;
  }

  return intakeCode + generateNumberWithDashes(rowCode);
};

const generateNumberWithDashes: (number: string) => string = (number) => {
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, "-");
};

const generateAvatar: (
  name: string,
  backgroundColor: string,
  avatarColor: string,
  bold: boolean
) => string = (name, backgroundColor, avatarColor, bold) => {
  return `https://ui-avatars.com/api/?name=${name}&background=${backgroundColor}&color=${avatarColor}&bold=${bold}&font-size=0.33`;
};

const generateACleanSet = (arrayOfData: SelectionOption[]) => {
  const cleanSet = new Set();

  arrayOfData.map((data) => {
    cleanSet.add(data.value);
  });

  return [...cleanSet.values()] as number[];
};

const getRandomStudentCard = (
  studentCards: string[],
  notThisStudentCard?: number
): number => {
  const randomStudentCard = Math.floor(Math.random() * studentCards?.length);

  if (randomStudentCard !== notThisStudentCard) return randomStudentCard;
  return getRandomStudentCard(studentCards, notThisStudentCard);
};

const appUtils = {
  generateCardId,
  generateCode,
  generateACleanSet,
  generateAvatar,
  getRandomStudentCard,
};

export default appUtils;
