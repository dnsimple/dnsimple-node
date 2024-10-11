const fetchMock = require("fetch-mock").default;

fetchMock.config.overwriteRoutes = true;

afterEach(() => fetchMock.restore());
