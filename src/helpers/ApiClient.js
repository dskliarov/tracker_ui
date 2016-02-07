import superagent from 'superagent';
import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function apiServiceUrl(path) {
  if (__SERVER__) {
    return 'http://' + config.apiServiceHost + ':' + config.apiServicePort + path;
  }
  return path;
}

function apiUrl(path) {
  if (__SERVER__) {
    return 'http://' + config.apiHost + ':' + config.Port + path;
  }
  if (path.startsWith('/api')) {
    return path;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return '/api' + path;
}

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  if (adjustedPath.startsWith('/serviceapi')) {
    return apiServiceUrl(adjustedPath);
  }
  return apiUrl(adjustedPath);
}

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body));
      }));
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
