/*!
  Copyright (c) 2020 Jason Tseng.
  Licensed under the MIT License (MIT), see
  https://github.com/jason90929/react-unsaved
*/
/* global define */

'use strict';

(function () {
  'use strict';

  var unsavedInstance = require('./src/unsavedInstance');
  var UnsavedProvider = require('./src/UnsavedProvider');
  var ModalUnsaved = require('./src/ModalUnsaved/ModalUnsaved');

  exports.unsavedInstance = unsavedInstance;
  exports.UnsavedProvider = UnsavedProvider;
  exports.ModalUnsaved = ModalUnsaved;
})();
