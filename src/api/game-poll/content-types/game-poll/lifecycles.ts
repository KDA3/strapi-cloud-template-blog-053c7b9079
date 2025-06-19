import { errors } from '@strapi/utils';
const { ApplicationError } = errors;

interface Question {
  questionNumber: number;
  questionText: string;
  id?: number;
}

interface GamePollData {
  questions?: Question[];
  publishedAt?: string | null;
}

interface Event {
  params: {
    data: GamePollData;
  };
}

export default {
  async beforeCreate(event: Event) {
    const { data } = event.params;
    await validateQuestionNumbers(data, false);
  },
  async beforeUpdate(event: Event) {
    const { data } = event.params;
    const isPublishing = data.publishedAt !== null && data.publishedAt !== undefined;
    await validateQuestionNumbers(data, isPublishing);
  }
};

async function validateQuestionNumbers(data: GamePollData, strictValidation: boolean = false) {
  if (!data.questions || data.questions.length === 0) {
    return;
  }

  const validQuestions: Question[] = [];

  // Collect all questions with valid question numbers
  for (const question of data.questions) {
    if (question.questionNumber > 0) {
      // Direct question data
      validQuestions.push(question);
    } else if (question.id) {
      // Fetch existing question data
      try {
        const componentData = await strapi.db.query('polls.poll-question').findOne({
          where: { id: question.id }
        });
        if (componentData?.questionNumber > 0) {
          validQuestions.push(componentData);
        }
      } catch (error) {
        // Skip invalid components
      }
    }
  }

  if (validQuestions.length <= 1) {
    return; // No validation needed for 0 or 1 questions
  }

  const questionNumbers = validQuestions.map(q => q.questionNumber);
  const uniqueNumbers = new Set(questionNumbers);

  // Check for duplicates
  if (questionNumbers.length !== uniqueNumbers.size) {
    throw new ApplicationError('Question numbers must be unique within a game poll');
  }

  // Check sequential numbering only when publishing
  if (strictValidation) {
    const sortedNumbers = [...uniqueNumbers].sort((a, b) => a - b);
    const expectedNumbers = Array.from({ length: sortedNumbers.length }, (_, i) => i + 1);
    
    if (!sortedNumbers.every((num, i) => num === expectedNumbers[i])) {
      throw new ApplicationError('Question numbers must be sequential starting from 1 when publishing');
    }
  }
} 