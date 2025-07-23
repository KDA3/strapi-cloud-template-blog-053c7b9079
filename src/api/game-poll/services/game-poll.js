'use strict';

/**
 * game-poll service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-poll.game-poll');
