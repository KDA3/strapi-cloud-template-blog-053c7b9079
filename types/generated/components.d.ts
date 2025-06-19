import type { Schema, Struct } from '@strapi/strapi';

export interface PollsPollQuestion extends Struct.ComponentSchema {
  collectionName: 'components_polls_poll_questions';
  info: {
    displayName: 'poll-question';
  };
  attributes: {
    questionNumber: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 1;
        },
        number
      >;
    questionText: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'polls.poll-question': PollsPollQuestion;
    }
  }
}
