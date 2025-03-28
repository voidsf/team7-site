import cypressConfig from "@/cypress.config"

const domain = "localhost:3000"

describe('homepage', () => {
    it('loads', () => {
      cy.visit(domain)
      cy.contains("EcoSort Smart Bin")
    })
  
  })
  
describe('login', () => {
    // const user = {
    //     email: 'office@school.com',
    //     pass: 'password'
    // }

    // it('loads', () => {
    //     cy.visit(domain + "/login")
    // })

    // it('contains all required fields', () => {
    //     cy.visit(domain + "/login")

    //     cy.contains("Email")
    //     cy.contains("Password")
    //     cy.contains("Log In")
    // }) 

    it('has clickable login button', () => {
        cy.visit(domain + "/login")
        cy.wait(10000)
        cy.get("#loginsubmit").click()
    })

    // it('returns a \'User not found\' error on invalid email', () => {
    //     cy.visit(domain + '/login')

    //     cy.get('#email').type(user.email)
    //     cy.get('#password').type(user.pass)
    //     cy.get("#password").click()
    // })
})

