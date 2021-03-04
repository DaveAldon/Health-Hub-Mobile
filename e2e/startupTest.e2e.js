describe("Example", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    //await device.reloadReactNative();
  });

  it("should start at BLE selection screen", async () => {
    await expect(element(by.label("Start Scan"))).toBeVisible();
  });

  it("should show graph after navigating", async () => {
    await element(by.id("NavHamburger")).tap();
    await waitFor(element(by.label("Graph")))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.label("Graph")).tap();
    await waitFor(element(by.id("ResetIntervalButton")))
      .toBeVisible()
      .withTimeout(2000);
  });

  /* it('should show hello screen after tap', async () => {
    await element(by.id('hello_button')).tap();
    await expect(element(by.text('Hello!!!'))).toBeVisible();
  });

  it('should show world screen after tap', async () => {
    await element(by.id('world_button')).tap();
    await expect(element(by.text('World!!!'))).toBeVisible();
  }); */
});
