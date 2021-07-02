describe("Testing Task Page", () => {
  it("Adds to List", () => {
    cy.visit("http://localhost:8888");
    cy.wait(3000);
    cy.contains("Testing List").click();
    for (let i = 0; i <= 13; i++) {
      cy.get("#addTaskField").type("Sample Task");
      cy.get("#addBtn").click();
    }
    cy.get("#saveBtn").click();
  });
  it("Remove from List", () => {
    for (let i = 0; i <= 10; i++) {
      cy.get("#rmTask").click();
    }
    cy.get("#saveBtn").click();
  });
});
