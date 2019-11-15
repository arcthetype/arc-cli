import repo from "../utils/repository";

// 测试模板列表
test("download template list", async () => {
  expect.assertions(1);
  let result = await repo.getTemplatesList();
  expect(result.list).toBeTruthy();
});
