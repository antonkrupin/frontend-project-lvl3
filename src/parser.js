import _ from 'lodash';

const parserXML = (data) => {
  const id = _.uniqueId();
  const parser = new DOMParser();
  const XMLdata = parser.parseFromString(data, 'application/xml');
  const title = XMLdata.querySelector('channel').querySelector('title').textContent;
  const description = XMLdata.querySelector('channel').querySelector('description').textContent;
  return { id, title, description };
};

export default parserXML;
