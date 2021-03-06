/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { i18n } from '@kbn/i18n';

const type = 'conjunction';

const bothArgumentsText = i18n.translate('xpack.kueryAutocomplete.andOperatorDescription.bothArgumentsText', {
  defaultMessage: 'both arguments',
  description: 'Part of xpack.kueryAutocomplete.andOperatorDescription. Full text: "Requires both arguments to be true"'
});
const oneOrMoreArgumentsText = i18n.translate('xpack.kueryAutocomplete.orOperatorDescription.oneOrMoreArgumentsText', {
  defaultMessage: 'one or more arguments',
  description: 'Part of xpack.kueryAutocomplete.orOperatorDescription. Full text: "Requires one or more arguments to be true"'
});

const conjunctions = {
  and: '<p>' +
    i18n.translate('xpack.kueryAutocomplete.andOperatorDescription', {
      defaultMessage: 'Requires {bothArguments} to be true',
      values: { bothArguments: `<span class="suggestionItem__callout">${bothArgumentsText}</span>` },
      description: 'Full text: "Requires both arguments to be true". See ' +
        'xpack.kueryAutocomplete.andOperatorDescription.bothArgumentsText for "both arguments" part.'
    }) +
    '</p>',
  or: '<p>' +
    i18n.translate('xpack.kueryAutocomplete.orOperatorDescription', {
      defaultMessage: 'Requires {oneOrMoreArguments} to be true',
      values: { oneOrMoreArguments: `<span class="suggestionItem__callout">${oneOrMoreArgumentsText}</span>` },
      description: 'Full text: "Requires one or more arguments to be true". See ' +
      'xpack.kueryAutocomplete.orOperatorDescription.oneOrMoreArgumentsText for "one or more arguments" part.'
    }) +
    '</p>'
};

function getDescription(conjunction) {
  return conjunctions[conjunction];
}

export function getSuggestionsProvider() {
  return function getConjunctionSuggestions({ text, end }) {
    if (!text.endsWith(' ')) return [];
    const suggestions = Object.keys(conjunctions).map(conjunction => {
      const text = `${conjunction} `;
      const description = getDescription(conjunction);
      return { type, text, description, start: end, end };
    });
    return suggestions;
  };
}
