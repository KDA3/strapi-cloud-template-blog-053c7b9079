import { errors } from '@strapi/utils';
const { ApplicationError } = errors;

interface Question {
  questionnumber: number;
  questiontext: string;
}

interface GamePollData {
  questions?: Question[];
}

interface Event {
  params: {
    data: GamePollData;
  };
}

export default {
  beforeCreate(event: Event) {
    const { data } = event.params;
    validateQuestionNumbers(data);
  },
  beforeUpdate(event: Event) {
    const { data } = event.params;
    validateQuestionNumbers(data);
  }
};

function validateQuestionNumbers(data: GamePollData) {
  if (!data.questions) return;

  const questionNumbers = data.questions.map(q => q.questionnumber);
  const uniqueNumbers = new Set(questionNumbers);

  if (questionNumbers.length !== uniqueNumbers.size) {
    throw new ApplicationError('Question numbers must be unique within a game poll');
  }

  // Validate that numbers are sequential starting from 1
  const sortedNumbers = [...uniqueNumbers].sort((a, b) => a - b);
  const expectedNumbers = Array.from({ length: sortedNumbers.length }, (_, i) => i + 1);
  
  if (!sortedNumbers.every((num, i) => num === expectedNumbers[i])) {
    throw new ApplicationError('Question numbers must be sequential starting from 1');
  }
} 