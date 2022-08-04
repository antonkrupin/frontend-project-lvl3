import _ from 'lodash';

const parserXML = (data, rssLink) => {
  const id = _.uniqueId();
  const parser = new DOMParser();
  const XMLdata = parser.parseFromString(data, 'application/xml');
  const channel = XMLdata.querySelector('channel');
  const link = channel.querySelector('link').textContent;
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;

  const feed = {
    link, title, description, rendered: false,
  };

  const posts = [];

  channel.querySelectorAll('item').forEach((elem) => {
    const postTitle = elem.querySelector('title').textContent;
    const postDescription = elem.querySelector('description').textContent;
    const postLink = elem.querySelector('link').textContent;
    const postDate = elem.querySelector('pubDate').textContent;

    posts.push({
      postTitle, postDescription, postLink, postDate, rendered: false,
    });
  });

  return {
    id, rssLink, feed, posts,
  };
};

export default parserXML;
