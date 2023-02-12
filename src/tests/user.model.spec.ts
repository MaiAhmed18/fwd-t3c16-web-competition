import UserModelStore from "../models/user.model";

const store = new UserModelStore();

describe("User model test", () => {
  it("Should have index method", () => {
    expect(store.index).toBeDefined();
  });

  it("index method should return a list of users", async () => {
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
