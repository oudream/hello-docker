
let deepmergeAll = require('./deepmerge1')

const result = deepmergeAll([,
    { level1: { level2: { name: 'David', parts: ['head', 'shoulders'] } } },
    { level1: { level2: { face: 'meh', parts: ['knees', 'toes'] } } },
    { level1: { level2: { eyes: 'more meh', parts: ['eyes'] } } },
]);

console.log(result);
