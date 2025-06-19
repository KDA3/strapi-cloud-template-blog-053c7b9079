/**
 * game-poll controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::game-poll.game-poll', ({ strapi }) => ({
  async find(ctx) {
    try {
      const { data, meta } = await super.find(ctx);
      
      // Transform the response to maintain camelCase
      const transformedData = data.map(item => {
        const { attributes, ...rest } = item;
        const { questions, ...otherAttributes } = attributes || {};
        
        return {
          ...rest,
          attributes: {
            ...otherAttributes,
            questions: Array.isArray(questions) 
              ? questions.map(q => ({
                  questionNumber: q.questionNumber,
                  questionText: q.questionText
                }))
              : []
          }
        };
      });

      return { data: transformedData, meta };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async findOne(ctx) {
    try {
      const { data, meta } = await super.findOne(ctx);
      
      if (data) {
        const { attributes, ...rest } = data;
        const { questions, ...otherAttributes } = attributes || {};

        const transformedData = {
          ...rest,
          attributes: {
            ...otherAttributes,
            questions: Array.isArray(questions)
              ? questions.map(q => ({
                  questionNumber: q.questionNumber,
                  questionText: q.questionText
                }))
              : []
          }
        };
        return { data: transformedData, meta };
      }
      return { data, meta };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));
