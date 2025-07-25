'use strict';

/**
 * game-team service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::game-team.game-team');
