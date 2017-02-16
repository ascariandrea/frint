import extendApp from './extendApp';

import createFactory from './createFactory';
import createService from './createService';
import makeMapToProps from './mapToProps';

export default {
  install(Frint) {
    extendApp(Frint);

    Frint.createFactory = createFactory;
    Frint.createService = createService;
    Frint.mapToProps = makeMapToProps(Frint);
  }
};
