import _ from 'lodash';

const parserXML = (data) => {
  const id = _.uniqueId();
  const parser = new DOMParser();
  const XMLdata = parser.parseFromString(data, 'application/xml');

  const channel = XMLdata.querySelector('channel');
  const link = channel.querySelector('link').textContent;
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;

  const items = [];

  channel.querySelectorAll('item').forEach((elem) => {
    const itemTitle = elem.querySelector('title').textContent;
    const itemDescription = elem.querySelector('description').textContent;
    const itemLink = elem.querySelector('link').textContent;
    const itemDate = elem.querySelector('pubDate').textContent;

    items.push([itemTitle, itemDescription, itemLink, itemDate, { rendered: false }]);
  });

  return {
    id, link, title, description, items, render: false,
  };
};

export default parserXML;
