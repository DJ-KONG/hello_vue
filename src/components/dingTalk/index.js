// import '../src/assets/font/iconfont.css';
import init from 'packages/init';
import apis from 'packages/apis';

const version = '0.0.1';
const install = function(Vue, config = {}) {
  if (install.installed) return;
  Vue.component(init.name,init);
  Vue.component(apis.name,apis);
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};

module.exports = {
  install,
  version,
  init,
  apis,
};
