const bodyify = (body) => {
  if (body == null) {
    return null;
  }
  if (typeof body === 'string') {
    return body;
  }
  return JSON.stringify(body);
};

const generateRequestHeaders = (headers) => headers || {};

const responseHandler = async (res) => {
  if (res.status !== 200 && res.status !== 304) {
    await res.text();
    return Promise.reject(new Error(`response \`${res.status}\``));
  }
  return res.json();
};

const get = (path) => fetch(`${path}`, {
  credentials: 'include',
  headers: generateRequestHeaders({}),
}).then((res) => responseHandler(res));

const post = (path, data) => fetch(`${path}`, {
  method: 'POST',
  credentials: 'include',
  body: bodyify(data),
  headers: generateRequestHeaders({
    ...typeof data === 'object' ? {
      'content-type': 'application/json',
    } : {},
  }),
}).then((res) => responseHandler(res));

const put = (path, data) => fetch(`${path}`, {
  method: 'PUT',
  credentials: 'include',
  body: bodyify(data),
  headers: generateRequestHeaders({
    ...typeof data === 'object' ? {
      'content-type': 'application/json',
    } : {},
  }),
}).then((res) => responseHandler(res));

const remove = (path) => fetch(`${path}`, {
  credentials: 'include',
  method: 'DELETE',
  headers: generateRequestHeaders({}),
}).then((res) => responseHandler(res));

const blob = (path) => fetch(`${path}`, {
  method: 'GET',
  credentials: 'include',
  headers: generateRequestHeaders({}),
}).then(async (res) => {
  if (res.status !== 200 && res.status !== 304) {
    await res.text();
    return Promise.reject(new Error(`response \`${res.status}\``));
  }
  return res.blob();
});

export default {
  get,
  post,
  remove,
  delete: remove,
  blob,
  put,
};
