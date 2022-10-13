const parserXML = (data, rssLink) => {
  const parser = new DOMParser();
  const XMLdata = parser.parseFromString(data, 'application/xml');
  const channel = XMLdata.querySelector('channel');
  const link = channel.querySelector('link').textContent;
  const title = channel.querySelector('title').textContent;
  const description = channel.querySelector('description').textContent;

  const feed = {
    link, rssLink, title, description,
  };

  const posts = [];
  channel.querySelectorAll('item').forEach((elem) => {
    const id = String(Date.now());
    const postTitle = elem.querySelector('title').textContent;
    const postDescription = elem.querySelector('description').textContent;
    const postLink = elem.querySelector('link').textContent;
    const postDate = elem.querySelector('pubDate').textContent;
    posts.push({
      id, rssLink, postTitle, postDescription, postLink, postDate,
    });
  });

  return { feed, posts };
};

export default parserXML;
