describe("Testing Task Page", () => {
  it("Adds to List", () => {
    cy.visit("http://localhost:8888/lists");
    for (let i = 0; i <= 10; i++) {
      cy.get("#addTaskField").type("Sample Text");
      cy.get("#addBtn").click();
    }
  });
});
