'use strict';

/**
 * scheduled-game service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::scheduled-game.scheduled-game');
