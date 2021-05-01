interface ClientDataI {
  browser: {
    browser: string;
    version: string;
  };
  os: {
    os: string;
    version: string;
  };
  platform: {
    type: string;
    vendor: string;
    model: string;
  };
}
