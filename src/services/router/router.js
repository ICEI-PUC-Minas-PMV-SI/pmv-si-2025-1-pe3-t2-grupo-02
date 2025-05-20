const getBasePath = () => {
  return window.location.pathname.includes('src') ? '/src/' : '/';
};

const redirectToPage = (page) => {
  const basePath = getBasePath();
  window.location.pathname = page === 'index.html' ? basePath : basePath + 'pages/' + page;
};

window.redirectToPage = redirectToPage;
