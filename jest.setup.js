const fetchMock = require("fetch-mock").default;

fetchMock.config.overwriteRoutes = true;

beforeEach(() => fetchMock.mockGlobal());
afterEach(() => fetchMock.hardReset());
